"use client";

import React, { useEffect, useState } from "react";
import type { Tables } from "@/types/database.types";
import { useSelectionStore } from "@/store/selectionStore";

type Product = Tables<"products">;

export default function SelectProductButton({ product }: { product: Product }) {
  const { isSelected, toggleSelection } = useSelectionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = mounted ? isSelected(product.id) : false;

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevents clicking the button from navigating to the product detail page if nested
        toggleSelection(product);
      }}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center min-w-[120px] ${
        selected
          ? "bg-brand-green/20 text-success border border-brand-green/30 hover:bg-brand-green/30"
          : "bg-brand-primary text-brand-canvas hover:bg-brand-primary/90"
      }`}
    >
      {selected ? "✓ Added" : "Add to Order"}
    </button>
  );
}
