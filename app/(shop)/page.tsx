/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Homepage                                                           │
 * │  File: app/(shop)/page.tsx                                                   │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  The storefront landing page. Server Component that fetches featured         │
 * │  products from Supabase and renders five sections:                           │
 * │  1. Hero — editorial layout with CTAs and hero image                         │
 * │  2. Trust Badges — 4-col grid of value propositions                          │
 * │  3. Featured Harvest — product grid using shared ProductCard                 │
 * │  4. Why Subscribe — 3-step subscription explainer                            │
 * │  5. Trial Kit Teaser — banner CTA                                            │
 * │                                                                              │
 * │  DATA:                                                                       │
 * │  Fetches 4 active products for the Featured Harvest section.                 │
 * │  All other content is static copy (no Supabase dependency).                  │
 * │                                                                              │
 * │  IMAGES:                                                                     │
 * │  Hero and decorative images use temporary placeholder photography            │
 * │  stored in public/images/. These should be replaced with authentic           │
 * │  KhetSe farm/product photography for production.                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import type { Tables } from "@/types/database.types";
import type { Metadata } from "next";
import ProductCard from "../components/ProductCard";
import TestimonialsSection from "../components/TestimonialsSection";

type Product = Tables<"products">;

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
    .limit(4);

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-0 bg-brand-canvas">
      {/* ═══════════════════════════════════════════════════
          SECTION 1: Hero
          ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle organic background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-beige/70 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Editorial Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">

              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 bg-brand-beige text-brand-secondary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-brand-secondary/15">
                <span className="flex h-2 w-2 rounded-full bg-brand-accent" />
                <span>Farm-to-Pantry in Under 48 Hours</span>
                <span className="text-brand-secondary/50">|</span>
                <span className="text-brand-primary font-medium">Stone-Milled on Order</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-display text-display sm:text-5xl lg:text-display text-brand-primary leading-[1.12] tracking-tight">
                  Pure, Unadulterated Staples{" "}
                  <br className="hidden sm:inline" />
                  <span className="italic font-normal text-brand-secondary">
                    From Indian Soil
                  </span>{" "}
                  to Your Doorstep.
                </h1>
                <p className="font-sans text-lg sm:text-xl text-brand-secondary max-w-2xl leading-relaxed">
                  Chemical free, farm-to-table staples delivered directly from our soil
                  to your doorstep. Pure, sustainable, and transparent.
                </p>
              </div>

              {/* Value Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm text-brand-primary">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">0% Mineral Oil Polish</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">Slow Cold Stone Ground</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-green shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">100% Traceable to Farmer</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/shop"
                  className="bg-brand-accent hover:bg-brand-accent/85 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-3 text-base group"
                >
                  <span>Shop Fresh Harvest</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/subscriptions"
                  className="bg-brand-beige hover:bg-brand-beige/80 text-brand-primary font-medium px-7 py-4 rounded-xl transition-all duration-200 border border-brand-secondary/20 flex items-center justify-center gap-2 text-base"
                >
                  <span>See How It Works</span>
                  <ArrowRightIcon className="w-4 h-4 text-brand-secondary" />
                </Link>
              </div>

              {/* Batch Status Bar */}
              <div className="pt-4 border-t border-brand-beige flex flex-wrap items-center gap-6 text-xs text-brand-secondary">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-brand-accent" />
                  <span>
                    <strong className="text-brand-primary">Next Milling Run:</strong> Wednesday 06:00 AM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-brand-green" />
                  <span>
                    <strong className="text-brand-primary">Purity Guarantee:</strong> Zero Bleach, Zero Preservatives
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Image Card */}
            <div className="lg:col-span-5 lg:pl-2">
              <div className="rounded-3xl bg-brand-beige/80 p-4 sm:p-5 border border-brand-secondary/15 shadow-sm space-y-4">
                {/*
                 * TEMPORARY PLACEHOLDER IMAGE
                 * Replace with authentic KhetSe farm/product photography.
                 * See: khetse-supabase-schema-gaps.md → "Hero / Marketing Image Source"
                 */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-brand-beige">
                  <Image
                    src="/images/hero/hero-harvest.png"
                    alt="Golden wheat harvest and organic Indian grains"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  {/* Gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent" />

                  {/* Origin badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-brand-green text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Direct Farm Origin
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white text-left space-y-1">
                    <h3 className="font-display text-xl sm:text-2xl text-brand-canvas leading-tight">
                      Indrayani Rice &amp; Khapli Wheat
                    </h3>
                    <p className="text-xs text-brand-canvas/90 font-sans">
                      Harvested at Maval &amp; Solapur • Tested 0% Chemical Residue
                    </p>
                  </div>
                </div>

                {/* Micro-story banner */}
                <div className="p-4 bg-brand-canvas rounded-xl flex items-center justify-between border border-brand-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
                      <SproutIcon className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-primary">Small-Batch Custom Milling</p>
                      <p className="text-[11px] text-brand-secondary">Grains remain whole until you order</p>
                    </div>
                  </div>
                  <Link
                    href="/story"
                    className="text-xs font-semibold text-brand-accent hover:underline whitespace-nowrap ml-2"
                  >
                    Our Story →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: Trust Badges
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 bg-brand-beige/60 border-y border-brand-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <TrustBadge
              icon={<WheatIcon className="w-6 h-6" />}
              title="100% Organic Certified"
              subtitle="NPOP & PGS-India verified soil, zero synthetic inputs or GMOs"
              badge="Zero Chemicals"
            />
            <TrustBadge
              icon={<TruckIcon className="w-6 h-6" />}
              title="Free Subscription Delivery"
              subtitle="Fresh stone-milled batches shipped directly across India"
              badge="<48h Farm Dispatch"
            />
            <TrustBadge
              icon={<RefreshIcon className="w-6 h-6" />}
              title="Pause or Cancel Anytime"
              subtitle="Flexible delivery cycles, swap staples, skip dates in 1 click"
              badge="Zero Lock-in"
            />
            <TrustBadge
              icon={<FlaskIcon className="w-6 h-6" />}
              title="Trusted & Transparent"
              subtitle="QR code on every sack linking to batch purity and curcumin reports"
              badge="100% Traceable"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: Featured Harvest
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-brand-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-green" />
                Seasonal Spotlight
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-brand-primary">
                Featured Harvest
              </h2>
              <p className="text-sm text-brand-secondary max-w-xl">
                Handpicked selections from our current season. Freshly harvested
                and ready for your pantry.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:text-brand-accent/80 group self-start md:self-end"
            >
              <span>Explore All Staples{products ? ` (${products.length})` : ""}</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {error ? (
            <div className="text-center py-12 px-6">
              <p className="text-brand-secondary text-sm">
                Something went wrong loading products. Please try again later.
              </p>
            </div>
          ) : !products || products.length === 0 ? (
            <EmptyHarvestState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* View All CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-beige hover:bg-brand-beige/80 text-brand-primary font-medium px-8 py-3.5 rounded-xl border border-brand-secondary/20 transition-all text-sm"
            >
              <span>View All Grains, Dals, Flours &amp; Spices</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4: Why Subscribe
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-brand-beige/60 border-y border-brand-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-success tracking-widest uppercase bg-brand-green/20 px-3.5 py-1 rounded-full border border-brand-green/30 inline-block">
              The 3-Step Method
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-primary">
              Why Subscribe with KhetSe?
            </h2>
            <p className="text-base text-brand-secondary">
              Freshly milled staples on your schedule, delivered with zero middleman markups.
            </p>
          </div>

          {/* 3-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <SubscribeStepCard
              step="01"
              title="Choose Your Staples"
              description="Curated grains, lentils, flours, and pure spices grown in natural living soil."
              footnoteIcon={<PackageIcon className="w-4 h-4 text-brand-accent" />}
              footnote="Custom mix & match anytime"
            />
            <SubscribeStepCard
              step="02"
              title="Set Your Schedule"
              description="Weekly, bi-weekly, or monthly delivery cycles with reminder notifications before every milling batch."
              footnoteIcon={<CalendarIcon className="w-4 h-4 text-brand-accent" />}
              footnote="Flexible replenishment schedules"
            />
            <SubscribeStepCard
              step="03"
              title="Enjoy Fresh, Always"
              description="Stone-milled on order, 100% unpolished, and pause or cancel anytime with a single tap."
              footnoteIcon={<RefreshIcon className="w-4 h-4 text-success" />}
              footnote="Zero lock-in • 1-click pause"
            />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/85 text-white font-medium px-8 py-3.5 rounded-xl transition-all text-sm shadow-md"
            >
              <span>Explore Subscription Plans &amp; Calculator</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4.5: Testimonials
          ═══════════════════════════════════════════════════ */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 5: Trial Kit Teaser Banner
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 pb-16 bg-brand-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-beige rounded-3xl p-8 sm:p-12 border border-brand-secondary/20 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-3 max-w-xl">
              <span className="bg-brand-green/20 text-success text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                Taste Before You Subscribe
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-brand-primary">
                Try the 4-Pantry Discovery Starter Kit
              </h3>
              <p className="text-xs sm:text-sm text-brand-secondary">
                Experience 500g Indrayani Rice, 500g Desi Toor Dal, 1kg Khapli Wheat Flour, 100g Lakadong Turmeric for just ₹499 with 100% risk-free guarantee.
              </p>
            </div>

            <Link
              href="/trial-kits"
              className="bg-brand-accent hover:bg-brand-accent/85 text-white font-medium px-7 py-3.5 rounded-xl transition-colors shadow-sm whitespace-nowrap text-sm flex items-center gap-2 shrink-0"
            >
              <span>View Trial Kits</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Sub-components (inline, page-specific)
// ═══════════════════════════════════════════════════

function TrustBadge({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-canvas border border-brand-secondary/10 transition-all hover:shadow-sm text-left">
      <div className="w-12 h-12 rounded-xl bg-brand-green/20 text-success flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-brand-primary tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-brand-secondary leading-relaxed">
          {subtitle}
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider bg-brand-green/15 px-2 py-0.5 rounded">
          ✓ {badge}
        </span>
      </div>
    </div>
  );
}

function SubscribeStepCard({
  step,
  title,
  description,
  footnoteIcon,
  footnote,
}: {
  step: string;
  title: string;
  description: string;
  footnoteIcon: React.ReactNode;
  footnote: string;
}) {
  return (
    <div className="bg-brand-canvas p-8 rounded-2xl border border-brand-secondary/15 flex flex-col justify-between space-y-6 text-left hover:border-brand-green transition-colors">
      <div className="space-y-3">
        <span className="font-display text-4xl text-brand-green">{step}</span>
        <h3 className="font-display text-2xl text-brand-primary">{title}</h3>
        <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
          {description}
        </p>
      </div>
      <div className="pt-3 border-t border-brand-beige flex items-center gap-2 text-xs font-medium text-brand-primary">
        {footnoteIcon}
        <span>{footnote}</span>
      </div>
    </div>
  );
}

function EmptyHarvestState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-brand-secondary/15 bg-brand-canvas">
      <span className="text-5xl mb-6">🌱</span>
      <h3 className="text-xl font-bold text-brand-primary mb-2">
        Our Farmers Are Currently Harvesting
      </h3>
      <p className="text-brand-secondary max-w-md text-center mb-6 text-sm">
        Fresh organic staples are on their way from the fields. Check back soon
        or sign up for our newsletter to be the first to know.
      </p>
      <Link
        href="/trial-kits"
        className="bg-brand-accent hover:bg-brand-accent/85 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm text-sm"
      >
        Pre-order a Trial Kit
      </Link>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Inline SVG Icons (no external dependency)
// ═══════════════════════════════════════════════════

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const SproutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

const WheatIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22 16 8" />
    <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
    <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const FlaskIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16.5h10" />
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);
