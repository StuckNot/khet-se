/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Trial Kits / Subscription Wizard Form                              │
 * │  File: app/(shop)/trial-kits/SubscriptionWizard.tsx                          │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  A 2-step interactive form allowing users to select a product and a delivery │
 * │  frequency (weekly, bi-weekly, monthly) for subscription creation.           │
 * │                                                                              │
 * │  1. Uses standard React state to track user selections.                      │
 * │  2. Integrates with generateGeneralWhatsAppLink for the WhatsApp inquiry flow. │
 * │                                                                              │
 * │  STATUS:                                                                     │
 * │  Converted to an informational-only component for the WhatsApp MVP.          │
 * │  Checkout steps and database submissions have been removed.                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState } from "react";
import type { Tables } from "@/types/database.types";
import { generateGeneralWhatsAppLink } from "@/utils/whatsapp";

type Product = Tables<"products">;

interface SubscriptionWizardProps {
  products: Product[];
}

export default function SubscriptionWizard({ products }: SubscriptionWizardProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products[0]?.id ? [products[0].id] : []
  ); const [frequency, setFrequency] = useState<number>(7);

  const selectedProducts = products.filter((p) =>
    selectedProductIds.includes(p.id)
  );
  if (products.length === 0) {
    return <div className="text-center py-12 text-brand-secondary">No trial kits currently available. Please check back later.</div>;
  }

  const getFrequencyLabel = (days: number) => {
    if (days === 7) return "Weekly";
    if (days === 14) return "Bi-Weekly";
    if (days === 30) return "Monthly";
    return `${days} days`;
  };

  const productNames = selectedProducts
    .map((product) => product.name)
    .join(", ");

  const whatsappMessage = `Hi, I have a question about Trial Kits — interested in ${productNames} with ${getFrequencyLabel(frequency)} delivery.`;
  return (
    <>
      <div className="w-full max-w-5xl mx-auto grid gap-10 md:grid-cols-12 text-left items-start">
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
                const isActive = selectedProductIds.includes(product.id); return (
                  <label
                    key={product.id}
                    className={`block cursor-pointer rounded-2xl border-2 p-5 transition-all outline-none focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:ring-offset-2 ${isActive
                      ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                      : "border-brand-secondary/15 bg-brand-canvas hover:border-brand-primary/30 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* We keep the radio button for form submission and a11y, but hide it visually and use a custom icon */}
                      <input
                        type="checkbox"
                        name="productIds"
                        value={product.id}
                        checked={isActive}
                        onChange={() => {
                          setSelectedProductIds((prev) =>
                            prev.includes(product.id)
                              ? prev.filter((id) => id !== product.id)
                              : [...prev, product.id]
                          );
                        }}
                        className="sr-only"
                      />

                      {/* Custom Radio Icon */}
                      <div className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${isActive ? "border-brand-accent bg-brand-accent text-white" : "border-brand-secondary/40"
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
                    className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all outline-none focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:ring-offset-2 ${isActive
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
                <div className="font-semibold text-right">
                  {selectedProducts.length > 0 ? (
                    <div className="space-y-1">
                      {selectedProducts.map((product) => (
                        <div key={product.id}>{product.name}</div>
                      ))}
                    </div>
                  ) : (
                    "No products selected"
                  )}
                </div>              </div>
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
                <span className="font-semibold">₹{selectedProducts.reduce(
                  (total, product) => total + Number(product.base_price),
                  0
                )}</span>
              </div>
            </div>

            <a
              href={generateGeneralWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-[#25D366] py-4 text-sm font-medium text-white transition-all shadow-md hover:bg-[#20bd5a] hover:shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Ask us on WhatsApp</span>
            </a>

            <p className="mt-4 text-center text-[10px] text-brand-secondary uppercase tracking-widest font-bold">
              We usually reply within 5 minutes
            </p>
          </div>
        </div>
      </div>
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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
