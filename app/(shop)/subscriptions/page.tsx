"use client";

import React, { useState } from "react";
import Link from "next/link";
// Using Next.js Head or just a layout for SEO metadata in a separate file if needed, 
// but since this is 'use client', we can't export metadata from here. 
// However, I can create a layout.tsx if metadata is strictly required, 
// or let Next.js use the parent layout's metadata. 
// Given the existing page didn't export metadata, it's fine.

export default function SubscriptionsPage() {
  const [frequency, setFrequency] = useState<"monthly" | "biweekly">("monthly");

  const plans = [
    {
      id: "plan-couple",
      name: "Couple & Solo Essentials",
      tag: "Ideal for 1–2 People",
      price: 1240,
      regularPrice: 1460,
      savings: "₹220 saved/mo",
      items: [
        "4 kg Stone-Ground Khapli Atta",
        "2 kg Fragrant Indrayani Brown Rice",
        "2 kg Desi Unpolished Toor & Chana Dal",
        "250g Single-Origin Lakadong Turmeric",
      ],
      description: "The perfect monthly staple baseline for light cooking households looking for unadulterated purity.",
    },
    {
      id: "plan-family",
      name: "Family Standard Pantry",
      tag: "Most Popular for 3–4 People",
      isPopular: true,    
      price: 2680,
      regularPrice: 3160,
      savings: "₹480 saved/mo",
      items: [
        "10 kg Stone-Ground Khapli & Lokwan Atta",
        "5 kg Indrayani & Gobindobhog Rice",
        "4 kg Native Toor, Moong & Chana Dals",
        "Full Spice Trio (Turmeric, Byadagi Chilli, Coriander)",
      ],
      description: "Our flagship full-pantry subscription covering daily rotis, comforting dals, and fragrant rice meals.",
    },
    {
      id: "plan-heritage",
      name: "Heritage Grand Feast",
      tag: "For 5+ People / Joint Families",
      price: 3950,
      regularPrice: 4700,
      savings: "₹750 saved/mo",
      items: [
        "16 kg Multi-Grain Ancient Wheats & Atta",
        "8 kg Fragrant & Daily Heritage Rice",
        "6 kg Native Unpolished Dals Selection",
        "Grand Organic Spices & Cold-Pressed Mustard Oil Pack",
      ],
      description: "Comprehensive monthly coverage for rich, traditional kitchens cooking authentic feasts every day.",
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-brand-canvas min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-green/20 text-success px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">
            <CalendarIcon className="w-4 h-4" />
            Automatic Fresh Batch Delivery
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-brand-primary tracking-tight">
            Curated Monthly Subscription Plans
          </h1>
          <p className="text-base text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Never run out of pure staples. Freshly stone-milled within 48 hours of dispatch, with full freedom to pause, swap, or cancel anytime.
          </p>

          {/* Delivery Frequency Switch */}
          <div className="inline-flex items-center p-1.5 bg-brand-beige rounded-2xl border border-brand-secondary/15 mt-2 shadow-sm">
            <button
              onClick={() => setFrequency("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                frequency === "monthly"
                  ? "bg-brand-accent text-white shadow-md"
                  : "text-brand-primary hover:text-brand-accent"
              }`}
            >
              Monthly Delivery (Save 15%)
            </button>
            <button
              onClick={() => setFrequency("biweekly")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                frequency === "biweekly"
                  ? "bg-brand-accent text-white shadow-md"
                  : "text-brand-primary hover:text-brand-accent"
              }`}
            >
              Bi-Weekly (Every 2 Weeks)
            </button>
          </div>
        </div>

        {/* 3 Subscription Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-2 border-brand-green shadow-xl relative ring-4 ring-brand-green/10 duration-300 ${
                plan.isPopular
                  ? "bg-brand-canvas border-2 border-brand-beige shadow-xl relative ring-4 ring-brand-green/10"
                  : "bg-brand-canvas border border-brand-secondary/15 shadow-sm hover:border-brand-green/50"
              }`}
            >
              <div>
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-brand-green text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                    Recommended Box
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block">
                    {plan.tag}
                  </span>
                  <h3 className="font-display text-2xl text-brand-primary">{plan.name}</h3>
                  <p className="text-xs text-brand-secondary leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="py-4 border-y border-brand-beige mb-6 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-brand-secondary line-through block">₹{plan.regularPrice}</span>
                    <span className="font-display text-3xl text-brand-primary">₹{plan.price}</span>
                    <span className="text-xs text-brand-secondary"> / {frequency === "monthly" ? "month" : "2 weeks"}</span>
                  </div>
                  <span className="bg-success text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {plan.savings}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Included in Every Delivery:
                  </span>
                  <ul className="space-y-2.5 text-xs text-brand-primary">
                    {plan.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-brand-beige">
                <Link
                  href="/trial-kits"
                  className={`w-full py-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.isPopular
                      ? "bg-brand-accent hover:bg-brand-accent/85 text-white shadow-md"
                      : "bg-brand-beige hover:bg-[#ebdccb] text-brand-primary border border-brand-secondary/20"
                  }`}
                >
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>Subscribe to this Plan</span>
                </Link>
                <p className="text-[10px] text-center text-brand-secondary font-medium uppercase tracking-widest">
                  Free shipping • Skip or pause anytime
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="bg-brand-beige/60 p-5 rounded-2xl border border-brand-secondary/10 space-y-1.5">
            <TruckIcon className="w-5 h-5 text-brand-green" />
            <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wide">Free Farm Delivery</h4>
            <p className="text-[11px] text-brand-secondary">Every subscription box qualifies for free direct shipping.</p>
          </div>
          <div className="bg-brand-beige/60 p-5 rounded-2xl border border-brand-secondary/10 space-y-1.5">
            <PauseCircleIcon className="w-5 h-5 text-brand-accent" />
            <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wide">Pause When Traveling</h4>
            <p className="text-[11px] text-brand-secondary">Going on vacation? Pause deliveries on web or WhatsApp.</p>
          </div>
          <div className="bg-brand-beige/60 p-5 rounded-2xl border border-brand-secondary/10 space-y-1.5">
            <RefreshCwIcon className="w-5 h-5 text-brand-green" />
            <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wide">Swap Any Item</h4>
            <p className="text-[11px] text-brand-secondary">Switch from Indrayani to Gobindobhog rice with 1 click.</p>
          </div>
          <div className="bg-brand-beige/60 p-5 rounded-2xl border border-brand-secondary/10 space-y-1.5">
            <ShieldCheckIcon className="w-5 h-5 text-success" />
            <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wide">Zero Lock-in Contract</h4>
            <p className="text-[11px] text-brand-secondary">Cancel at any time with zero penalty or complex forms.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Icons ---
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
    <path d="M14 17h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const PauseCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="10" x2="10" y1="15" y2="9" />
    <line x1="14" x2="14" y1="15" y2="9" />
  </svg>
);

const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
