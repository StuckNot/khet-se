/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Shop Loading Skeleton                                              │
 * │  File: app/(shop)/loading.tsx                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Next.js App Router automatically renders this component while any page     │
 * │  inside app/(shop)/ is streaming or fetching its initial data.               │
 * │                                                                              │
 * │  WHY SKELETONS?                                                              │
 * │  Without this file, the user sees a blank white page while the server        │
 * │  fetches products from Supabase. Skeletons provide instant visual feedback,  │
 * │  which dramatically improves perceived performance (a key UX metric).        │
 * │                                                                              │
 * │  HOW IT WORKS:                                                               │
 * │  Next.js wraps page components in a React Suspense boundary. This file       │
 * │  is the fallback UI for that boundary. It should match the rough layout of  │
 * │  the pages it covers to minimise layout shift when the real content arrives. │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-brand-canvas py-16 animate-pulse">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page heading skeleton */}
        <div className="mb-12 text-center">
          <div className="h-10 w-64 rounded-lg bg-brand-primary/10 mx-auto mb-4" />
          <div className="h-5 w-96 rounded-lg bg-brand-primary/5 mx-auto" />
        </div>

        {/* Product grid skeleton — 3 columns to match the real grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm"
            >
              {/* Product image placeholder */}
              <div className="mb-6 h-48 w-full rounded-lg bg-brand-primary/5" />
              {/* Category pill */}
              <div className="mb-3 h-5 w-20 rounded-full bg-brand-accent/20" />
              {/* Product name */}
              <div className="mb-2 h-6 w-3/4 rounded-lg bg-brand-primary/10" />
              {/* Description */}
              <div className="mb-6 h-4 w-full rounded-lg bg-brand-primary/5" />
              <div className="mb-6 h-4 w-2/3 rounded-lg bg-brand-primary/5" />
              {/* Price + button row */}
              <div className="flex items-center justify-between border-t border-brand-primary/5 pt-4">
                <div className="h-7 w-16 rounded-lg bg-brand-primary/10" />
                <div className="h-9 w-28 rounded-md bg-brand-primary/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
