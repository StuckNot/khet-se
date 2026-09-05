"use client";

import React, { useState } from "react";
import { submitContactMessage } from "./actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "subscription",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    setError(null);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("subject", formData.subject);
    data.append("message", formData.message);

    try {
      const result = await submitContactMessage(data);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-brand-canvas space-y-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-green/20 text-success px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">
            <MessageCircleIcon className="w-4 h-4" />
            Direct Farm Support
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-primary tracking-tight leading-[1.12]">
            We'd Love to Hear From You
          </h1>
          <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Have questions about stone-milling schedules, dietary suitability for diabetic rotis, or custom corporate & bulk staple hampers?
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Contact Cards & Hubs */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-brand-canvas rounded-3xl p-6 sm:p-8 border border-brand-secondary/15 space-y-6 shadow-sm">
              <h3 className="font-display text-2xl text-brand-primary">Direct Channels</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-beige/60 border border-brand-secondary/10">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success shrink-0">
                    <MessageCircleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-success">Instant WhatsApp</span>
                    <p className="font-bold text-brand-primary">+91 88518 19808</p>
                    <p className="text-[11px] text-brand-secondary">Milling batch reminders & quick swaps</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-beige/60 border border-brand-secondary/10">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-secondary">Email Care</span>
                    <p className="font-bold text-brand-primary">info@farmandfriends.in</p>
                    <p className="text-[11px] text-brand-secondary">Responses within 4 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-beige/60 border border-brand-secondary/10">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-secondary">Support Hours</span>
                    <p className="font-bold text-brand-primary">10:00 am to 8:00 pm</p>
                    <p className="text-[11px] text-brand-secondary">Direct farmer dispatch queries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Milling & Fulfillment Centers */}
            {/* <div className="bg-brand-beige/70 rounded-3xl p-6 sm:p-8 border border-brand-secondary/15 space-y-4 shadow-sm">
              <h3 className="font-display text-xl text-brand-primary flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-brand-accent" />
                Milling & Dispatch Hubs
              </h3>

              <div className="space-y-3 text-xs text-brand-secondary">
                <div className="p-3 bg-brand-canvas rounded-xl border border-brand-secondary/10 space-y-1">
                  <p className="font-bold text-brand-primary">Stone-Milling Facility (Maharashtra)</p>
                  <p>[Maharashtra Facility Address TBD]</p>
                </div>

                <div className="p-3 bg-brand-canvas rounded-xl border border-brand-secondary/10 space-y-1">
                  <p className="font-bold text-brand-primary">South India Distribution Hub</p>
                  <p>[South India Hub Address TBD]</p>
                </div>
              </div>
            </div> */}

          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-brand-canvas rounded-3xl p-8 sm:p-10 border border-brand-secondary/15 shadow-sm space-y-6 relative overflow-hidden">
              <div className="space-y-1">
                <h3 className="font-display text-2xl sm:text-3xl text-brand-primary">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary">
                  Whether you're a subscriber, a chef, or looking for institutional staple supply.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {isSubmitted ? (
                <div className="bg-brand-beige p-8 rounded-2xl border border-brand-green space-y-3 text-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-brand-green/20 text-success flex items-center justify-center mx-auto">
                    <CheckCircle2Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-xl text-brand-primary">Message Received!</h4>
                  <p className="text-xs text-brand-secondary max-w-sm mx-auto">
                    Thank you, {formData.name}. Our farm coordination team will reply to <strong>{formData.email}</strong> within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "subscription", message: "" });
                    }}
                    className="mt-4 text-xs font-semibold text-brand-accent underline hover:text-brand-accent/80 transition-colors"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priyadarshini Sen"
                        className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                        Mobile Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-primary focus:outline-none focus:border-brand-accent cursor-pointer"
                      >
                        <option value="subscription">Subscription & Delivery Schedule</option>
                        <option value="dietary">Dietary & Grain Suitability (Diabetic/Gut)</option>
                        <option value="trial">Trial Discovery Kit Questions</option>
                        <option value="wholesale">Bulk / Restaurant / Corporate Gifting</option>
                        <option value="farmer">Farmer Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our farm team assist you with pure staples?"
                      className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-primary placeholder-brand-secondary/50 focus:outline-none focus:border-brand-accent"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-accent hover:bg-brand-accent/85 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    ) : (
                      <SendIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span>{isSubmitting ? "Sending..." : "Send Message to Farm Team"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Icons ---
const MessageCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const CheckCircle2Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
