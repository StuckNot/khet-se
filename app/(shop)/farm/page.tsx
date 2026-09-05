import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Farm",
  description: "The Soil & Farmer Collective. Meet the custodians who nurture ancient heritage seeds with cow-based Jeevamrit and traditional wisdom.",
};

const agroZones = [
  {
    name: "Western Ghats (Maval Valley)",
    soil: "Rich volcanic black basalt soil with high carbon",
    crops: "Indrayani Fragrant Rice, Nachni (Ragi)",
    rainfall: "Heavy monsoon runoff from Sahyadri ranges",
  },
  {
    name: "Marathwada & Solapur Plains",
    soil: "Deep moisture-retentive black cotton soil (Regur)",
    crops: "Ancient Khapli (Emmer) Wheat, Desi Toor Dal",
    rainfall: "Semi-arid sunshine ideal for natural grain drying",
  },
  {
    name: "Jaintia Hills, Meghalaya",
    soil: "Iron & mineral-rich red hill slopes",
    crops: "High-Curcumin Lakadong Turmeric, Bird’s Eye Chilli",
    rainfall: "Sub-tropical rain clouds cultivating high natural essential oils",
  },
  {
    name: "Nimar Plains, Madhya Pradesh",
    soil: "Alluvial Narmada river basin loam",
    crops: "Native Desi Chana, Bansi Wheat",
    rainfall: "Temperate river-fed fertile soil",
  },
];

export default function TheFarmPage() {
  return (
    <div className="py-12 sm:py-20 bg-brand-canvas space-y-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-green/20 text-success px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">
            <SproutIcon className="w-4 h-4" />
            Trusted Farmer Families
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-primary tracking-tight leading-[1.12]">
            The Soil & Farmer Collective
          </h1>
          <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            We do not buy from anonymous brokers. Meet the custodians who nurture ancient heritage seeds with cow-based Jeevamrit and traditional wisdom.
          </p>
        </div>

        {/* Agro-Climatic Zones of India */}
        <div className="bg-brand-beige/70 rounded-3xl p-8 sm:p-14 border border-brand-secondary/15 text-left space-y-8 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-success uppercase tracking-wider">
              Geographical Provenance
            </span>
            <h3 className="font-display text-3xl text-brand-primary">
              Where We Grow: Soil & Climate Zones
            </h3>
            <p className="text-xs sm:text-sm text-brand-secondary">
              Different crops demand specific regional soils to develop their full nutritional density and aroma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {agroZones.map((zone, idx) => (
              <div key={idx} className="bg-brand-canvas p-6 rounded-2xl border border-brand-secondary/15 space-y-2 shadow-sm hover:border-brand-green/40 transition-colors">
                <h4 className="font-display text-lg text-brand-primary">{zone.name}</h4>
                <p className="text-xs text-brand-secondary"><strong>Soil Type:</strong> {zone.soil}</p>
                <p className="text-xs text-brand-primary"><strong>Primary Harvests:</strong> {zone.crops}</p>
                <p className="text-[11px] text-success font-medium"><strong>Climate:</strong> {zone.rainfall}</p>
              </div>
            ))}
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
