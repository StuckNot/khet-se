/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Payment Verification API Route                                     │
 * │  File: app/api/payment-verify/route.ts                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Called by CheckoutClient.tsx after the Razorpay popup fires its success     │
 * │  callback. Verifies the payment is genuine using HMAC-SHA256 signature       │
 * │  verification, then updates the order status to 'processing' and sends an   │
 * │  email receipt to the customer.                                              │
 * │                                                                              │
 * │  WHY VERIFY SERVER-SIDE?                                                     │
 * │  The Razorpay success callback can be forged by a malicious user in          │
 * │  DevTools. The HMAC signature is computed using our secret key, which only  │
 * │  Razorpay and we know. If the signatures match, the payment is genuine.     │
 * │                                                                              │
 * │  SIGNATURE ALGORITHM:                                                        │
 * │  HMAC-SHA256( key=RAZORPAY_KEY_SECRET, data=order_id + "|" + payment_id )   │
 * │  If this matches the signature Razorpay sent, the payment is valid.          │
 * │                                                                              │
 * │  REQUEST BODY (JSON):                                                        │
 * │  - razorpay_payment_id: string  — from Razorpay success handler             │
 * │  - razorpay_order_id:   string  — from Razorpay success handler             │
 * │  - razorpay_signature:  string  — from Razorpay success handler             │
 * │  - order_id:            string  — our internal Supabase order UUID          │
 * │                                                                              │
 * │  RESPONSE:                                                                   │
 * │  200 { success: true }   — payment verified, order updated, receipt sent    │
 * │  400 { error: string }   — invalid signature (forged or tampered)           │
 * │  500 { error: string }   — server-side error                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { sendOrderReceipt } from '@/utils/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id
    } = body as {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      order_id: string;
    };

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      // This should never happen in production — indicates a missing env var.
      console.error("[payment-verify] RAZORPAY_KEY_SECRET is not set. Check environment variables.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // ── Signature Verification ─────────────────────────────────────────────────
    // Razorpay's signature = HMAC-SHA256(secret, order_id + "|" + payment_id)
    // We compute the same hash and compare. If they match, the payment is genuine.
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Signature mismatch — this request is either forged or tampered with.
      // Do NOT update the order or send a receipt.
      console.error("[payment-verify] Signature mismatch. Possible payment forgery attempt.", {
        order_id,
        razorpay_order_id,
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // ── Update Order Status ────────────────────────────────────────────────────
    // Payment is verified. Move the order from 'pending' to 'processing'.
    // We also store the payment_id and signature for audit trails.
    const supabase = await createClient();

    const { data: orderData, error } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        razorpay_payment_id,
        razorpay_signature
      })
      .eq('id', order_id)
      // Double-check: the order_id must match the Razorpay order_id we stored.
      // This prevents one user from verifying another user's order.
      .eq('razorpay_order_id', razorpay_order_id)
      .select('subscription_id, total_amount')
      .single();

    if (error || !orderData) {
      console.error('[payment-verify] Failed to update order status:', { error, order_id });
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    // ── Activate Subscription (MVP Flow) ───────────────────────────────────────
    // If this order is the first payment for a subscription, activate the subscription.
    if (orderData.subscription_id) {
      const { error: subError } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', orderData.subscription_id);

      if (subError) {
        console.error('[payment-verify] Failed to activate subscription:', { subError, subscription_id: orderData.subscription_id });
        // We log the error but don't fail the request since payment was captured and order is processing.
      }
    }

    // ── Send Email Receipt ─────────────────────────────────────────────────────
    // Fetch the authenticated user and their profile to personalize the email.
    // We fire-and-forget (no await on sendOrderReceipt) to not block the response.
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();
      
      if (profile && orderData) {
        // Non-blocking: if the email fails, we still return success.
        // The order has already been marked as 'processing'.
        sendOrderReceipt(user.email, profile.first_name, order_id, orderData.total_amount);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[payment-verify] Unhandled error in payment verification:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
