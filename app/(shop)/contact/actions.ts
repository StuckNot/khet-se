"use server";

import { resend } from "@/utils/resend";

/**
 * submitContactMessage — Server Action for the /contact page form.
 *
 * Sends the customer's inquiry to info@khetse.in via Resend.
 *
 * ENVIRONMENT VARIABLE REQUIRED:
 *   RESEND_API_KEY — set this in .env.local before this action will work.
 *   Get a key from https://resend.com/api-keys
 *
 * FROM ADDRESS:
 *   Uses Resend's shared sandbox sender (onboarding@resend.dev) by default,
 *   matching the existing order receipt setup. Replace with a verified
 *   @khetse.in address once the domain is verified in the Resend dashboard.
 *
 * TO ADDRESS:
 *   Currently set to info@khetse.in — update this to the correct support
 *   inbox before going live.
 */
export async function submitContactMessage(formData: FormData) {
  const name    = formData.get("name")    as string | null;
  const email   = formData.get("email")   as string | null;
  const phone   = formData.get("phone")   as string | null;
  const subject = formData.get("subject") as string | null;
  const message = formData.get("message") as string | null;

  if (!name || !email || !message) {
    return { error: "Missing required fields." };
  }

  const subjectLabels: Record<string, string> = {
    subscription: "Subscription & Delivery Schedule",
    dietary:      "Dietary & Grain Suitability",
    trial:        "Trial Discovery Kit Questions",
    wholesale:    "Bulk / Restaurant / Corporate Gifting",
    farmer:       "Farmer Partnership Inquiry",
  };
  const subjectLabel = subjectLabels[subject ?? ""] ?? subject ?? "General Inquiry";

  const { error } = await resend.emails.send({
    from: "KhetSe Contact <onboarding@resend.dev>",
    to:   "info@khetse.in",
    replyTo: email,
    subject: `[KhetSe Contact] ${subjectLabel} — from ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4A2C1A; margin-top: 0;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #7B4B2A; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #7B4B2A; font-weight: bold;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C26D3A;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #7B4B2A; font-weight: bold;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #7B4B2A; font-weight: bold;">Topic</td><td style="padding: 8px 0;">${subjectLabel}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <h3 style="color: #4A2C1A; margin-bottom: 8px;">Message</h3>
        <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
<<<<<<< Updated upstream
        <p style="font-size: 12px; color: #999;">Submitted via khetse.in/contact · Reply-To is set to the customer's email.</p>
=======
        <p style="font-size: 12px; color: #999;">Submitted via khetse.in/contact Â· Reply-To is set to the customer's email.</p>
>>>>>>> Stashed changes
      </div>
    `,
  });

  if (error) {
    console.error("[submitContactMessage] Resend error:", error);
    return { error: "Failed to send your message. Please try again or reach us directly on WhatsApp." };
  }

  return { success: true };
}
