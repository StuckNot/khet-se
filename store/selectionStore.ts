import { create } from "zustand";
import type { Product } from "@/app/lib/types";

interface SelectionState {
  /** The list of currently selected products. */
  selectedProducts: Product[];
  
  /** Toggles a product in or out of the selection. */
  toggleSelection: (product: Product) => void;
  
  /** Checks if a specific product is currently selected. */
  isSelected: (productId: string) => boolean;
  
  /** Clears all selected products. */
  clearSelection: () => void;
  
  /** Returns the total number of selected products. */
  getSelectedCount: () => number;
  
  /** Whether the selection side-drawer is currently open. */
  isDrawerOpen: boolean;
  
  /** Opens or closes the selection side-drawer. */
  toggleDrawer: (isOpen?: boolean) => void;
}

export const useSelectionStore = create<SelectionState>()((set, get) => ({
  selectedProducts: [],
  isDrawerOpen: false,

  toggleSelection: (product) => {
    set((state) => {
      const exists = state.selectedProducts.some((p) => p.id === product.id);
      if (exists) {
        // Remove from selection
        return {
          selectedProducts: state.selectedProducts.filter((p) => p.id !== product.id),
        };
      } else {
        // Add to selection and open drawer
        return {
          selectedProducts: [...state.selectedProducts, product],
          isDrawerOpen: true,
        };
      }
    });
  },

  isSelected: (productId) => {
    return get().selectedProducts.some((p) => p.id === productId);
  },

  clearSelection: () => {
    set({ selectedProducts: [] });
  },

  getSelectedCount: () => {
    return get().selectedProducts.length;
  },

  toggleDrawer: (isOpen) => {
    set((state) => ({
      isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen,
    }));
  },
}));
