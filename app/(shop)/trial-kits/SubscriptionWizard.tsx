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
          theme: { color: "#C26D3A" } // Updated to brand accent color
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
    return <div className="text-center py-12 text-brand-secondary">No trial kits currently available. Please check back later.</div>;
  }

  const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_') ?? false;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto grid gap-10 md:grid-cols-12 text-left items-start">
        {/* ─── Column 1: Selection ─── */}
        <div className="space-y-10 md:col-span-7">
          {/* ─── Step 1: Select Box ─── */}
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl text-brand-primary mb-1">1. Choose Your Box</h2>
              <p className="text-sm text-brand-secondary">Select the organic staples you want delivered.</p>
            </div>
            <div className="space-y-4">
              {products.map((product) => {
                const isActive = selectedProductId === product.id;
                return (
                  <label
                    key={product.id}
                    className={`block cursor-pointer rounded-2xl border-2 p-5 transition-all outline-none focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:ring-offset-2 ${
                      isActive
                        ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                        : "border-brand-secondary/15 bg-brand-canvas hover:border-brand-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* We keep the radio button for form submission and a11y, but hide it visually and use a custom icon */}
                      <input
                        type="radio"
                        name="productId"
                        value={product.id}
                        checked={isActive}
                        onChange={() => setSelectedProductId(product.id)}
                        className="sr-only" // visually hidden
                      />
                      
                      {/* Custom Radio Icon */}
                      <div className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${
                        isActive ? "border-brand-accent bg-brand-accent text-white" : "border-brand-secondary/40"
                      }`}>
                        {isActive && <CheckCircleIcon className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-display text-lg text-brand-primary leading-tight">{product.name}</h3>
                        <p className="text-xs text-brand-secondary mt-1.5 leading-relaxed line-clamp-2">{product.description}</p>
                        <p className="font-display text-lg text-brand-primary mt-3">₹{product.base_price} <span className="text-xs font-sans text-brand-secondary">/ delivery</span></p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ─── Step 2: Select Frequency ─── */}
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl text-brand-primary mb-1">2. Delivery Schedule</h2>
              <p className="text-sm text-brand-secondary">How often do you want your pantry restocked?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Weekly", days: 7, desc: "Best for large families" },
                { label: "Bi-Weekly", days: 14, desc: "Most popular choice" },
                { label: "Monthly", days: 30, desc: "Perfect for couples" },
              ].map((option) => {
                const isActive = frequency === option.days;
                return (
                  <label
                    key={option.days}
                    className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all outline-none focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:ring-offset-2 ${
                      isActive
                        ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                        : "border-brand-secondary/15 bg-brand-canvas hover:border-brand-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.days}
                      checked={isActive}
                      onChange={() => setFrequency(option.days)}
                      className="sr-only"
                    />
                    <span className="block font-display text-lg text-brand-primary">{option.label}</span>
                    <span className="block text-xs text-brand-secondary mt-1.5">{option.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* ─── Step 3: Delivery Details ─── */}
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl text-brand-primary mb-1">3. Delivery Details</h2>
              <p className="text-sm text-brand-secondary">Where should we send your first box?</p>
            </div>
            <div className="space-y-4 rounded-3xl border border-brand-secondary/15 bg-brand-canvas p-6 sm:p-8 shadow-sm">
              <div>
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="123 Farm Lane, Apt 4B"
                  className="w-full rounded-xl border border-brand-secondary/30 bg-brand-beige px-4 py-3.5 text-sm text-brand-primary placeholder:text-brand-secondary/60 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-shadow"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    placeholder="New Delhi"
                    className="w-full rounded-xl border border-brand-secondary/30 bg-brand-beige px-4 py-3.5 text-sm text-brand-primary placeholder:text-brand-secondary/60 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">PIN Code</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    placeholder="110001"
                    className="w-full rounded-xl border border-brand-secondary/30 bg-brand-beige px-4 py-3.5 text-sm text-brand-primary placeholder:text-brand-secondary/60 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-shadow"
                  />
                </div>
              </div>
            </div>
            {isTestMode && (
              <div className="mt-4 rounded-xl bg-brand-accent/10 p-4 border border-brand-accent/20 flex items-start gap-3">
                <span className="text-brand-accent text-lg leading-none mt-0.5">ℹ</span>
                <p className="text-sm text-brand-primary font-medium">
                  You are currently in Test Mode. Use dummy card details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Column 2: Order Summary ─── */}
        <div className="md:col-span-5 sticky top-24">
          <div className="rounded-3xl bg-brand-beige p-6 sm:p-8 border border-brand-secondary/20 shadow-sm relative overflow-hidden">
            {/* Subtle decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="font-display text-2xl text-brand-primary mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm mb-8 text-brand-primary">
              <div className="flex justify-between items-start gap-4">
                <span className="text-brand-secondary">Selected Box</span>
                <span className="font-semibold text-right">{selectedProduct?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-secondary">Delivery Cycle</span>
                <span className="font-semibold">Every {frequency} Days</span>
              </div>
              
              <div className="pt-4 border-t border-brand-secondary/15 flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-4 h-4 text-success" />
                <span className="text-xs font-semibold text-success">Free Farm Dispatch</span>
              </div>

              <div className="flex justify-between items-end border-t border-brand-secondary/20 pt-4 mt-2">
                <span className="text-brand-secondary">First delivery total</span>
                <span className="font-display text-3xl text-brand-primary">₹{selectedProduct?.base_price}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-accent py-4 text-sm font-medium text-white transition-all shadow-md hover:bg-brand-accent/85 hover:shadow-lg disabled:opacity-50 disabled:hover:bg-brand-accent disabled:hover:shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Setting up..."
              ) : (
                <>
                  <LockIcon className="w-4 h-4" />
                  <span>Pay &amp; Subscribe Now</span>
                </>
              )}
            </button>
            
            <p className="mt-4 text-center text-[10px] text-brand-secondary uppercase tracking-widest font-bold">
              Secure Encrypted Checkout
            </p>
          </div>
        </div>
      </form>
    </>
  );
}

// --- Icons ---
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
