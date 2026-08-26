import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Parallel fetching for dashboard metrics
  const [ordersRes, subsRes, productsRes] = await Promise.all([
    supabase.from("orders").select("id, status, total_amount, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("subscriptions").select("id, status").eq("status", "active"),
    supabase.from("products").select("id, name, stock_quantity, is_active").order("stock_quantity", { ascending: true }).limit(5)
  ]);

  const recentOrders = ordersRes.data || [];
  const activeSubsCount = subsRes.data?.length || 0;
  const lowStockProducts = productsRes.data || [];

  return (
    <div className="max-w-6xl">
      <h1 className="mb-8 text-3xl font-bold text-brand-primary">Overview</h1>

      {/* Metrics Row */}
      <div className="mb-10 grid gap-6 md:grid-cols-3">
        <MetricCard title="Active Subscriptions" value={activeSubsCount.toString()} trend="+2 this week" />
        <MetricCard title="Pending Orders" value={recentOrders.filter(o => o.status === "pending").length.toString()} trend="Needs processing" />
        <MetricCard title="Low Stock Alerts" value={lowStockProducts.filter(p => p.stock_quantity < 20).length.toString()} trend="Items below 20 units" alert />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recent Orders */}
        <section className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-brand-secondary hover:underline">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-primary/10 text-brand-primary/50 font-medium">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-brand-primary">
                    <td className="py-3 pr-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="py-3 pr-4 font-bold">₹{order.total_amount}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'delivered' ? 'bg-success/10 text-success' :
                        'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && <p className="text-sm text-brand-primary/50 mt-4 text-center">No orders yet.</p>}
          </div>
        </section>

        {/* Inventory Alerts */}
        <section className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-primary">Inventory Alerts</h2>
            <Link href="/admin/inventory" className="text-sm font-bold text-brand-secondary hover:underline">
              Manage Stock
            </Link>
          </div>

          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border border-brand-primary/5 p-4">
                <div>
                  <p className="font-bold text-brand-primary">{product.name}</p>
                  <p className="text-xs text-brand-primary/50">Status: {product.is_active ? "Active" : "Inactive"}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${product.stock_quantity < 20 ? "text-red-500" : "text-brand-primary"}`}>
                    {product.stock_quantity}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-primary/40">In Stock</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && <p className="text-sm text-brand-primary/50 text-center">Inventory looks good.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, alert }: { title: string, value: string, trend: string, alert?: boolean }) {
  return (
    <div className={`rounded-xl border p-6 shadow-sm ${alert ? "border-red-200 bg-red-50" : "border-brand-primary/10 bg-white"}`}>
      <h3 className="text-sm font-medium text-brand-primary/60 mb-2">{title}</h3>
      <p className={`text-4xl font-black mb-2 ${alert ? "text-red-600" : "text-brand-primary"}`}>{value}</p>
      <p className={`text-xs font-bold ${alert ? "text-red-500" : "text-brand-secondary"}`}>{trend}</p>
    </div>
  );
}
