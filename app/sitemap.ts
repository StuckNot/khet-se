/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — sitemap.ts                                                         │
 * │  File: app/sitemap.ts                                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Generates a dynamic sitemap.xml via Next.js's MetadataRoute API.           │
 * │  Search engines use this to discover and prioritize your pages.              │
 * │                                                                              │
 * │  STATIC ROUTES:                                                              │
 * │  Hardcoded entries for the main marketing/shop pages.                        │
 * │                                                                              │
 * │  DYNAMIC ROUTES (TODO):                                                      │
 * │  If you add individual product pages (e.g. /shop/[productId]), fetch all     │
 * │  active product IDs from Supabase and add entries here. Example:             │
 * │  const { data: products } = await supabase.from("products").select("id");    │
 * │  products.map(p => ({ url: `https://khetse.in/shop/${p.id}`, ... }))        │
 * │                                                                              │
 * │  NOTE:                                                                       │
 * │  Update `baseUrl` to your production domain before going live.               │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { MetadataRoute } from "next";

const baseUrl = "https://khetse.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      // Priority 1.0 = highest importance. Tell crawlers the homepage is most important.
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily", // Products update frequently
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trial-kits`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
