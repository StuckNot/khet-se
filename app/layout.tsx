import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — Root Layout                                                        │
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
 * The `template` in `title` appends " | Farm and Friends" to each page's title string.
 * Example: a page exporting title: "Shop All Staples" renders as:
 *   "Shop All Staples | Farm and Friends"
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://farmandfriends.in"),
  title: {
    default: "Farm and Friends — Farm-to-Pantry Organic Staples",
    template: "%s | Farm and Friends",
  },
  description:
    "100% chemical-free organic staples delivered directly from verified Indian farms to your pantry in 7 days. Subscribe and never run out of rice, lentils, flour, or spices again.",
  keywords: [
    "organic food India",
    "farm to pantry",
    "organic staples delivery",
    "chemical-free food",
    "organic subscription",
    "Farm and Friends",
  ],
  authors: [{ name: "Farm and Friends" }],
  creator: "Farm and Friends",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://farmandfriends.in",
    siteName: "Farm and Friends",
    title: "Farm and Friends — Farm-to-Pantry Staples",
    description:
      "100% chemical-free, lab-tested staples from farm to your pantry in 7 days.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Farm and Friends — Pure organic staples from Indian farms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farm and Friends — Farm-to-Pantry Staples",
    description:
      "100% chemical-free, lab-tested staples from farm to your pantry in 7 days.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Farm and Friends",
              url: "https://farmandfriends.in",
              logo: "https://farmandfriends.in/images/logo/farm-and-friends-logo.png",
              description:
                "100% chemical-free staples delivered from Indian farms.",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "farmnfriendsonline@gmail.com",
                telephone: "+91-88518-19808",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
