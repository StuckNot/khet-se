/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Global 404 Not Found Page                                          │
 * │  File: app/not-found.tsx                                                     │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Rendered by Next.js for all 404 errors — when a user visits a URL that     │
 * │  doesn't match any route in the app. Replaces the default Next.js 404 page  │
 * │  with branded KhetSe styling.                                                │
 * │                                                                              │
 * │  PLACEMENT:                                                                  │
 * │  At the root of `app/` so it covers ALL routes (shop, admin, API, etc.).    │
 * │  Individual route groups can have their own not-found.tsx if needed.         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-canvas px-4 text-center">
      <span className="text-7xl mb-6">🌾</span>
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent mb-3">
        404 — Page Not Found
      </p>
      <h1 className="font-display text-3xl font-bold text-brand-primary mb-4">
        Looks like this field is empty.
      </h1>
      <p className="text-brand-primary/60 max-w-sm mb-10">
        The page you{"'"}re looking for doesn{"'"}t exist or may have been moved. Let
        us guide you back to freshness.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-secondary px-6 py-3 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90"
        >
          Back to Homepage
        </Link>
        <Link
          href="/shop"
          className="rounded-lg border-2 border-brand-primary px-6 py-3 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-canvas"
        >
          Browse the Harvest
        </Link>
      </div>
    </div>
  );
}
