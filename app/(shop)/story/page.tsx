import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Reclaiming the soul of Indian staples. Learn why we started KhetSe and our 48-hour farm-to-doorstep promise.",
};

export default function OurStoryPage() {
  return (
    <div className="py-12 sm:py-20 bg-brand-canvas space-y-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Story Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-green/20 text-success px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">
            <SproutIcon className="w-4 h-4" />
            Our Soil Manifesto
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-primary tracking-tight leading-[1.12]">
            Reclaiming the Soul of Indian Staples
          </h1>
          <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Everyday food in India was never meant to sit on a supermarket shelf for 9 months under chemical fumigation. Here is why we started KhetSe.
          </p>
        </div>

        {/* Story Split Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl text-brand-primary">
              The Invisible Tragedy of the Supermarket Aisle
            </h2>
            <p className="text-sm sm:text-base text-brand-secondary leading-relaxed">
              For generations, Indian households bought whole grains from local farmers, stored them with dry neem leaves, and milled them weekly at the neighborhood stone chakkis. The rotis were fragrant, the dals were thick, and gut disorders were virtually unheard of.
            </p>
            <p className="text-sm sm:text-base text-brand-primary leading-relaxed font-medium">
              Over the last twenty years, ultra-processed industrial roller mills replaced stone grinding. Commercial brands began polishing dals with mineral oil for artificial shelf shine, removing the living wheat germ to extend storage life to 12 months.
            </p>
            <p className="text-sm text-brand-secondary leading-relaxed">
              When living bran and germ oils are stripped, the grain is effectively dead. What reaches urban kitchens is empty starch devoid of natural enzymes and minerals.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-brand-secondary/20 bg-brand-beige">
              <div className="relative w-full h-[420px]">
                <Image
                  src="/images/story/story_farm_soil.png"
                  alt="Living soil and wheat farm in Maharashtra"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="p-6 bg-brand-canvas border-t border-brand-secondary/15 space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-green tracking-wider">
                  The Living Grain Promise
                </span>
                <p className="font-display text-lg text-brand-primary">
                  "We keep grains in their protective husk until an order is placed. Then, and only then, do we stone-mill and ship."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Supply Chain Comparison: Supermarket vs KhetSe */}
        <div className="bg-brand-beige/60 rounded-3xl p-8 sm:p-12 border border-brand-secondary/15 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-primary">
              The Difference
            </h2>
            <p className="text-sm text-brand-secondary">
              How traditional supermarket staples compare to a KhetSe freshly milled delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Supermarket Column */}
            <div className="bg-brand-canvas p-6 rounded-2xl border border-red-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                  Supermarket &amp; Commercial Brands
                </span>
                <span className="text-xs text-brand-secondary">6 to 9 Months Old</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-brand-primary">
                <li className="flex items-start gap-2 text-red-900/80">
                  <span className="text-red-500 font-bold shrink-0 mt-px">✕</span>
                  <span>
                    <strong>Bleached &amp; Polished:</strong> Stripped of outer bran layer with talc and liquid paraffin oil for artificial shine.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-red-900/80">
                  <span className="text-red-500 font-bold shrink-0 mt-px">✕</span>
                  <span>
                    <strong>Chemical Fumigation:</strong> Grains stored in high-temp godowns treated with methyl bromide gas to prevent weevils.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-red-900/80">
                  <span className="text-red-500 font-bold shrink-0 mt-px">✕</span>
                  <span>
                    <strong>Nutrient Depleted:</strong> High-speed roller mills reach 95°C, denaturing live enzymes and healthy fatty acids.
                  </span>
                </li>
              </ul>
            </div>

            {/* KhetSe Column */}
            <div className="bg-brand-canvas p-6 rounded-2xl border border-brand-green space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-brand-green/15 px-2.5 py-1 rounded-md">
                  KhetSe Living Staples
                </span>
                <span className="text-xs font-bold text-brand-primary">&lt; 7 days Fresh</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-brand-primary">
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold shrink-0 mt-px">✓</span>
                  <span>
                    <strong>100% Unpolished:</strong> Natural nutrient coat, germ, and fiber left intact for deep flavour and easy digestion.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold shrink-0 mt-px">✓</span>
                  <span>
                    <strong>Milled on Order:</strong> Grains sleep intact in earthen structures until your delivery batch is triggered.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold shrink-0 mt-px">✓</span>
                  <span>
                    <strong>No Flour Blending:</strong>Each variety is milled and packed separately rather than mixing different grain lots.
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* The 48-Hour Journey Timeline */}
        <div className="bg-brand-beige/60 rounded-3xl p-8 sm:p-14 border border-brand-secondary/15 text-left space-y-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-success uppercase tracking-wider">
              From Soil to Chulha
            </span>
            <h3 className="font-display text-3xl text-brand-primary">
              The 7-days Farm-to-Doorstep Journey
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-brand-canvas p-6 rounded-2xl border border-brand-secondary/15 space-y-3 shadow-sm hover:border-brand-green/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-success flex items-center justify-center font-display text-xl font-bold">
                1
              </div>
              <h4 className="font-display text-lg text-brand-primary">Living Soil</h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Native heritage seeds nurtured with cow-based Jeevamrit and zero synthetic sprays.
              </p>
            </div>

            <div className="bg-brand-canvas p-6 rounded-2xl border border-brand-secondary/15 space-y-3 shadow-sm hover:border-brand-green/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-success flex items-center justify-center font-display text-xl font-bold">
                2
              </div>
              <h4 className="font-display text-lg text-brand-primary">Earthen Granary</h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Harvested grains rest intact in naturally ventilated traditional granaries with natural neem preservation.
              </p>
            </div>

            <div className="bg-brand-canvas p-6 rounded-2xl border border-brand-secondary/15 space-y-3 shadow-sm hover:border-brand-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center font-display text-xl font-bold">
                3
              </div>
              <h4 className="font-display text-lg text-brand-primary">Small-Batch Processing</h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Grains are processed in smaller batches rather than through continuous bulk production.              </p>
            </div>

            <div className="bg-brand-canvas p-6 rounded-2xl border border-brand-secondary/15 space-y-3 shadow-sm hover:border-brand-green/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-success flex items-center justify-center font-display text-xl font-bold">
                4
              </div>
              <h4 className="font-display text-lg text-brand-primary">7-days Doorstep Arrival</h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Eco-packaged and delivered fresh to your kitchen, filling your home with authentic harvest aroma.
              </p>
            </div>

          </div>
        </div>

        {/* CTA to Shop & Farm */}
        <div className="text-center space-y-5">
          <h3 className="font-display text-2xl sm:text-3xl text-brand-primary">
            Taste Real Food From Living Soil
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="bg-brand-accent hover:bg-brand-accent/85 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm inline-flex items-center justify-center"
            >
              Shop Fresh Staples
            </Link>
            {/* <Link
              href="/farm"
              className="bg-brand-beige hover:bg-[#ebdccb] text-brand-primary font-medium px-8 py-3.5 rounded-xl border border-brand-secondary/20 transition-all text-sm inline-flex items-center justify-center shadow-sm"
            >
              Meet Our Farmers
            </Link> */}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Icons ---
const SproutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);
