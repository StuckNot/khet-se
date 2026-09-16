/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Selection / Cart Store                                             │
 * │  File: store/selectionStore.ts                                               │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  DATA MODEL:                                                                 │
 * │  The store tracks CartItem[] — each item wraps a Product with a quantity.    │
 * │  When a product has min_order_quantity > 1, toggleSelection() seeds          │
 * │  quantity with that value instead of 1 (MOQ auto-fill).                     │
 * │                                                                              │
 * │  TOGGLE SEMANTICS:                                                           │
 * │  toggleSelection() adds a product if absent, removes it if present.         │
 * │  Quantity is set once on add; edited explicitly via setQuantity().           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { create } from "zustand";
import type { Product } from "@/app/lib/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  /** Seeded from product.min_order_quantity on first add; minimum 1. */
  quantity: number;
}

interface SelectionState {
  /** The current cart items (product + quantity). */
  items: CartItem[];

  /** Toggles a product in/out of the cart. On first add, seeds quantity from MOQ. */
  toggleSelection: (product: Product) => void;

  /** Updates the quantity for a specific product. Enforces MOQ as a floor. */
  setQuantity: (productId: string, quantity: number) => void;

  /** Checks if a specific product is currently in the cart. */
  isSelected: (productId: string) => boolean;

  /** Returns the CartItem for a given product ID, or undefined. */
  getItem: (productId: string) => CartItem | undefined;

  /** Clears all items. */
  clearSelection: () => void;

  /** Returns the total number of distinct products selected. */
  getSelectedCount: () => number;

  /** Whether the selection side-drawer is currently open. */
  isDrawerOpen: boolean;

  /** Opens or closes the selection side-drawer. */
  toggleDrawer: (isOpen?: boolean) => void;
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useSelectionStore = create<SelectionState>()((set, get) => ({
  items: [],
  isDrawerOpen: false,

  toggleSelection: (product) => {
    set((state) => {
      const exists = state.items.some((item) => item.product.id === product.id);
      if (exists) {
        return {
          items: state.items.filter((item) => item.product.id !== product.id),
        };
      } else {
        // Seed quantity from MOQ (min 1)
        const moq = product.min_order_quantity ?? 1;
        const quantity = moq > 1 ? moq : 1;
        return {
          items: [...state.items, { product, quantity }],
          isDrawerOpen: true,
        };
      }
    });
  },

  setQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id !== productId) return item;
        const moq = item.product.min_order_quantity ?? 1;
        // Enforce MOQ as a floor — user can never go below it
        const safeQty = Math.max(moq > 1 ? moq : 1, quantity);
        return { ...item, quantity: safeQty };
      }),
    }));
  },

  isSelected: (productId) => {
    return get().items.some((item) => item.product.id === productId);
  },

  getItem: (productId) => {
    return get().items.find((item) => item.product.id === productId);
  },

  clearSelection: () => {
    set({ items: [] });
  },

  getSelectedCount: () => {
    return get().items.length;
  },

  toggleDrawer: (isOpen) => {
    set((state) => ({
      isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen,
    }));
  },
}));
