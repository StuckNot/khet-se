/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Account: Subscription Management Server Action                     │
 * │  File: app/(shop)/account/actions.ts                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Action for updating a subscription's status. Called from the         │
 * │  SubscriptionItem component when the user pauses, resumes, or cancels.       │
 * │                                                                              │
 * │  SECURITY MODEL:                                                             │
 * │  - Authenticates the user before any DB write.                               │
 * │  - The UPDATE query includes `.eq("user_id", user.id)` as a secondary        │
 * │    safeguard. Combined with the RLS UPDATE policy (which also checks          │
 * │    auth.uid() = user_id), this ensures a user can NEVER modify another       │
 * │    user's subscription even if they guess the subscription UUID.              │
 * │                                                                              │
 * │  PENDING (TASKS.md R-4):                                                     │
 * │  When Razorpay recurring mandates are implemented, cancelling a subscription  │
 * │  should also call razorpay.subscriptions.cancel(razorpay_subscription_id)    │
 * │  to stop future charges. Without this, the DB record says "cancelled" but   │
 * │  Razorpay may continue to charge the user.                                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * updateSubscriptionStatus — updates the status of a user's subscription.
 *
 * This single action handles pause, resume, and cancel to keep the API surface
 * small and the UI component stateless.
 *
 * @param subscriptionId - The UUID of the subscription to update (from Supabase).
 * @param newStatus      - The target status: "active", "paused", or "cancelled".
 *
 * @returns {{ error: string }} on failure (displayed in the UI)
 * @returns {{ success: true }} on success (triggers revalidatePath to refresh the page)
 *
 * @example
 * // Pause a subscription:
 * const result = await updateSubscriptionStatus(subscription.id, "paused");
 * if (result.error) { ... }
 */
export async function updateSubscriptionStatus(subscriptionId: string, newStatus: "active" | "paused" | "cancelled") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized access." };
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: newStatus })
    .eq("id", subscriptionId)
    // Double-verify ownership at the query level, in addition to the RLS policy.
    // This prevents IDOR (Insecure Direct Object Reference) vulnerabilities.
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update subscription. Please try again." };
  }

  // Revalidate the account page so the updated status shows without a full reload.
  revalidatePath("/account");
  return { success: true };
}
