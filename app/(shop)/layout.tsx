/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Shop Layout (Server Component)                                    │
 * │  File: app/(shop)/layout.tsx                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Wraps all storefront pages with the global Navbar and Footer.               │
 * │  Fetches the current auth session server-side and passes the user            │
 * │  object to the Navbar so it can conditionally render login/logout UI.        │
 * │                                                                              │
 * │  DATA FLOW:                                                                  │
 * │                                                                              │
 * │    layout.tsx (RSC)                                                          │
 * │        │                                                                     │
 * │        ├── supabase.auth.getUser() → user | null                             │
 * │        │                                                                     │
 * │        ├── <Navbar user={user} />   ← Client Component                       │
 * │        ├── <main>{children}</main>  ← Page content (RSC)                     │
 * │        └── <Footer />               ← Client Component                       │
 * │                                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { createClient } from "@/utils/supabase/server";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch user session server-side. getUser() validates the JWT with Supabase
  // Auth (unlike getSession() which only reads the cookie without validation).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-brand-canvas">
      <Navbar user={user} />
      <CartDrawer />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
