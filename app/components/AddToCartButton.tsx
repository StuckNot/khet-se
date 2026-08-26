/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Add To Cart Button Component                                       │
 * │  File: app/components/AddToCartButton.tsx                                    │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Reusable client component that adds a specific product to the global cart.  │
 * │  Displays visual "Added" feedback on click with a brief green confirmation   │
 * │  state before reverting to the default CTA.                                  │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  Requires onClick event handler, useState for feedback, and accesses the     │
 * │  Zustand global cart state.                                                  │
 * │                                                                              │
 * │  EVENT PREVENTION:                                                           │
 * │  Calls both e.preventDefault() and e.stopPropagation() so the button works  │
 * │  safely when nested inside Link wrappers or clickable card containers.       │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import type { Tables } from "@/types/database.types";

type Product = Tables<"products">;

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer active:scale-95 ${
        isAdded
          ? "bg-success text-white"
          : "bg-brand-accent hover:bg-brand-accent/85 text-white"
      }`}
    >
      {isAdded ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>Added</span>
        </>
      ) : (
        <>
          <BagIcon className="w-4 h-4" />
          <span>Add to Box</span>
        </>
      )}
    </button>
  );
}

// --- Icons ---

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
