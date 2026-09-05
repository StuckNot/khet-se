/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Next.js Configuration                                              │
 * │  File: next.config.ts                                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Central Next.js build and runtime configuration.                            │
 * │                                                                              │
 * │  IMAGE OPTIMIZATION:                                                         │
 * │  The `images.remotePatterns` config whitelists external image hostnames.     │
 * │  Without this, using next/image with a Supabase Storage URL will throw an   │
 * │  error at runtime. Add all image domains your app needs here.                │
 * │                                                                              │
 * │  SECURITY:                                                                   │
 * │  Next.js Image Optimization only serves images from whitelisted domains.     │
 * │  This prevents your server from being used as a proxy for arbitrary URLs.    │
 * │                                                                              │
 * │  HOW TO FIND YOUR SUPABASE HOSTNAME:                                         │
 * │  It's in your NEXT_PUBLIC_SUPABASE_URL env var:                              │
 * │  e.g. https://abcdefghijklmno.supabase.co → hostname is                     │
 * │       abcdefghijklmno.supabase.co                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * allowedDevOrigins — Allows the Next.js dev server to serve requests from
   * these origins. Needed for WSL2 / Docker local development setups where
   * the browser and dev server have different network addresses.
   * Remove or update this for your own machine if needed.
   */
  allowedDevOrigins: ["172.17.176.1"],

  /**
   * images.remotePatterns — Whitelist of external domains allowed for next/image.
   * 
   * Current entries:
   * 1. *.supabase.co — Supabase Storage URLs for product images.
   *    The `**` hostname pattern matches any Supabase project subdomain.
   *
   * HOW TO ADD MORE:
   * - Each entry needs { protocol, hostname, port?, pathname? }
   * - Example for a CDN: { protocol: "https", hostname: "cdn.example.com" }
   */
  images: {
    remotePatterns: [
      {
        // Supabase Storage: covers project-specific URLs like:
        // https://abcdefghijklmno.supabase.co/storage/v1/object/public/...
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
