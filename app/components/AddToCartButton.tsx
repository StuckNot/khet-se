/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Add To Cart Button Component                                       │
 * │  File: app/components/AddToCartButton.tsx                                    │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Reusable client component that adds a specific product to the global cart.  │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  Requires an `onClick` event handler and accesses the Zustand global state.  │
 * │                                                                              │
 * │  EVENT PREVENTION:                                                           │
 * │  Calls `e.preventDefault()` so it can be safely nested inside `<Link>`       │
 * │  wrappers (e.g., clicking 'Add to Cart' from a product card doesn't also     │
 * │  trigger navigation to the product detail page).                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import type { Tables } from "@/types/database.types";

type Product = Tables<"products">;

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent default if inside a Link context (though it shouldn't be)
        addItem(product);
      }}
      className="rounded-md bg-brand-primary px-4 py-2 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90"
    >
      Add to Cart
    </button>
  );
}
