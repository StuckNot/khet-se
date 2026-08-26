/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Protected Account Dashboard                                        │
 * │  File: app/(shop)/account/page.tsx                                          │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  A secure, server-side dashboard for authenticated users to view their       │
 * │  profile, active subscriptions, and recent order history.                    │
 * │                                                                              │
 * │  SECURITY:                                                                   │
 * │  - Strictly Server Component (RSC).                                          │
 * │  - Verification: supabase.auth.getUser() ensures the session is valid.       │
 * │  - Redirection: Unauthenticated users are sent to /login.                    │
 * │  - RLS: Database queries automatically scoped to the logged-in user's ID     │
 * │    via Supabase Row Level Security.                                          │
 * │                                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import SubscriptionItem from "./SubscriptionItem";

export default async function AccountPage() {
  const supabase = await createClient();

  // 1. Authenticate User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User Data (Parallel execution for performance)
  const [profileRes, ordersRes, subscriptionsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).neq("status", "cancelled"),
  ]);

  const profile = profileRes.data;
  const orders = ordersRes.data || [];
  const subscriptions = subscriptionsRes.data || [];

  const displayName = profile?.first_name || user.email?.split("@")[0] || "Farmer";

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* --- Header --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-primary">
            Welcome back, {displayName}!
          </h1>
          <p className="mt-2 text-brand-primary/60">
            Manage your organic subscriptions and track your fresh harvests.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* --- Main Content (Subscriptions & Orders) --- */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Subscriptions Card */}
            <section className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-primary">My Subscriptions</h2>
                <Link href="/trial-kits" className="text-sm font-bold text-brand-secondary hover:underline">
                  Browse Trial Kits
                </Link>
              </div>

              {subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <SubscriptionItem key={sub.id} subscription={{ ...sub, status: sub.status || "active" }} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
                    <LeafIcon className="h-6 w-6 text-brand-green" />
                  </div>
                  <p className="text-sm font-medium text-brand-primary/60">You have no active harvests.</p>
                  <p className="mt-1 text-xs text-brand-primary/40 text-balance">Subscribe to a trial kit to start your organic journey.</p>
                </div>
              )}
            </section>

            {/* Orders Card */}
            <section className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-brand-primary">Recent Orders</h2>
              
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-brand-primary/10 text-brand-primary/50 font-medium">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="text-brand-primary">
                          <td className="py-3 pr-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                          <td className="py-3 pr-4">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3 pr-4 font-bold">₹{order.total_amount}</td>
                          <td className="py-3">
                            <span className="capitalize">{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-brand-primary/40">
                  <p className="text-sm">No orders found yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* --- Sidebar (Profile Summary) --- */}
          <div className="lg:col-span-1">
            <aside className="sticky top-24 rounded-xl border border-brand-primary/10 bg-brand-secondary p-6 text-brand-canvas shadow-lg">
              <h3 className="mb-4 text-lg font-bold">Profile Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-50">Email</label>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-50">Member Since</label>
                  <p className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <hr className="border-brand-canvas/10" />
                <Link 
                  href="/account/settings" 
                  className="inline-block text-sm font-bold text-brand-accent hover:opacity-80 transition-opacity"
                >
                  Edit Profile Settings →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

const LeafIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C10.5 14.33 13 13 15 11" />
  </svg>
);
