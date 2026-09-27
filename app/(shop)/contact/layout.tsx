/**
 * Contact page layout — Server Component wrapper that exports static metadata.
 * The contact page itself is a "use client" component and cannot export metadata,
 * so this layout provides the unique title/description for /contact.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Farm and Friends. Reach us via WhatsApp, email, or our contact form for orders, subscriptions, and queries.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
