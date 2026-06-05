/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Razorpay Server-Side Instance Factory                              │
 * │  File: utils/razorpay.ts                                                     │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Creates and returns a server-side Razorpay SDK instance. Used only in       │
 * │  Server Actions and API routes — NEVER in Client Components.                 │
 * │                                                                              │
 * │  WHY A FACTORY FUNCTION?                                                     │
 * │  We cannot create the instance at module load time because the env vars      │
 * │  might not be available during build. A factory function fails fast at        │
 * │  call-time with a clear error if the keys are missing.                       │
 * │                                                                              │
 * │  ENVIRONMENT VARIABLES REQUIRED:                                             │
 * │  - RAZORPAY_KEY_ID      (server-only, never expose to client)                │
 * │  - RAZORPAY_KEY_SECRET  (server-only, never expose to client)                │
 * │                                                                              │
 * │  STATUS — INCOMPLETE (see TASKS.md → Batch 7b):                             │
 * │  Currently only used for one-time order creation (razorpay.orders.create).   │
 * │  The recurring mandate / subscription flow (razorpay.subscriptions.create)  │
 * │  is pending implementation. See TASKS.md → R-3.                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import Razorpay from "razorpay";

/**
 * getRazorpayInstance — returns a configured Razorpay SDK instance.
 *
 * Throws immediately if the required environment variables are missing,
 * so a misconfigured deployment fails loudly rather than silently.
 *
 * @throws {Error} if RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET are not set.
 * @returns A Razorpay SDK instance ready for API calls.
 *
 * @example
 * // In a Server Action:
 * const razorpay = getRazorpayInstance();
 * const order = await razorpay.orders.create({ amount: 50000, currency: "INR", receipt: "rcpt_001" });
 */
export const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay API keys are missing from environment variables. " +
      "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local (development) " +
      "or your hosting provider's environment settings (production)."
    );
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
