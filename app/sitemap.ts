/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  Farm and Friends — sitemap.ts                                              │
 * │  File: app/sitemap.ts                                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Generates a dynamic sitemap.xml via Next.js's MetadataRoute API.           │
 * │  Search engines use this to discover and prioritize your pages.              │
 * │                                                                              │
 * │  STATIC ROUTES:                                                              │
 * │  Hardcoded entries for the main marketing/shop pages.                        │
 * │                                                                              │
 * │  DYNAMIC ROUTES:                                                             │
 * │  Fetches all active product IDs from the product repository and generates   │
 * │  individual /shop/[id] entries for each product.                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { MetadataRoute } from "next";
import { getProductRepo } from "./lib/repositories";

const baseUrl = "https://farmandfriends.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trial-kits`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/farm`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productRepo = getProductRepo();
    const products = await productRepo.getActiveProducts();
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch products", err);
  }

  return [...staticRoutes, ...productRoutes];
}
