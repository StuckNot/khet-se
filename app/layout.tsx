import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Root Layout                                                        │
 * │  File: app/layout.tsx                                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  The root layout wraps every page in the application. It is responsible for: │
 * │  1. Setting global fonts (DM Serif Display & Inter via next/font/google).    │
 * │  2. Exporting sitewide default metadata for SEO.                             │
 * │  3. Providing the <html> and <body> structure.                               │
 * │                                                                              │
 * │  METADATA:                                                                   │
 * │  The `metadata` export here is the DEFAULT (fallback). Individual pages      │
 * │  can override specific fields (e.g. title, description) by exporting their  │
 * │  own `metadata` object. Next.js merges them using a "shallow override".      │
 * │                                                                              │
 * │  FONTS:                                                                      │
 * │  We use next/font/google which downloads and serves fonts at build time.     │
 * │  This eliminates the cumulative layout shift (CLS) from Google Fonts CDN    │
 * │  and removes the external network dependency.                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/**
 * Default SEO metadata — applied to every page unless overridden.
 *
 * Individual pages export their own `metadata` to override title/description.
 * The `template` in `title` appends " | KhetSe" to each page's title string.
 * Example: a page exporting title: "Shop All Staples" renders as:
 *   "Shop All Staples | KhetSe"
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: {
    default: "KhetSe — Farm-to-Pantry Organic Staples",
    template: "%s | KhetSe",
  },
  description:
    "100% chemical-free organic staples delivered directly from verified Indian farms to your pantry in under 48 hours. Subscribe and never run out of rice, lentils, flour, or spices again.",
  keywords: [
    "organic food India",
    "farm to pantry",
    "organic staples delivery",
    "chemical-free food",
    "organic subscription",
    "KhetSe",
  ],
  authors: [{ name: "KhetSe" }],
  creator: "KhetSe",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://khetse.in",
    siteName: "KhetSe",
    title: "KhetSe — Farm-to-Pantry Organic Staples",
    description:
      "100% chemical-free, lab-tested staples from farm to your pantry in under 48 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KhetSe — Farm-to-Pantry Organic Staples",
    description:
      "100% chemical-free, lab-tested staples from farm to your pantry in under 48 hours.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
