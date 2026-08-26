import { createClient } from "@/utils/supabase/server";
import ProductGrid from "./ProductGrid";
import type { Metadata } from "next";

/**
 * Page-level SEO metadata for /shop.
 */
export const metadata: Metadata = {
  title: "Shop All Staples",
  description:
    "Browse KhetSe's full range of 100% organic, lab-tested staples. Filter by pantry staples, add-ons, and seasonal harvests.",
};

/**
 * ISR revalidation — re-fetch product listings at most once per hour.
 * Keeps the shop page fast (served from cache) while staying nearly up-to-date.
 */
export const revalidate = 3600;

/**
 * ShopPage — Server Component that fetches all active products and passes
 * them to the client-side ProductGrid for category filtering.
 *
 * Why is fetching done here (RSC) and not in ProductGrid?
 * ProductGrid is a "use client" component for interactive filtering.
 * Fetching in an RSC means zero client-side waterfall: data arrives with the HTML.
 */

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="py-10 sm:py-16 bg-brand-canvas min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3 text-left border-b border-brand-beige pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider">
              <SproutIcon className="w-4 h-4" />
              100% Certified Organic Pantry
            </div>
            {/* Batch freshness indicator */}
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-secondary self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              Batch freshness guaranteed &lt; 48 hours from mill
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-brand-primary tracking-tight">
            Shop All Farm-to-Pantry Staples
          </h1>
          <p className="text-sm sm:text-base text-brand-secondary max-w-2xl leading-relaxed">
            Every grain, pulse, and flour is grown by our partner organic farmers, stone-milled to order, and delivered unpolished in under 48 hours.
          </p>
        </div>

        {error ? (
          <div className="py-20 text-center text-brand-secondary">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <ProductGrid products={products || []} />
        )}
      </div>
    </div>
  );
}

// --- Icons ---
const SproutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);
