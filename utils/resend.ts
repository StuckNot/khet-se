/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — Transactional Email Utility (Resend)                               │
 * │  File: utils/resend.ts                                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Wraps the Resend email SDK to send transactional emails such as order       │
 * │  receipts. Called server-side only (in API routes and Server Actions).       │
 * │                                                                              │
 * │  ENVIRONMENT VARIABLE REQUIRED:                                              │
 * │  - RESEND_API_KEY: Get from https://resend.com/api-keys                     │
 * │                                                                              │
 * │  KNOWN LIMITATION (see TASKS.md → L-4):                                      │
 * │  The "from" address uses `onboarding@resend.dev` which is Resend's shared   │
 * │  test domain. Before going live, verify a custom domain (e.g. farmandfriends.in)    │
 * │  in the Resend dashboard and update the `from` field to                      │
 * │  `orders@farmandfriends.in` or similar.                                              │
 * │                                                                              │
 * │  USAGE:                                                                      │
 * │  Call sendOrderReceipt() after confirming a successful payment. The function │
 * │  is designed to be fire-and-forget (no await needed at the call site) —      │
 * │  email failures should not block the payment confirmation response.          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { Resend } from "resend";

/**
 * Resend client — initialized with the API key from environment variables.
 * Exported in case other modules need direct Resend access in the future.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendOrderReceipt — sends a confirmation email after a successful payment.
 *
 * Designed to be called fire-and-forget from the payment verification route.
 * If the email fails, the order is still considered successful — we log the
 * error but do not throw.
 *
 * @param email      - The customer's email address.
 * @param firstName  - The customer's first name (from their profile).
 * @param orderId    - The Supabase UUID of the order (used for reference).
 * @param amount     - The total order amount in Indian Rupees (₹).
 *
 * @returns void — this function is intentionally fire-and-forget.
 */
export async function sendOrderReceipt(
  email: string,
  firstName: string,
  orderId: string,
  amount: number
) {
  // Guard: skip silently if the API key is not configured.
  // This prevents crashes in local development where the key is a placeholder.
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("placeholder")) {
    return;
  }

  try {
    await resend.emails.send({
      // TODO (TASKS.md L-4): Replace with verified custom domain before going live.
      from: "Farm and Friends Orders <onboarding@resend.dev>",
      to: email,
      subject: `Farm and Friends Order Confirmation - #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
          <h1 style="color: #2E7D32;">Thank you for your order! 🌾</h1>
          <p>Hi ${firstName},</p>
          <p>We've successfully received your payment of <strong>₹${amount}</strong> for order <strong>#${orderId.slice(0, 8)}</strong>.</p>
          <p>Your staples are being packed and will be delivered straight from the farm to your pantry soon.</p>
          <br />
          <p>Warmly,</p>
          <p><strong>The Farm and Friends Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    // Log but do not re-throw. Email failure should not break the payment flow.
    console.error("[sendOrderReceipt] Failed to send receipt email:", error);
  }
}
