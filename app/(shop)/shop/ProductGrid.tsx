/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Product Grid Component                                             │
 * │  File: app/(shop)/shop/ProductGrid.tsx                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Client component that renders a grid of products with category filtering.   │
 * │  Expects the full list of products passed as props from a Server Component.  │
 * │                                                                              │
 * │  IMAGE OPTIMIZATION:                                                         │
 * │  Uses next/image for optimized rendering if `product.image_url` is set.      │
 * │  Falls back to a branded emoji placeholder if no image is available.         │
 * │                                                                              │
 * │  WHY "use client"?                                                           │
 * │  Needs React state (`activeCategory`) to filter products instantly on the    │
 * │  client without hitting the server again.                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState } from "react";
import type { Tables } from "@/types/database.types";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "../../components/AddToCartButton";

type Product = Tables<"products">;

const categoryLabels: Record<string, string> = {
  staple: "Pantry Staple",
  add_on: "Add-On",
  seasonal: "Seasonal Harvest",
};

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "staple", label: "Pantry Staples" },
    { id: "add_on", label: "Add-Ons" },
    { id: "seasonal", label: "Seasonal Harvest" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* ─── Category Filter Bar ─── */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
              activeCategory === cat.id
                ? "bg-brand-primary text-brand-canvas shadow-md"
                : "border border-brand-primary/20 bg-transparent text-brand-primary hover:border-brand-primary/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ─── Product Grid ─── */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-brand-primary/60">
            No products found in this category right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm transition-all hover:border-brand-primary/30 hover:shadow-lg"
            >
              <div>
                {/* Image or Placeholder */}
                <Link href={`/shop/${product.id}`} className="block mb-6 h-48 w-full rounded-lg bg-brand-primary/5 flex items-center justify-center border border-brand-primary/5 overflow-hidden group-hover:bg-brand-primary/10 transition-colors relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-4xl">🌾</span>
                  )}
                </Link>
                
                <span className="mb-3 inline-block rounded-full bg-brand-accent/20 px-3 py-1 text-xs font-semibold text-brand-primary">
                  {categoryLabels[product.category] || product.category}
                </span>
                
                <Link href={`/shop/${product.id}`}>
                  <h3 className="mb-2 text-xl font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="mb-6 text-sm text-brand-primary/60 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-brand-primary/5 pt-4">
                <p className="text-xl font-bold text-brand-primary">
                  ₹{product.base_price}
                </p>
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
