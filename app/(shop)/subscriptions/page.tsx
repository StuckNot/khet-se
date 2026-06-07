import React from "react";
import Link from "next/link";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-brand-canvas py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-widest">
            Set It & Forget It
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-primary mb-6 tracking-tight">
            The Auto-Pilot Pantry
          </h1>
          <p className="text-lg md:text-xl text-brand-primary/70 max-w-2xl mx-auto leading-relaxed">
            Never run out of your essential organic staples. Choose a plan, select your box, and let us handle the logistics directly from the farm to your door.
          </p>
        </div>

        {/* Why Subscribe? */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-brand-primary">Why Subscribe?</h2>
            <p className="text-brand-primary/80 leading-relaxed">
              When you subscribe, you aren't just saving time—you are fundamentally changing how agriculture works. Subscriptions allow our farmers to predict demand accurately, resulting in <strong>zero food waste</strong> and stable incomes.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-xl mt-0.5">⏱️</span>
                <div>
                  <h4 className="font-bold text-brand-primary">Save Mental Energy</h4>
                  <p className="text-sm text-brand-primary/70">No more last-minute grocery runs for rice or dal.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-xl mt-0.5">💰</span>
                <div>
                  <h4 className="font-bold text-brand-primary">Lock-in Prices</h4>
                  <p className="text-sm text-brand-primary/70">Shield yourself from market inflation. Your subscription price stays fixed.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-xl mt-0.5">⏸️</span>
                <div>
                  <h4 className="font-bold text-brand-primary">Ultimate Flexibility</h4>
                  <p className="text-sm text-brand-primary/70">Going on vacation? Pause or cancel anytime right from your dashboard.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-brand-primary rounded-3xl p-8 text-brand-canvas shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
             <div className="border border-white/20 rounded-2xl p-6 bg-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-sm opacity-60">Order #KHT-AUTO</span>
                  <span className="bg-brand-green/20 text-brand-green text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Active</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Monthly Organic Staples</h3>
                <p className="text-sm opacity-70 mb-6">Delivering every 30 days</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <span>Sona Masoori Rice (5kg)</span>
                    <span className="font-bold">✓</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <span>Toor Dal (1kg)</span>
                    <span className="font-bold">✓</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <span>Cold-Pressed Mustard Oil</span>
                    <span className="font-bold">✓</span>
                  </div>
                </div>
                
                <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-lg py-3 text-sm font-bold">
                  Manage Delivery
                </button>
             </div>
          </div>
        </div>

        {/* Pricing/Plans CTA */}
        <div className="text-center bg-white rounded-3xl p-10 md:p-16 border border-brand-primary/10 shadow-sm">
          <h2 className="font-display text-3xl font-bold text-brand-primary mb-4">Ready to start?</h2>
          <p className="text-brand-primary/70 max-w-xl mx-auto mb-8">
            Choose from our pre-curated Trial Kits. Try it once, or set it to auto-renew weekly, bi-weekly, or monthly.
          </p>
          <Link 
            href="/trial-kits" 
            className="inline-flex items-center justify-center rounded-lg bg-brand-secondary px-8 py-4 text-sm font-bold text-brand-canvas transition-all hover:shadow-lg hover:scale-105"
          >
            Build Your Trial Kit
          </Link>
        </div>

      </div>
    </div>
  );
}
