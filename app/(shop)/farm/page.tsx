import React from "react";
import Link from "next/link";

export default function TheFarmPage() {
  return (
    <div className="min-h-screen bg-brand-canvas py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-secondary/20 text-brand-secondary text-xs font-semibold uppercase tracking-widest">
            Radical Transparency
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-primary mb-6 tracking-tight">
            Inside The Farm
          </h1>
          <p className="text-lg md:text-xl text-brand-primary/70 max-w-2xl mx-auto leading-relaxed">
            We don't just buy organic ingredients; we partner with the soil. Discover the strict agricultural standards that make KhetSe staples truly pure.
          </p>
        </div>

        {/* The Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 border border-brand-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center text-2xl mb-6">
              🚫
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-3">Zero Synthetics</h3>
            <p className="text-brand-primary/70 text-sm leading-relaxed">
              Our partner farms strictly prohibit the use of synthetic pesticides, herbicides, or artificial fertilizers. We rely entirely on natural pest control and organic compost.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-secondary/20 rounded-full flex items-center justify-center text-2xl mb-6">
              🔬
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-3">Rigorous Lab Testing</h3>
            <p className="text-brand-primary/70 text-sm leading-relaxed">
              Trust, but verify. Every harvest batch undergoes comprehensive third-party laboratory testing to screen for heavy metals and pesticide residue before it ever reaches our packaging facility.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-2xl mb-6">
              🤝
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-3">Fair-Trade Assured</h3>
            <p className="text-brand-primary/70 text-sm leading-relaxed">
              By removing the traditional mandi (wholesale market) intermediaries, we pay our farmers a premium above the market rate, ensuring sustainable livelihoods and community growth.
            </p>
          </div>
        </div>

        {/* Image / Stats Section */}
        <div className="rounded-3xl bg-brand-primary text-brand-canvas p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Soil Health is Human Health.</h2>
            <p className="opacity-80 leading-relaxed">
              We believe that the nutritional density of your food is a direct reflection of the soil it was grown in. That's why we mandate crop rotation and natural nitrogen fixation techniques across all KhetSe partner acres. 
            </p>
            <ul className="space-y-3 opacity-90 font-medium">
              <li className="flex items-center gap-3"><span className="text-brand-accent">✓</span> 100% Non-GMO Seeds</li>
              <li className="flex items-center gap-3"><span className="text-brand-accent">✓</span> Rain-fed & Sustainable Irrigation</li>
              <li className="flex items-center gap-3"><span className="text-brand-accent">✓</span> Hand-harvested & Sun-dried</li>
            </ul>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl aspect-square flex items-center justify-center text-4xl">🌾</div>
            <div className="bg-white/10 rounded-xl aspect-square flex items-center justify-center text-4xl mt-8">🚜</div>
          </div>
        </div>

      </div>
    </div>
  );
}
