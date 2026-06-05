/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — robots.ts                                                          │
 * │  File: app/robots.ts                                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Generates a robots.txt file dynamically via Next.js's MetadataRoute API.   │
 * │  Tells search engine crawlers what to index and what to skip.                │
 * │                                                                              │
 * │  RULES:                                                                      │
 * │  - Allow all paths by default.                                               │
 * │  - Disallow /admin/ (no reason to index admin dashboards).                   │
 * │  - Disallow /checkout (transactional page, should not appear in search).     │
 * │  - Disallow /account (private, user-specific content).                       │
 * │  - Disallow /login (login pages rarely need indexing).                       │
 * │  - Disallow /api/ (API routes should not be crawled).                        │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/checkout", "/account", "/login", "/api/"],
    },
    // Update this to your production domain before go-live.
    sitemap: "https://khetse.in/sitemap.xml",
  };
}
