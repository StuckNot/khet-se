/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Razorpay Global Type Declarations                                  │
 * │  File: types/razorpay.d.ts                                                   │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Razorpay injects its checkout script (checkout.js) into the browser at      │
 * │  runtime via a <Script> tag. TypeScript does not know about                  │
 * │  `window.Razorpay` by default, which causes `any` casts and type errors.     │
 * │                                                                              │
 * │  This file declares the minimal shape of the Razorpay browser SDK so we     │
 * │  get type safety in CheckoutClient.tsx without importing a full package.     │
 * │                                                                              │
 * │  IMPORTANT:                                                                  │
 * │  This is NOT the full Razorpay type definition. It covers only what          │
 * │  KhetSe currently uses. Extend as needed when more Razorpay APIs are used.   │
 * │                                                                              │
 * │  Reference: https://razorpay.com/docs/payment-gateway/web-integration/       │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

/** The response object passed to the Razorpay `handler` callback on success. */
export interface RazorpayPaymentResponse {
  /** Razorpay payment ID (e.g. "pay_xxxxx"). Use this to verify the payment. */
  razorpay_payment_id: string;
  /** Razorpay order ID (e.g. "order_xxxxx"). Matches the one we created server-side. */
  razorpay_order_id: string;
  /**
   * HMAC-SHA256 signature. This MUST be verified server-side by:
   *   crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
   *     .update(order_id + "|" + payment_id)
   *     .digest("hex")
   * Only if the generated signature matches this value is the payment genuine.
   */
  razorpay_signature: string;
}

/** The error object passed to the `payment.failed` event listener. */
export interface RazorpayPaymentFailedResponse {
  error: {
    /** Razorpay error code (e.g. "BAD_REQUEST_ERROR"). */
    code: string;
    /** Human-readable error description shown in the UI. */
    description: string;
    /** Razorpay-specific error reason. */
    reason: string;
    /** The payment source where the error originated. */
    source: string;
    /** The step in the payment flow where the error occurred. */
    step: string;
    /** Metadata object from Razorpay. */
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

/** Configuration options passed to `new Razorpay(options)`. */
export interface RazorpayOptions {
  /** Your Razorpay Key ID (public). Use `NEXT_PUBLIC_RAZORPAY_KEY_ID`. */
  key: string | undefined;
  /** Order amount in paise (smallest currency unit). ₹100 = 10000 paise. */
  amount: number;
  /** Currency code. "INR" for Indian Rupee. */
  currency: string;
  /** Your brand name shown in the Razorpay popup header. */
  name: string;
  /** Short description of what's being purchased. */
  description: string;
  /** Razorpay order ID from the server-side order creation. */
  order_id: string | null | undefined;
  /**
   * Success callback. Called after the user completes payment.
   * IMPORTANT: Do NOT trust this callback alone. Always verify the
   * signature server-side in /api/payment-verify before fulfilling the order.
   */
  handler: (response: RazorpayPaymentResponse) => void;
  /** UI theme customization. */
  theme?: {
    /** Hex color for the Razorpay popup accent (e.g. "#2E7D32"). */
    color?: string;
  };
}

/** The Razorpay checkout instance returned by `new window.Razorpay(options)`. */
export interface RazorpayInstance {
  /** Opens the Razorpay payment popup. */
  open: () => void;
  /**
   * Attaches an event listener.
   * Use `"payment.failed"` to handle payment failures gracefully.
   */
  on: (event: "payment.failed", handler: (response: RazorpayPaymentFailedResponse) => void) => void;
}

/** Augment the global `window` object to include the Razorpay constructor. */
declare global {
  interface Window {
    /**
     * Razorpay checkout constructor. Available after loading:
     * <Script src="https://checkout.razorpay.com/v1/checkout.js" />
     *
     * Usage:
     *   const rzp = new window.Razorpay(options);
     *   rzp.open();
     */
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
