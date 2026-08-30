/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — robots.ts                                                          │
 * │  File: app/robots.ts                                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Generates a robots.txt file dynamically via Next.js's MetadataRoute API.   │
 * │  Tells search engine crawlers what to index and what to skip.                │
 * │                                                                              │
 * │  RULES:                                                                      │
 * │  - Allow all paths by default.                                               │
 * │  - Disallow /admin/ (protects admin routes).                                 │
 * │  - Disallow /account (user dashboard, irrelevant to search).                 │
 * │  - Disallow /api/ (backend routes).                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://farmandfriends.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account", "/admin/login", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
