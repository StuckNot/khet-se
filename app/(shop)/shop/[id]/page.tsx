import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "../../../components/AddToCartButton";

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

  return (
    <div className="min-h-screen bg-brand-canvas py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-brand-primary/60">
          <Link href="/shop" className="hover:text-brand-primary hover:underline">
            Shop All
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category.replace("_", " ")}</span>
          <span>/</span>
          <span className="font-medium text-brand-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* ─── Product Image Placeholder ─── */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-brand-primary/10 bg-brand-primary/5 flex flex-col items-center justify-center relative">
            <span className="absolute top-4 left-4 rounded-full bg-brand-accent/20 px-3 py-1 text-xs font-semibold capitalize text-brand-primary">
              {product.category.replace("_", " ")}
            </span>
            <span className="text-8xl mb-4">🌾</span>
            <p className="text-brand-primary/40 font-mono text-sm">Product Image TBD</p>
          </div>

          {/* ─── Product Info ─── */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-brand-primary md:text-5xl">
              {product.name}
            </h1>
            
            <p className="mb-6 text-3xl font-bold text-brand-primary">
              ₹{product.base_price}
            </p>

            <div className="mb-8 prose prose-brand text-brand-primary/80">
              <p>{product.description || "A staple sourced directly from our verified organic farmers."}</p>
            </div>

            {/* Actions */}
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <div className="w-full sm:w-auto">
                <AddToCartButton product={product} />
              </div>
              <Link 
                href="/trial-kits" 
                className="flex items-center justify-center rounded-md border-2 border-brand-secondary bg-transparent px-6 py-2 text-sm font-bold text-brand-secondary transition-colors hover:bg-brand-secondary hover:text-brand-canvas text-center"
              >
                Add to a Trial Kit
              </Link>
            </div>

            {/* Accordion / Details */}
            <div className="divide-y divide-brand-primary/10 border-y border-brand-primary/10">
              {/* Farmer Notes */}
              <div className="py-6">
                <h3 className="text-lg font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <span className="text-brand-accent">👨‍🌾</span> Farmer's Notes
                </h3>
                <p className="text-brand-primary/70 text-sm leading-relaxed">
                  {product.farmer_notes || "No specific harvest notes available for this batch yet. Quality tested and approved."}
                </p>
              </div>

              {/* Quality Guarantee */}
              <div className="py-6">
                <h3 className="text-lg font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <span className="text-brand-accent">🔬</span> Lab-Tested Organic
                </h3>
                <p className="text-brand-primary/70 text-sm leading-relaxed">
                  Every batch is rigorously tested for synthetic pesticides and heavy metals. Zero chemicals, 100% pure harvest.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
