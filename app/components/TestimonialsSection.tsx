import React from "react";
import type { Tables } from "@/types/database.types";

type Testimonial = Tables<"testimonials">;

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-brand-beige/40 border-t border-brand-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider bg-brand-canvas px-3.5 py-1 rounded-full border border-brand-secondary/15 inline-block">
            Pantry Experiences
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-primary">
            Loved by Conscious Indian Kitchens
          </h2>
          <p className="text-sm sm:text-base text-brand-secondary">
            Over 14,000 households have switched their daily staples subscription to KhetSe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-brand-canvas p-8 rounded-3xl border border-brand-secondary/15 shadow-sm flex flex-col justify-between space-y-6 relative"
            >
              <QuoteIcon className="w-8 h-8 text-brand-accent/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#F57C00]">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-brand-primary leading-relaxed italic">
                  "{t.review_text}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-beige flex items-center gap-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.customer_name}
                    className="w-11 h-11 rounded-full object-cover border border-brand-secondary/20"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-beige flex items-center justify-center border border-brand-secondary/20 text-brand-primary font-bold">
                    {t.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-brand-primary">{t.customer_name}</h4>
                  {t.customer_city && (
                    <p className="text-[11px] text-brand-secondary">{t.customer_city}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// Inline SVG Icons
// ═══════════════════════════════════════════════════

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);
