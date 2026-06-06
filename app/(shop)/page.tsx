import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/database.types";
import type { Metadata } from "next";
import AddToCartButton from "../components/AddToCartButton";

type Product = Tables<"products">;

const categoryLabels: Record<string, string> = {
  staple: "Pantry Staple",
  add_on: "Add-On",
  seasonal: "Seasonal Harvest",
};

/**
 * Page-level SEO metadata.
 * Overrides the root layout defaults for the homepage only.
 * The title template in root layout will produce: "KhetSe — Farm-to-Pantry Organic Staples"
 */
export const metadata: Metadata = {
  title: "KhetSe — Farm-to-Pantry Organic Staples",
  description:
    "Get 100% chemical-free organic staples — rice, lentils, flour, and spices — delivered from Indian farms to your pantry in under 48 hours. Subscribe and never run out.",
};

/**
 * ISR (Incremental Static Regeneration) — revalidate this page at most once per hour.
 * This means the page is served from cache (fast!) and only re-fetched from Supabase
 * every 3600 seconds. Perfect for the homepage which shows featured products.
 * If you add a product in the admin panel, it will appear on the homepage within 1 hour
 * (or immediately if you call revalidatePath("/") from the admin action).
 */
export const revalidate = 3600;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(3);

  return (
    <div className="flex flex-col items-center">
      {/* ─── Hero Section ─── */}
      <section className="w-full bg-brand-canvas py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-semibold uppercase tracking-widest">
            Farm to Pantry in 48 Hours
          </span>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-brand-primary mb-6 tracking-tight leading-tight">
            Taste the Organic <br className="hidden sm:inline" />
            Difference.
          </h1>

          <p className="text-lg md:text-xl text-brand-primary/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Skip the middlemen. Get 100% chemical-free staples — rice, lentils,
            flours & spices — delivered on a schedule that fits your kitchen.
            Start with a trial kit, stay for the subscription.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/trial-kits"
              className="bg-brand-secondary text-brand-canvas px-8 py-4 rounded-md font-bold transition-opacity hover:opacity-90 shadow-lg"
            >
              Claim Your Trial Kit
            </Link>
            <Link
              href="/shop"
              className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-md font-bold transition-colors hover:bg-brand-primary hover:text-brand-canvas"
            >
              View All Staples
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section className="w-full bg-brand-canvas py-12 border-y border-brand-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <TrustBadge icon="🌾" label="100% Organic Certified" />
            <TrustBadge icon="🚚" label="Free Delivery on Subscriptions" />
            <TrustBadge icon="🔄" label="Pause or Cancel Anytime" />
            <TrustBadge icon="🧪" label="Lab-Tested & Transparent" />
          </div>
        </div>
      </section>

      {/* ─── Featured Harvest ─── */}
      <section className="w-full bg-brand-canvas py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4 tracking-tight">
              Featured Harvest
            </h2>
            <p className="text-brand-primary/50 max-w-lg mx-auto">
              Handpicked selections from our current season. Freshly harvested
              and ready for your pantry.
            </p>
          </div>

          {error ? (
            <div className="text-center py-12 px-6">
              <p className="text-brand-primary/50 text-sm">
                Something went wrong loading products. Please try again later.
              </p>
            </div>
          ) : !products || products.length === 0 ? (
            <EmptyHarvestState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Why Subscribe ─── */}
      <section className="w-full bg-brand-canvas py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4 tracking-tight">
              Why Subscribe with KhetSe?
            </h2>
            <p className="text-brand-primary/50 max-w-lg mx-auto">
              A pantry that refills itself — set it once and never run out of
              essentials again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <BenefitCard
              step="01"
              title="Choose Your Staples"
              description="Pick from our curated range of organic grains, lentils, flours, and spices."
            />
            <BenefitCard
              step="02"
              title="Set Your Schedule"
              description="Weekly, bi-weekly, or monthly — deliveries timed to your household's rhythm."
            />
            <BenefitCard
              step="03"
              title="Enjoy Fresh, Always"
              description="Every batch is freshly milled and packed. Pause, swap, or cancel with one click."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-components ───

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-brand-primary/70 font-medium">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-xl border border-brand-primary/10 bg-brand-canvas p-6 transition-all hover:shadow-lg hover:border-brand-primary/20">
      {/* Category Pill */}
      <span className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-semibold">
        {categoryLabels[product.category] || product.category}
      </span>

      <h3 className="text-xl font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-sm text-brand-primary/50 mb-4 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-primary/5">
        <p className="text-2xl font-bold text-brand-primary">
          ₹{product.base_price}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/shop/${product.id}`}
            className="text-sm font-semibold text-brand-secondary hover:underline hidden sm:block"
          >
            View Details
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

function BenefitCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center md:text-left">
      <span className="inline-block text-5xl font-black text-brand-accent/30 mb-4">
        {step}
      </span>
      <h3 className="text-xl font-bold text-brand-primary mb-3">{title}</h3>
      <p className="text-brand-primary/60 leading-relaxed">{description}</p>
    </div>
  );
}

function EmptyHarvestState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-brand-primary/10 bg-brand-canvas">
      <span className="text-5xl mb-6">🌱</span>
      <h3 className="text-xl font-bold text-brand-primary mb-2">
        Our Farmers Are Currently Harvesting
      </h3>
      <p className="text-brand-primary/50 max-w-md text-center mb-6">
        Fresh organic staples are on their way from the fields. Check back soon
        or sign up for our newsletter to be the first to know.
      </p>
      <Link
        href="/trial-kits"
        className="bg-brand-secondary text-brand-canvas px-6 py-3 rounded-md font-bold transition-opacity hover:opacity-90"
      >
        Pre-order a Trial Kit
      </Link>
    </div>
  );
}
