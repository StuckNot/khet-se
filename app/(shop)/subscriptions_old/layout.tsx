/**
 * Legacy subscriptions_old route — excluded from indexing.
 * This route is superseded by /trial-kits and should not appear in search results.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions (Legacy)",
  robots: { index: false, follow: false },
};

export default function SubscriptionsOldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
