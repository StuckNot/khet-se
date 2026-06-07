/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Trial Kits / Subscription Wizard Form                              │
 * │  File: app/(shop)/trial-kits/SubscriptionWizard.tsx                          │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  A 2-step interactive form allowing users to select a product and a delivery │
 * │  frequency (weekly, bi-weekly, monthly) for subscription creation.           │
 * │                                                                              │
 * │  HOW IT WORKS:                                                               │
 * │  1. Uses standard React state to track user selections.                      │
 * │  2. Submits data to `createSubscription` (a Server Action) using `FormData`. │
 * │                                                                              │
 * │  INCOMPLETE STATUS:                                                          │
 * │  Currently, the form successfully creates a subscription record in Supabase, │
 * │  but it skips payment collection. See TASKS.md -> R-3 for the remaining      │
 * │  Razorpay integration steps (creating a mandate via checkout popup).         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState } from "react";
import type { Tables } from "@/types/database.types";
import { createSubscriptionAndOrder } from "./actions";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { RazorpayPaymentResponse, RazorpayPaymentFailedResponse } from "@/types/razorpay.d";

type Product = Tables<"products">;

interface SubscriptionWizardProps {
  products: Product[];
}

export default function SubscriptionWizard({ products }: SubscriptionWizardProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [frequency, setFrequency] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createSubscriptionAndOrder(formData);
      
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

        const options = {
          key: rzpKey,
          amount: Math.round(result.totalAmount! * 100),
          currency: "INR",
          name: "KhetSe",
          description: "Fresh Farm Staples Subscription",
          order_id: result.razorpayOrderId,
          handler: async function (response: RazorpayPaymentResponse) {
            try {
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
                router.push("/account?subscription=success");
              } else {
                setErrorMsg("Payment verification failed. Please contact support.");
                setIsSubmitting(false);
              }
            } catch (err) {
              setErrorMsg("An error occurred during verification.");
              setIsSubmitting(false);
            }
          },
          theme: { color: "#7B4B2A" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: RazorpayPaymentFailedResponse) {
          setErrorMsg(response.error.description || "Payment failed. Please try again.");
          setIsSubmitting(false);
        });
        rzp.open();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (products.length === 0) {
    return <div className="text-center py-12">No trial kits currently available. Please check back later.</div>;
  }

  const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_') ?? false;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
        {/* ─── Column 1: Selection ─── */}
        <div className="space-y-8">
          {/* ─── Step 1: Select Box ─── */}
          <div>
            <div>
              <h2 className="text-2xl font-bold text-brand-primary mb-2">1. Choose Your Box</h2>
              <p className="text-sm text-brand-primary/60 mb-4">Select the organic staples you want delivered.</p>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <label
                  key={product.id}
                  className={`block cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    selectedProductId === product.id
                      ? "border-brand-secondary bg-brand-secondary/5"
                      : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="productId"
                      value={product.id}
                      checked={selectedProductId === product.id}
                      onChange={() => setSelectedProductId(product.id)}
                      className="mt-1 text-brand-secondary focus:ring-brand-secondary"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-primary">{product.name}</h3>
                      <p className="text-sm text-brand-primary/60 mt-1 line-clamp-2">{product.description}</p>
                      <p className="font-bold text-brand-primary mt-2">₹{product.base_price} <span className="text-xs font-normal text-brand-primary/50">/ delivery</span></p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ─── Step 2: Select Frequency ─── */}
          <div>
            <div>
              <h2 className="text-2xl font-bold text-brand-primary mb-2">2. Delivery Schedule</h2>
              <p className="text-sm text-brand-primary/60 mb-4">How often do you want your pantry restocked?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Weekly", days: 7, desc: "Best for large families" },
                { label: "Bi-Weekly", days: 14, desc: "Most popular choice" },
                { label: "Monthly", days: 30, desc: "Perfect for couples" },
              ].map((option) => (
                <label
                  key={option.days}
                  className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                    frequency === option.days
                      ? "border-brand-secondary bg-brand-secondary/5"
                      : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.days}
                    checked={frequency === option.days}
                    onChange={() => setFrequency(option.days)}
                    className="sr-only" // Hidden visually, but captures form data
                  />
                  <span className="block font-bold text-brand-primary">{option.label}</span>
                  <span className="block text-xs text-brand-primary/50 mt-1">{option.desc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Column 2: Delivery & Summary ─── */}
        <div className="space-y-8">
          {/* ─── Step 3: Delivery Details ─── */}
          <div>
            <div>
              <h2 className="text-2xl font-bold text-brand-primary mb-2">3. Delivery Details</h2>
              <p className="text-sm text-brand-primary/60 mb-4">Where should we send your first box?</p>
            </div>
            <div className="space-y-4 rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-brand-primary mb-1">Street Address</label>
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
                  <label htmlFor="city" className="block text-sm font-medium text-brand-primary mb-1">City</label>
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
                  <label htmlFor="pincode" className="block text-sm font-medium text-brand-primary mb-1">PIN Code</label>
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
            {isTestMode && (
              <div className="mt-4 rounded-lg bg-brand-accent/10 p-4 border border-brand-accent/20">
                <p className="text-sm text-brand-primary font-medium flex items-start gap-2">
                  <span className="text-brand-accent text-lg leading-none">ℹ</span>
                  <span>You are currently in Test Mode. Use dummy card details.</span>
                </p>
              </div>
            )}
          </div>

          {/* ─── Order Summary ─── */}
          <div className="rounded-xl bg-brand-primary p-6 text-brand-canvas shadow-lg">
            <h3 className="text-lg font-bold mb-4">Subscription Summary</h3>
            <div className="space-y-2 text-sm mb-6 opacity-90">
              <div className="flex justify-between">
                <span>Selected Kit</span>
                <span className="font-bold">{selectedProduct?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold">Every {frequency} Days</span>
              </div>
              <div className="flex justify-between border-t border-brand-canvas/20 pt-2 mt-2">
                <span>First delivery total</span>
                <span className="font-bold text-brand-accent">₹{selectedProduct?.base_price}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-100">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-secondary py-4 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Setting up..." : "Pay & Subscribe Now"}
            </button>
            
            <p className="mt-3 text-center text-xs opacity-60">
              MVP Launch Flow: You'll be charged for your first box now. Future boxes will be invoiced separately.
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
