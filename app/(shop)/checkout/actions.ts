/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Checkout Server Actions                                            │
 * │  File: app/(shop)/checkout/actions.ts                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Action that handles the first phase of checkout:                     │
 * │  1. Authenticate the user.                                                   │
 * │  2. Re-price all items server-side from the database.                        │
 * │     (Prevents client-side price tampering.)                                  │
 * │  3. Create a Razorpay order via their API.                                   │
 * │  4. Persist a 'pending' order + order_items record in Supabase.              │
 * │  5. Return the Razorpay order ID to the client so it can open the popup.    │
 * │                                                                              │
 * │  SECURITY MODEL:                                                             │
 * │  - Uses the cookie-based Supabase client (anon key), so RLS applies.         │
 * │  - The INSERT into orders succeeds only because of the RLS policy in         │
 * │    migration 20260510000001_rls_write_policies.sql.                          │
 * │  - Total amount is NEVER taken from the client. It is always recalculated    │
 * │    from the database price to prevent price manipulation.                    │
 * │                                                                              │
 * │  KNOWN LIMITATION:                                                           │
 * │  If the order_items INSERT fails after the orders INSERT succeeds, a         │
 * │  ghost order record is left in the DB. Production fix: wrap both inserts     │
 * │  in a Supabase RPC (stored procedure) using a PostgreSQL transaction.        │
 * │  See TASKS.md → L-2 for details.                                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getRazorpayInstance } from "@/utils/razorpay";

/**
 * submitOrder — Server Action for the checkout form.
 *
 * Called by CheckoutClient.tsx when the user submits the checkout form.
 * Returns either an error object or a success object containing the
 * Razorpay order ID so the client can open the payment popup.
 *
 * @param formData - FormData from the checkout form. Expected fields:
 *   - cartItems: JSON string of { productId: string; quantity: number }[]
 *   - address:   Street address string
 *   - city:      City string
 *   - pincode:   6-digit PIN code string
 *
 * @returns {{ error: string }} on failure
 * @returns {{ success: true, orderId: string, razorpayOrderId: string, totalAmount: number }} on success
 */
export async function submitOrder(formData: FormData) {
  const supabase = await createClient();

  // ── Step 1: Authentication ──────────────────────────────────────────────────
  // getUser() validates the JWT with Supabase Auth servers (not just the cookie).
  // This is the correct way to verify identity server-side.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to place an order." };
  }

  // ── Step 2: Extract & Validate Form Data ────────────────────────────────────
  const cartItemsRaw = formData.get("cartItems") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const pincode = formData.get("pincode") as string;

  if (!cartItemsRaw || !address || !city || !pincode) {
    return { error: "Missing required fields." };
  }

  let cartItems: { productId: string; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(cartItemsRaw);
  } catch (e) {
    return { error: "Invalid cart data." };
  }

  if (cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  // ── Step 3: Server-Side Price Recalculation ─────────────────────────────────
  // We NEVER trust the price from the client. We fetch prices from the database
  // using the product IDs from the cart. If a product doesn't exist or is
  // inactive, we return an error.
  const productIds = cartItems.map((item) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, base_price")
    .in("id", productIds);

  if (productsError || !products) {
    return { error: "Error validating products." };
  }

  let totalAmount = 0;
  let orderItemsData: { product_id: string; quantity: number; unit_price: number }[] = [];

  try {
    orderItemsData = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) throw new Error(`Product ${cartItem.productId} not found`);

      const itemTotal = product.base_price * cartItem.quantity;
      totalAmount += itemTotal;

      return {
        product_id: product.id,
        quantity: cartItem.quantity,
        unit_price: product.base_price,
      };
    });
  } catch (err) {
    return { error: "One or more products could not be found. Please refresh and try again." };
  }

  // ── Step 4: Create Razorpay Order ───────────────────────────────────────────
  // We create the Razorpay order BEFORE writing to our DB. This way, if the
  // Razorpay API is down, we fail early without a ghost order in the DB.
  let razorpayOrderId: string | null = null;
  try {
    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      // Razorpay expects amount in paise. ₹1 = 100 paise.
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      // Receipt must be ≤ 40 characters. We use user ID prefix + timestamp.
      receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`.substring(0, 40),
    });
    razorpayOrderId = rzpOrder.id;
  } catch (error) {
    console.error("[submitOrder] Razorpay order creation failed:", error);
    return { error: "Failed to initialize payment gateway. Please try again." };
  }

  // ── Step 5: Calculate Delivery Date ─────────────────────────────────────────
  // Standard delivery is 2 business days.
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  // ── Step 6: Persist Order in Supabase ───────────────────────────────────────
  // Status starts as 'pending'. It will be updated to 'processing' by
  // /api/payment-verify after Razorpay confirms the payment.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_amount: totalAmount,
      delivery_date: deliveryDate.toISOString().split("T")[0],
      razorpay_order_id: razorpayOrderId,
      // Delivery address fields added in migration 20260510000002_indexes_and_schema.sql
      delivery_address: address,
      city: city,
      pincode: pincode,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Failed to create order. Please try again." };
  }

  // ── Step 7: Persist Order Items ─────────────────────────────────────────────
  // KNOWN LIMITATION: If this fails, the order record above is orphaned.
  // Production fix: use a Supabase RPC transaction. See TASKS.md → L-2.
  const itemsToInsert = orderItemsData.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    return { error: "Failed to save order items. Please contact support." };
  }

  // ── Step 8: Return Success to Client ────────────────────────────────────────
  // The client (CheckoutClient.tsx) uses razorpayOrderId to open the payment popup.
  return { success: true, orderId: order.id, razorpayOrderId, totalAmount };
}
