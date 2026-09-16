"use client";

import React, { useEffect, useState } from "react";
import type { Product } from "@/app/lib/types";
import { useSelectionStore } from "@/store/selectionStore";

export default function SelectProductButton({ product }: { product: Product }) {
  const { isSelected, toggleSelection, getItem } = useSelectionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = mounted ? isSelected(product.id) : false;
  const cartItem = mounted ? getItem(product.id) : undefined;

  // Show quantity in label when MOQ > 1 and item is in cart
  const qtyLabel =
    selected && cartItem && cartItem.quantity > 1
      ? ` x${cartItem.quantity}`
      : "";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleSelection(product);
      }}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center min-w-[120px] ${
        selected
          ? "bg-brand-green/20 text-success border border-brand-green/30 hover:bg-brand-green/30"
          : "bg-brand-primary text-brand-canvas hover:bg-brand-primary/90"
      }`}
    >
      {selected ? `✓ Added${qtyLabel}` : "Add to Order"}
    </button>
  );
}
