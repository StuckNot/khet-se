/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Checkout Client Component                                          │
 * │  File: app/(shop)/checkout/CheckoutClient.tsx                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Client-side checkout UI. Handles a three-phase payment flow:                │
 * │                                                                              │
 * │  Phase 1 — submitOrder() server action:                                      │
 * │    Validates the cart, re-prices items server-side (prevents price           │
 * │    tampering), creates a Razorpay order via their API, and persists a        │
 * │    'pending' order record in Supabase.                                       │
 * │                                                                              │
 * │  Phase 2 — Razorpay popup:                                                   │
 * │    Opens the Razorpay checkout modal (loaded via <Script />) which           │
 * │    collects card/UPI details from the user.                                  │
 * │                                                                              │
 * │  Phase 3 — /api/payment-verify:                                              │
 * │    After Razorpay confirms payment, the handler callback fires.              │
 * │    We send the payment IDs and HMAC signature to our server for              │
 * │    cryptographic verification. Only on success do we update the DB and       │
 * │    redirect the user to the success page.                                    │
 * │                                                                              │
 * │  SECURITY CRITICAL:                                                          │
 * │  Never trust the Razorpay success callback alone. A malicious user can       │
 * │  forge it. The HMAC signature verification in /api/payment-verify is the     │
 * │  authoritative proof of payment.                                             │
 * │                                                                              │
 * │  TYPE SAFETY:                                                                │
 * │  Razorpay window types are declared in types/razorpay.d.ts.                 │
 * │  No `any` casts are needed anywhere in this file.                            │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  window.Razorpay, React state for the form lifecycle, and localStorage       │
 * │  (via Zustand persist) are all browser-only APIs.                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { submitOrder } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import type { RazorpayPaymentResponse, RazorpayPaymentFailedResponse } from "@/types/razorpay.d";

export default function CheckoutClient() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  /**
   * Hydration guard.
   * Zustand's `persist` middleware loads cart state from localStorage.
   * On the server there is no localStorage, so the initial render will
   * always show an empty cart. We wait for client-side mount before
   * rendering cart contents to prevent a React hydration mismatch error.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-brand-primary mb-4">Your cart is empty</h2>
        <p className="text-brand-primary/60 mb-8">Add some organic staples before checking out.</p>
        <Link href="/" className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90">
          Return to Store
        </Link>
      </div>
    );
  }

  /**
   * handleSubmit — main form submission handler.
   * Orchestrates the three-phase payment flow described in the file header.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Serialize the cart to JSON so the server action can access it.
    // We cannot pass objects directly to server actions — only primitives
    // and FormData are supported.
    const cartPayload = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    formData.append("cartItems", JSON.stringify(cartPayload));

    try {
      // PHASE 1: Server action — validate cart, create Razorpay order, persist DB record.
      const result = await submitOrder(formData);

      if (result?.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        // Initialize Razorpay
        const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!rzpKey) {
          setErrorMsg("Razorpay Key is missing on the client. Please restart your Next.js server.");
          setIsSubmitting(false);
          return;
        }

        // PHASE 2: Open the Razorpay payment popup.
        const options = {
          key: rzpKey,
          // Razorpay requires amount in paise (smallest currency unit).
          // ₹1 = 100 paise. We round to avoid floating-point issues.
          amount: Math.round(result.totalAmount! * 100),
          currency: "INR",
          name: "KhetSe",
          description: "Fresh Farm Staples",
          order_id: result.razorpayOrderId,

          /**
           * SUCCESS HANDLER
           * Called by Razorpay after the user completes payment in the popup.
           *
           * ⚠️  DO NOT fulfill the order here.
           * A malicious user can call this handler manually in DevTools.
           * Always send the IDs to /api/payment-verify first and only
           * trust the response from our server.
           */
          handler: async function (response: RazorpayPaymentResponse) {
            try {
              // PHASE 3: Server-side HMAC signature verification.
              const verifyRes = await fetch('/api/payment-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: result.orderId
                })
              });
              
              if (verifyRes.ok) {
                clearCart();
                router.push("/account?order=success");
              } else {
                setErrorMsg("Payment verification failed. Please contact support.");
                setIsSubmitting(false);
              }
            } catch (err) {
              setErrorMsg("An error occurred during verification.");
              setIsSubmitting(false);
            }
          },
          theme: {
            color: "#2E7D32" // brand-secondary
          }
        };

        // window.Razorpay is typed via types/razorpay.d.ts — no `any` cast needed.
        const rzp = new window.Razorpay(options);

        /**
         * FAILURE HANDLER
         * Called when the user's payment is declined, they close the modal, or
         * an error occurs (e.g. insufficient funds, wrong OTP).
         * We show Razorpay's human-readable description to the user.
         */
        rzp.on('payment.failed', function (response: RazorpayPaymentFailedResponse) {
          setErrorMsg(response.error.description || "Payment failed. Please try again.");
          setIsSubmitting(false);
        });

        rzp.open();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  /**
   * isTestMode — drives the visibility of the test-mode info banner.
   * Razorpay test keys always start with "rzp_test_".
   * In production (keys start with "rzp_live_"), this banner will be hidden.
   */
  const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_') ?? false;

  return (
    <>
      {/* Load the Razorpay checkout script — this injects window.Razorpay */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="grid gap-8 lg:grid-cols-12">
      {/* ─── Checkout Form ─── */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-brand-primary mb-6">Delivery Details</h2>
          
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-200">
              {errorMsg}
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-brand-primary mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="123 Farm Lane, Apt 4B"
                  className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-brand-primary mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    placeholder="New Delhi"
                    className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-brand-primary mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    placeholder="110001"
                    className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                  />
                </div>
              </div>
            </div>

            {/* Test-mode info banner — only visible when NEXT_PUBLIC_RAZORPAY_KEY_ID starts with "rzp_test_" */}
            {isTestMode && (
              <div className="rounded-lg bg-brand-accent/10 p-4 border border-brand-accent/20">
                <p className="text-sm text-brand-primary font-medium flex items-start gap-2">
                  <span className="text-brand-accent text-lg leading-none">ℹ</span>
                  <span>You are currently in Test Mode. Use any dummy card details provided by Razorpay to complete the transaction.</span>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ─── Order Summary Sidebar ─── */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="sticky top-24 rounded-xl border border-brand-primary/10 bg-brand-canvas p-6 shadow-lg">
          <h3 className="text-lg font-bold text-brand-primary mb-6">Order Summary</h3>
          
          {/* Scrollable cart items list */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <div className="flex-1 pr-4">
                  <p className="font-bold text-brand-primary truncate">{item.product.name}</p>
                  <p className="text-brand-primary/50 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-brand-primary whitespace-nowrap">
                  ₹{item.product.base_price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-brand-primary/10 pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-sm text-brand-primary/70">
              <span>Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-primary/70">
              <span>Delivery</span>
              <span className="text-brand-secondary font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-brand-primary pt-2 border-t border-brand-primary/5">
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </div>

          {/* Submit button — linked to the form via form="checkout-form" */}
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-secondary py-4 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
