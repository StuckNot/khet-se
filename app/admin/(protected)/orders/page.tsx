/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Admin: Order Management Page                                       │
 * │  File: app/admin/orders/page.tsx                                             │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Component that fetches all orders with their associated customer      │
 * │  names and renders them in the OrdersTable client component.                 │
 * │                                                                              │
 * │  ACCESS CONTROL:                                                             │
 * │  Protected by the admin layout (app/admin/layout.tsx), which redirects       │
 * │  non-admin users. This page never needs to check auth independently.         │
 * │                                                                              │
 * │  DATA JOIN:                                                                  │
 * │  Uses Supabase's PostgREST foreign key join syntax to embed the customer's   │
 * │  first_name from the `profiles` table alongside each order row.              │
 * │  The join shape is: { ...order, profiles: { first_name: string } }           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { createClient } from "@/utils/supabase/server";
import OrdersTable from "./OrdersTable";
import type { Database } from "@/types/database.types";

/**
 * AdminOrderWithProfile — the shape of a single row returned by the
 * joined query below. PostgREST embeds the related `profiles` row as
 * a nested object when you use the `profiles ( ... )` select syntax.
 *
 * This type is defined here (not in database.types.ts) because it's
 * specific to this page's query shape, not the raw DB schema.
 */
export type AdminOrderWithProfile = {
  id: string;
  created_at: string | null;
  status: Database["public"]["Enums"]["order_status"] | null;
  total_amount: number;
  user_id: string | null;
  profiles: {
    first_name: string;
  } | null;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  /**
   * Fetch all orders joined with the customer's profile (first name).
   * Ordered by newest first so the admin sees the most recent orders at the top.
   * No `.eq()` filter — admins see ALL orders (enforced by the "Admins can manage
   * all orders" RLS policy in 20260502132001_admin_roles.sql).
   */
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_amount,
      user_id,
      profiles (
        first_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-bold">Error loading orders</h2>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Order Management</h1>
          <p className="mt-1 text-brand-primary/60">View incoming orders and update their fulfillment status.</p>
        </div>
      </div>

      <OrdersTable orders={(orders as AdminOrderWithProfile[]) || []} />
    </div>
  );
}
