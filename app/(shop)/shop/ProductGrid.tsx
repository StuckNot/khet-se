/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Product Grid Component                                             │
 * │  File: app/(shop)/shop/ProductGrid.tsx                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Client component that renders a grid of products with category filtering,   │
 * │  search, and sorting capabilities.                                           │
 * │  Expects the full list of products passed as props from a Server Component.  │
 * │                                                                              │
 * │  DYNAMIC CATEGORIES:                                                         │
 * │  Category tabs are generated dynamically based on the unique categories      │
 * │  present in the fetched products.                                            │
 * │                                                                              │
 * │  CLIENT-SIDE FILTERING:                                                      │
 * │  All search and sort operations happen purely on the client side without     │
 * │  requiring additional Supabase queries.                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use client";

import React, { useState, useMemo } from "react";
import type { Tables } from "@/types/database.types";
import ProductCard from "../../components/ProductCard";
import { categoryLabels } from "@/app/lib/categoryLabels";

type Product = Tables<"products">;

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");

  // Dynamically derive unique categories from the product list
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map((p) => p.category)));
    const dynamicCategories = uniqueCats.map((cat) => ({
      id: cat,
      label: categoryLabels[cat] || cat,
    }));
    // Always prepend the "All" option
    return [{ id: "all", label: "All Harvests" }, ...dynamicCategories];
  }, [products]);

  // Apply filters and sorting client-side
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // 1. Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 2. Filter by search query (name and description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.base_price - a.base_price);
    }
    // 'default' respects the original order from the server (created_at desc)

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Filter Controls Bar */}
      
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 text-brand-secondary absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rice, dal, khapli atta, turmeric..."
            className="w-full bg-brand-canvas border border-brand-secondary/20 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-brand-primary placeholder-brand-secondary/60 focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-brand-secondary">
          <SlidersHorizontalIcon className="w-3.5 h-3.5 text-brand-green" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-brand-beige border border-brand-secondary/20 rounded-lg px-2.5 py-1.5 text-xs text-brand-primary font-medium focus:outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-brand-accent text-white shadow-sm"
                : "bg-brand-beige text-brand-primary hover:bg-brand-beige/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Count & Freshness Banner */}
      <div className="flex items-center justify-between text-xs text-brand-secondary pt-2">
        <span>Showing {filteredAndSortedProducts.length} organic staple items</span>
        <span className="flex items-center gap-1 text-success font-medium">
          <ShieldCheckIcon className="w-3.5 h-3.5" /> 100% Unpolished &amp; NABL Lab Certified
        </span>
      </div>

      {/* Product Cards Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pt-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-brand-beige/40 rounded-2xl p-12 text-center space-y-3 mt-4 border border-brand-secondary/10">
          <p className="font-display text-xl text-brand-primary">No harvest matches your search</p>
          <p className="text-xs text-brand-secondary">Try searching for rice, toor dal, khapli atta, or turmeric.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="bg-brand-accent hover:bg-brand-accent/85 text-white text-xs px-4 py-2 rounded-xl font-medium mt-2 transition-colors inline-block"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// --- Icons ---
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const SlidersHorizontalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
