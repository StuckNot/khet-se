import { getProductRepo } from "@/app/lib/repositories";
import SubscriptionWizard from "./SubscriptionWizard";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * Page-level SEO metadata for /trial-kits.
 */
export const metadata: Metadata = {
  title: "Trial Kits & Subscriptions",
  description:
    "Choose your staple box, set your delivery frequency, and start your KhetSe subscription. Weekly, bi-weekly, or monthly — cancel anytime.",
};

export default async function TrialKitsPage() {
  let products: any[] = [];
  let error = null;

  try {
    const productRepo = getProductRepo();
    products = await productRepo.getActiveProducts();
  } catch (err) {
    error = err;
  }

  const faqs = [
    {
      q: "Why should I try a Trial Kit first?",
      a: "We know switching your household staples is a deliberate choice. Our trial kits let your family test the aroma, cooking time, and digestibility of stone-milled staples for 1 week without any recurring commitment.",
    },
    {
      q: "How fresh are the items in the trial kit?",
      a: "All grains and dals are milled and packed, dispatch from our partner farm hubs.",
    },
    {
      q: "Can I convert my trial kit to a monthly subscription?",
      a: "Yes! After your kit arrives, you will receive a 1-click link to customize your favorite staples into a recurring monthly box with an extra 15% discount and free delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-canvas py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-green/20 text-success px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">
            <GiftIcon className="w-4 h-4" />
            100% Risk-Free Taste Experience
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-brand-primary tracking-tight">
            Taste the Farm Difference in Your Kitchen
          </h1>
          <p className="text-base text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Sample our freshly harvested, stone-milled staples before committing to a monthly plan. Delivered in eco-friendly packaging.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12 text-brand-secondary">
            Unable to load trial kits at this time.
          </div>
        ) : (
          <SubscriptionWizard products={products || []} />
        )}

        {/* Guarantee Banner */}
        <div className="bg-brand-beige rounded-3xl p-8 sm:p-10 border border-brand-secondary/20 flex flex-col sm:flex-row items-center gap-6 text-left">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/20 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-display text-xl text-brand-primary">
              The 100% Unadulterated Taste Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
              Experience the authentic taste of farm-fresh grains and dals, milled to perfection and delivered straight to your kitchen.
            </p>
          </div>
        </div>

        {/* FAQ Accordion (CSS-only summary/details approach for simplicity) */}
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <h3 className="font-display text-2xl text-brand-primary text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-brand-canvas rounded-2xl border border-brand-secondary/15 overflow-hidden transition-colors marker:content-none"
              >
                <summary className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-brand-primary cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronDownIcon className="w-4 h-4 text-brand-secondary transition-transform group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-secondary leading-relaxed border-t border-brand-beige">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Icons ---
const GiftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
