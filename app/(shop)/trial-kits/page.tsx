import { createClient } from "@/utils/supabase/server";
import SubscriptionWizard from "./SubscriptionWizard";
import type { Metadata } from "next";

/**
 * Page-level SEO metadata for /trial-kits.
 */
export const metadata: Metadata = {
  title: "Trial Kits & Subscriptions",
  description:
    "Choose your organic staple box, set your delivery frequency, and start your KhetSe subscription. Weekly, bi-weekly, or monthly — cancel anytime.",
};



export default async function TrialKitsPage() {
  const supabase = await createClient();

  // Fetch only active products (perhaps categorized as staples or trial-kits)
  // For now, we fetch all active products.
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  return (
    <div className="min-h-screen bg-brand-canvas py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-semibold uppercase tracking-widest">
            Subscribe & Save
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-primary mb-4 tracking-tight">
            Curate Your Farm-to-Pantry Routine
          </h1>
          <p className="text-lg text-brand-primary/60 max-w-2xl mx-auto">
            Choose your staples, set your delivery frequency, and never run out of fresh, chemical-free food again.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12 text-brand-primary/60">
            Unable to load trial kits at this time.
          </div>
        ) : (
          <SubscriptionWizard products={products || []} />
        )}
      </div>
    </div>
  );
}
