import React from "react";
import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-brand-canvas py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-semibold uppercase tracking-widest">
            Genesis
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-primary mb-6 tracking-tight">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-brand-primary/70 leading-relaxed">
            We started KhetSe because we were tired of the opaque, chemical-heavy food supply chain. We wanted to know exactly what was on our plates.
          </p>
        </div>

        {/* Content Section */}
        <article className="prose prose-lg prose-brand max-w-none text-brand-primary/80 space-y-10">
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-brand-primary">The Disconnect</h2>
              <p>
                A few years ago, we realized a disturbing truth: the staples sitting in our pantries—the rice, the wheat, the lentils—had traveled through countless middlemen, sitting in warehouses for months, often treated with preservatives just to survive the journey. The connection between the farmer who grew the food and the family who ate it was completely broken.
              </p>
            </div>
            <div className="flex-1 w-full aspect-square rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center">
              <span className="text-6xl opacity-50">🏭</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-brand-primary">The Farm-to-Pantry Vision</h2>
              <p>
                We asked ourselves: What if we could bypass the industrial complex entirely? What if we could source 100% organic, lab-tested staples straight from the harvest and deliver them directly to your door in under 48 hours? That question birthed KhetSe.
              </p>
              <p>
                We spent months traveling to rural farmlands, sitting with farmers, understanding their struggles with unpredictable market prices, and vetting their soil quality. 
              </p>
            </div>
            <div className="flex-1 w-full aspect-square rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center">
              <span className="text-6xl opacity-50">🌱</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-brand-primary/10 text-center mt-16">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Our Commitment</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Today, KhetSe is more than an e-commerce platform. It is a promise of transparency, a commitment to your health, and a fair-trade handshake with the farmers who sustain us.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center rounded-lg bg-brand-secondary px-8 py-4 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90"
            >
              Explore Our Harvest
            </Link>
          </div>

        </article>

      </div>
    </div>
  );
}
