import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signout } from "../login/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Verify Admin Status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/"); // Kick non-admins back to the storefront
  }

  return (
    <div className="flex min-h-screen bg-brand-canvas">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-primary/10 bg-brand-primary p-6 text-brand-canvas flex flex-col">
        <div className="mb-10">
          <Link href="/admin" className="text-2xl font-bold tracking-tight">
            KhetSe <span className="text-brand-accent">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block rounded-lg bg-white/10 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/20">
            Dashboard
          </Link>
          <Link href="/admin/inventory" className="block rounded-lg px-4 py-2 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Inventory
          </Link>
          <Link href="/admin/orders" className="block rounded-lg px-4 py-2 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Orders
          </Link>
        </nav>

        <div className="border-t border-white/10 pt-4 mt-auto">
          <p className="text-xs text-white/50 mb-4">{user.email}</p>
          <form action={signout}>
            <button className="w-full rounded-md border border-white/20 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/10">
              Sign Out
            </button>
          </form>
          <Link href="/" className="block mt-4 text-center text-xs font-semibold text-brand-accent hover:underline">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}
