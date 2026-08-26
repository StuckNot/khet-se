/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Shared Product Card Component                                      │
 * │  File: app/components/ProductCard.tsx                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Reusable product card used across all customer-facing pages (Homepage,      │
 * │  Shop All, Trial Kits). Displays image, category, name, description,        │
 * │  price, and an Add to Cart action.                                           │
 * │                                                                              │
 * │  COMPONENT TYPE: Server Component                                            │
 * │  No "use client" — the only interactive element is the nested               │
 * │  AddToCartButton which is its own client component.                          │
 * │                                                                              │
 * │  DATA:                                                                       │
 * │  Accepts a Supabase `products` row directly. Fields that exist in the       │
 * │  reference design but not yet in Supabase (badge, region, hindiName,        │
 * │  weightOptions) are not rendered. The component is structured so they        │
 * │  can be added later with minimal changes.                                    │
 * │                                                                              │
 * │  ACCESSIBILITY / NESTING:                                                    │
 * │  The card wrapper is a <div> — NOT a link. Image and name each have their  │
 * │  own <Link> (renders <a>), and the cart button is a <button>. No nested    │
 * │  <a> tags.                                                                   │
 * │                                                                              │
 * │  IMAGE FALLBACK:                                                             │
 * │  Only triggers when image_url is null (genuinely missing from Supabase).    │
 * │  Broken URLs are not hidden — they attempt to load normally so the admin    │
 * │  can identify and fix them.                                                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import Link from "next/link";
import Image from "next/image";
import type { Tables } from "@/types/database.types";
import SelectProductButton from "./SelectProductButton";
import { categoryLabels } from "@/app/lib/categoryLabels";

type Product = Tables<"products">;

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-brand-canvas rounded-2xl border border-brand-secondary/15 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-green/50 flex flex-col justify-between">
      {/* Product Image — links to detail page */}
      <Link
        href={`/shop/${product.id}`}
        className="block relative aspect-[4/3] sm:aspect-square overflow-hidden bg-brand-beige"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">
            🌾
          </span>
        )}

        {/* Origin Pill & Badge */}
        {(product.badge || product.region) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.badge && (
              <span className="bg-brand-primary text-brand-canvas text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                {product.badge}
              </span>
            )}
            {product.region && (
              <span className="bg-brand-canvas/95 text-brand-primary text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <MapPinIcon className="w-3 h-3 text-brand-accent" />
                {product.region.split(",")[0]}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5 text-left">
          <div className="flex items-baseline justify-between">
            {/* Category Pill */}
            <span className="inline-block bg-brand-accent/15 text-brand-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
              {categoryLabels[product.category] || product.category}
            </span>
            
            {/* Hindi Name */}
            {product.hindi_name && (
              <span className="text-[11px] text-brand-secondary/80 font-sans">
                {product.hindi_name}
              </span>
            )}
          </div>

          {/* Product Name — links to detail page */}
          <Link href={`/shop/${product.id}`} className="block">
            <h3 className="font-display text-base sm:text-lg text-brand-primary group-hover:text-brand-accent transition-colors leading-snug min-h-[2.8rem] flex items-center">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-brand-secondary/80 font-sans line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-beige">
          <div className="text-left">
            <span className="font-display text-xl sm:text-2xl text-brand-primary">
              ₹{product.base_price}
            </span>
          </div>
          <SelectProductButton product={product} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Inline SVG Icons (no external dependency)
// ═══════════════════════════════════════════════════

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
