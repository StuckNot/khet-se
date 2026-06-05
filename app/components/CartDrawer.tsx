/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Cart Drawer Component                                              │
 * │  File: app/components/CartDrawer.tsx                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Slide-out drawer displaying the current items in the user's shopping cart.  │
 * │  Provides functionality to increment, decrement, or remove items.            │
 * │                                                                              │
 * │  STATE MANAGEMENT:                                                           │
 * │  Reads and updates global state via `useCartStore` (Zustand).                │
 * │                                                                              │
 * │  HYDRATION SAFETY:                                                           │
 * │  Includes a `mounted` check. Since the cart is persisted to `localStorage`,  │
 * │  the initial server render must return `null` to match the client's initial  │
 * │  empty state, avoiding React hydration mismatch errors.                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    toggleDrawer,
    updateQuantity,
    removeItem,
    getCartTotal,
  } = useCartStore();

  // Prevent hydration mismatch for persisted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-brand-primary/50 backdrop-blur-sm transition-opacity"
          onClick={() => toggleDrawer(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-brand-canvas shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-primary/10 px-6 py-5 bg-brand-canvas">
          <h2 className="text-xl font-bold text-brand-primary">Your Harvest</h2>
          <button
            onClick={() => toggleDrawer(false)}
            className="text-brand-primary/50 hover:text-brand-primary transition-colors"
            aria-label="Close cart"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <BagIcon className="h-12 w-12 text-brand-primary/20 mb-4" />
              <p className="text-lg font-bold text-brand-primary">Your bag is empty.</p>
              <p className="text-sm text-brand-primary/60 mt-2 mb-6">
                Looks like you haven't added any organic staples yet.
              </p>
              <button
                onClick={() => toggleDrawer(false)}
                className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-bold text-brand-canvas hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-brand-primary/5 pb-6">
                  {/* Image or Placeholder */}
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-md bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <span className="text-xs font-bold text-brand-primary/30 uppercase tracking-wider">{item.product.category.replace("_", " ")}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold text-brand-primary leading-tight">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-brand-primary/40 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-brand-primary/60 mt-1">
                        ₹{item.product.base_price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center rounded-md border border-brand-primary/20 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1 text-brand-primary hover:bg-brand-primary/5 transition-colors font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-brand-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 text-brand-primary hover:bg-brand-primary/5 transition-colors font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-primary/10 bg-brand-canvas p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-brand-primary font-medium">Subtotal</span>
              <span className="text-xl font-bold text-brand-primary">
                ₹{getCartTotal().toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-brand-primary/50 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={() => toggleDrawer(false)}
              className="flex w-full items-center justify-center rounded-lg bg-brand-secondary py-4 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
            >
              Proceed to Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// --- Icons ---
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
