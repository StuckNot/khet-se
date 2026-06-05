/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Trial Kits Subscription Server Action                              │
 * │  File: app/(shop)/trial-kits/actions.ts                                      │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Action called by the SubscriptionWizard component when the user       │
 * │  submits the trial kit form. Creates a subscription record in the DB.        │
 * │                                                                              │
 * │  CURRENT STATUS — INCOMPLETE:                                                 │
 * │  Payment collection is NOT implemented yet. The subscription is created with  │
 * │  status = "active" immediately, but no payment is charged.                   │
 * │                                                                              │
 * │  PENDING IMPLEMENTATION (see TASKS.md → Batch 7b, R-3):                      │
 * │  1. Create a Razorpay Subscription/Mandate via razorpay.subscriptions.create  │
 * │  2. Store the returned razorpay_subscription_id in the subscriptions table    │
 * │  3. Redirect the user to the Razorpay mandate authorization URL              │
 * │  4. Handle the webhook in app/api/razorpay-webhook/route.ts                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * createSubscription — creates a new subscription record in Supabase.
 *
 * Called by SubscriptionWizard.tsx on form submission.
 * Returns an error object if something fails (displayed in the UI).
 * On success, revalidates the account page and redirects there.
 *
 * @param formData - Expected fields:
 *   - productId:  The UUID of the selected product.
 *   - frequency:  Delivery frequency in days (7, 14, or 30).
 *
 * @returns {{ error: string }} on failure
 * @returns void (redirects) on success
 */
export async function createSubscriptionAndOrder(formData: FormData) {
  const supabase = await createClient();

  // ── Authentication ──────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please log in to subscribe." };
  }

  // ── Input Extraction & Validation ───────────────────────────────────────────
  const productId = formData.get("productId") as string;
  const frequencyRaw = formData.get("frequency");
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const pincode = formData.get("pincode") as string;

  if (!productId || !frequencyRaw || !address || !city || !pincode) {
    return { error: "Missing required subscription or delivery details." };
  }

  const frequency = parseInt(frequencyRaw as string, 10);
  
  if (isNaN(frequency)) {
    return { error: "Invalid delivery frequency." };
  }

  // ── Server-Side Price Fetching ────────────────────────────────────────────
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, base_price")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Failed to validate product. Please try again." };
  }

  const totalAmount = product.base_price;

  // ── Calculate Delivery Dates ────────────────────────────────────────────────
  // The first delivery is standard 2 business days from today.
  // The next subscription delivery is `frequency` days from today.
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequency);

  // ── Create Razorpay Order ───────────────────────────────────────────────────
  let razorpayOrderId: string | null = null;
  try {
    const { getRazorpayInstance } = await import('@/utils/razorpay');
    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt: `sub_${user.id.slice(0, 8)}_${Date.now()}`.substring(0, 40),
    });
    razorpayOrderId = rzpOrder.id;
  } catch (error) {
    console.error("[createSubscriptionAndOrder] Razorpay order creation failed:", error);
    return { error: "Failed to initialize payment gateway. Please try again." };
  }

  // ── Insert Subscription ─────────────────────────────────────────────────────
  // Create subscription as 'paused'. It will be activated by /api/payment-verify.
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      product_id: productId,
      delivery_frequency_days: frequency,
      next_delivery_date: nextDeliveryDate.toISOString().split("T")[0],
      status: "paused", // Will become 'active' when first order is paid
    })
    .select("id")
    .single();

  if (subError || !subscription) {
    return { error: "Failed to create subscription. Please contact support." };
  }

  // ── Insert Order (for the first box) ────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_amount: totalAmount,
      delivery_date: deliveryDate.toISOString().split("T")[0],
      razorpay_order_id: razorpayOrderId,
      subscription_id: subscription.id,
      delivery_address: address,
      city: city,
      pincode: pincode,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    // If order fails, we should ideally delete the subscription, but keeping it paused is safe enough.
    return { error: "Failed to create order. Please try again." };
  }

  // ── Insert Order Items ──────────────────────────────────────────────────────
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      unit_price: product.base_price,
    });

  if (itemsError) {
    return { error: "Failed to save order items. Please contact support." };
  }

  // Return success to the client so it can open the Razorpay popup
  return { success: true, orderId: order.id, razorpayOrderId, totalAmount };
}
