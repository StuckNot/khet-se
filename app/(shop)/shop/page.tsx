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
    <div className="min-h-screen bg-brand-canvas py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="font-display mb-4 text-4xl font-bold tracking-tight text-brand-primary md:text-5xl">
            The KhetSe Harvest
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-brand-primary/60">
            100% organic, lab-tested, and delivered straight from the farm to your pantry. Browse our selection of staples, add-ons, and seasonal specials.
          </p>
        </div>

        {error ? (
          <div className="py-20 text-center text-brand-primary/60">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <ProductGrid products={products || []} />
        )}
      </div>
    </div>
  );
}
