import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import type { Metadata } from "next";

/**
 * Page-level SEO metadata for /checkout.
 * We mark this noindex — checkout pages should not appear in search results.
 */
export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your KhetSe order.",
  robots: { index: false, follow: false },
};

/**
 * CheckoutPage — Server Component guard.
 *
 * This RSC's only job is authentication. If the user is not logged in,
 * they are redirected to /login before any checkout UI is rendered.
 * The actual checkout form is in CheckoutClient.tsx (Client Component).
 */


export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Please log in to complete your checkout.");
  }

  return (
    <div className="min-h-screen bg-brand-canvas py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-primary">Checkout</h1>
          <Link href="/shop" className="text-sm font-semibold text-brand-secondary hover:underline">
            ← Continue Shopping
          </Link>
        </div>
        
        <CheckoutClient />
      </div>
    </div>
  );
}
