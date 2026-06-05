/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Cart Store (Zustand)                                               │
 * │  File: store/cartStore.ts                                                    │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Global client-side shopping cart state using Zustand with localStorage     │
 * │  persistence. This is the single source of truth for the cart across the    │
 * │  entire application — Navbar badge, CartDrawer, CheckoutClient all read     │
 * │  from this store.                                                            │
 * │                                                                              │
 * │  WHY ZUSTAND?                                                                │
 * │  Zustand is a minimal state management library (~1kb). Unlike Redux, it      │
 * │  does not require a Provider wrapper component and works outside of React.   │
 * │  The `persist` middleware handles localStorage serialization automatically.  │
 * │                                                                              │
 * │  HYDRATION GUARD PATTERN:                                                    │
 * │  Components that read from this store (Navbar, CartDrawer) MUST implement   │
 * │  a "mounted" guard to prevent hydration mismatches. The pattern is:          │
 * │                                                                              │
 * │    const [mounted, setMounted] = useState(false);                            │
 * │    useEffect(() => { setMounted(true); }, []);                               │
 * │    if (!mounted) return null; // or return <Skeleton />                      │
 * │                                                                              │
 * │  This is required because the server renders the initial HTML with an empty  │
 * │  cart (localStorage is unavailable server-side). Zustand then loads the     │
 * │  persisted state on the client. Without the guard, React will show a        │
 * │  hydration mismatch error.                                                   │
 * │                                                                              │
 * │  PERSISTENCE:                                                                │
 * │  Only `items` are persisted via the `partialize` option. UI state like       │
 * │  `isDrawerOpen` is intentionally excluded (resets to false on page refresh). │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tables } from "@/types/database.types";

type Product = Tables<"products">;

/**
 * CartItem — a product in the cart with its associated quantity.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * CartState — the full shape of the cart store (state + actions).
 * Zustand stores combine state and actions in a single object.
 */
interface CartState {
  /** The list of items currently in the cart. */
  items: CartItem[];
  /** Whether the cart side-drawer is currently open. */
  isDrawerOpen: boolean;

  /**
   * addItem — adds a product to the cart or increases its quantity if already present.
   * Also opens the cart drawer to provide immediate visual feedback.
   * @param product  - The full product object to add.
   * @param quantity - Number of units to add (defaults to 1).
   */
  addItem: (product: Product, quantity?: number) => void;

  /**
   * removeItem — completely removes a product from the cart.
   * @param productId - The UUID of the product to remove.
   */
  removeItem: (productId: string) => void;

  /**
   * updateQuantity — sets the quantity of a specific cart item.
   * If the quantity is set to 0 or less, the item is removed entirely.
   * @param productId - The UUID of the product to update.
   * @param quantity  - The new quantity.
   */
  updateQuantity: (productId: string, quantity: number) => void;

  /** clearCart — empties the cart. Called after a successful order is placed. */
  clearCart: () => void;

  /**
   * toggleDrawer — opens or closes the cart side-drawer.
   * @param isOpen - If provided, forces the drawer to that state.
   *                 If omitted, toggles the current state.
   */
  toggleDrawer: (isOpen?: boolean) => void;

  /**
   * getCartTotal — computes the sum of (price × quantity) for all items.
   * Returns a number in Indian Rupees (₹). Used by CartDrawer and CheckoutClient.
   */
  getCartTotal: () => number;

  /**
   * getItemCount — computes the total number of individual product units in the cart.
   * Used by the Navbar badge (e.g., shows "3" if you have 2×Rice + 1×Dal).
   */
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            // Item already in cart — increment its quantity.
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems, isDrawerOpen: true };
          } else {
            // New item — append to the cart list.
            return {
              items: [...state.items, { product, quantity }],
              isDrawerOpen: true,
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Treat zero/negative quantity as a remove.
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleDrawer: (isOpen) => {
        set((state) => ({
          isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen,
        }));
      },

      getCartTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.product.base_price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      // Key used to store the cart in localStorage.
      name: "khetse-cart-storage",
      // Only persist `items` — drawer open state should reset on page reload.
      partialize: (state) => ({ items: state.items }),
    }
  )
);
