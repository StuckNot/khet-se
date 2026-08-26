import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AddToCartButton from "../../../components/AddToCartButton";
import { categoryLabels } from "@/app/lib/categoryLabels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  return {
    title: product?.name ?? "Product",
    description: product?.description ?? "Farm-fresh organic staple from KhetSe.",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product || !product.is_active) {
    notFound();
  }

  let kitItems = null;
  if (product.category === "kit") {
    const { data } = await supabase
      .from("product_kit_items")
      .select("*")
      .eq("kit_product_id", id)
      .order("sort_order", { ascending: true });
    kitItems = data;
  }

  return (
    <div className="min-h-screen bg-brand-canvas py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs text-brand-secondary font-medium">
          <Link href="/shop" className="hover:text-brand-accent transition-colors">
            Shop All
          </Link>
          <span className="text-brand-secondary/40">/</span>
          <span className="text-brand-secondary/70 flex items-center gap-2">
            {categoryLabels[product.category] || product.category}
            {product.hindi_name && (
              <span className="text-brand-secondary/50 font-sans border-l border-brand-secondary/30 pl-2">
                {product.hindi_name}
              </span>
            )}
          </span>
          <span className="text-brand-secondary/40">/</span>
          <span className="text-brand-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ─── Product Image ─── */}
          <div className="aspect-square w-full overflow-hidden rounded-3xl border border-brand-secondary/15 bg-brand-beige relative shadow-sm">
            {/* Category pill & Badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
              <span className="bg-brand-accent/15 text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                {categoryLabels[product.category] || product.category}
              </span>
              {product.badge && (
                <span className="bg-brand-primary text-brand-canvas text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="text-7xl opacity-40">🌾</span>
                <p className="text-xs text-brand-secondary/50 font-medium">
                  Image coming soon
                </p>
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <div className="flex flex-col space-y-8">

            {/* Name & Price */}
            <div className="space-y-3 text-left">
              {product.region && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-brand-canvas/50 self-start px-2.5 py-1 rounded-md border border-brand-secondary/15 w-fit shadow-sm">
                  <MapPinIcon className="w-3.5 h-3.5 text-brand-accent" />
                  {product.region}
                </div>
              )}
              <h1 className="font-display text-4xl sm:text-5xl text-brand-primary tracking-tight leading-[1.12]">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-brand-primary">
                  ₹{product.base_price}
                </span>
                <span className="text-xs text-brand-secondary font-medium">
                  per harvest pack
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm sm:text-base text-brand-secondary leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Taste Notes */}
            {product.taste_notes && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] uppercase font-bold text-brand-secondary tracking-wider">Taste Profile:</span>
                {product.taste_notes.split(",").map((note: string, i: number) => {
                  const trimmed = note.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={i}
                      className="bg-brand-beige text-brand-primary text-xs px-2.5 py-1 rounded-md font-medium border border-brand-secondary/10"
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Unpolished",
                "Zero Pesticides",
                "Milled to Order",
                "NABL Lab Tested",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 bg-brand-green/15 text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-brand-green/20"
                >
                  <span className="text-success">✓</span> {badge}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
              <Link
                href="/trial-kits"
                className="flex-1 flex items-center justify-center rounded-xl border border-brand-secondary/25 bg-brand-beige hover:bg-[#ebdccb] text-brand-primary px-6 py-3 text-xs sm:text-sm font-medium transition-colors text-center shadow-sm"
              >
                Start a Trial Kit
              </Link>
            </div>

            {/* Detail Sections */}
            <div className="divide-y divide-brand-secondary/10 border-y border-brand-secondary/10">

              {/* Kit Contents */}
              {kitItems && kitItems.length > 0 && (
                <div className="py-6 space-y-3">
                  <h3 className="text-sm font-bold text-brand-primary flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-accent/15 text-brand-accent flex items-center justify-center text-base">
                      📦
                    </span>
                    What's Inside the Box
                  </h3>
                  <ul className="pl-9 space-y-2.5">
                    {kitItems.map((item: any) => (
                      <li key={item.id} className="text-xs sm:text-sm text-brand-secondary flex items-start gap-2.5">
                        <span className="text-success mt-0.5 shrink-0 flex items-center justify-center bg-brand-green/15 w-4 h-4 rounded-full text-[10px] font-bold">✓</span>
                        <span className="leading-relaxed font-medium text-brand-primary">{item.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Farmer Notes */}
              <div className="py-6 space-y-2">
                <h3 className="text-sm font-bold text-brand-primary flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-accent/15 text-brand-accent flex items-center justify-center text-base">
                    👨‍🌾
                  </span>
                  Farmer&apos;s Notes
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed pl-9">
                  {product.farmer_notes ||
                    "No specific harvest notes available for this batch yet. Quality tested and approved."}
                </p>
              </div>

              {/* Quality Guarantee */}
              <div className="py-6 space-y-2">
                <h3 className="text-sm font-bold text-brand-primary flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-green/15 text-success flex items-center justify-center text-base">
                    🔬
                  </span>
                  Lab-Tested Organic
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed pl-9">
                  Every batch is rigorously tested for synthetic pesticides and heavy metals by NABL-accredited laboratories. Zero chemicals, 100% pure harvest.
                </p>
              </div>

              {/* Delivery */}
              <div className="py-6 space-y-2">
                <h3 className="text-sm font-bold text-brand-primary flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center text-base">
                    📦
                  </span>
                  48-Hour Delivery
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed pl-9">
                  Stone-milled to order and dispatched within 48 hours of your purchase. Delivering to 18,000+ PIN codes across India from our Pune and Bangalore hubs.
                </p>
              </div>

            </div>

            {/* Back to Shop */}
            <Link
              href="/shop"
              className="text-xs text-brand-secondary hover:text-brand-accent transition-colors flex items-center gap-1 font-medium"
            >
              ← Back to Shop All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Inline SVG Icons
// ═══════════════════════════════════════════════════

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
