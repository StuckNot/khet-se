import { createClient } from "@/utils/supabase/server";
import InventoryTable from "./InventoryTable";

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-bold">Error loading inventory</h2>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Inventory Management</h1>
          <p className="mt-1 text-brand-primary/60">Manage product stock levels and visibility on the storefront.</p>
        </div>
      </div>

      <InventoryTable products={products || []} />
    </div>
  );
}
