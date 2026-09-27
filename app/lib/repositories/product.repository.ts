/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — Product Repository Interface                                       │
 * │  File: app/lib/repositories/product.repository.ts                            │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Defines the contract for all product data access. Any data provider         │
 * │  (Supabase, Firebase, JSON) must implement this interface.                   │
 * │                                                                              │
 * │  LSP GUARANTEE:                                                              │
 * │  Any implementation of ProductRepository can replace any other               │
 * │  without breaking pages that consume it. Pages call these methods —          │
 * │  they never know which database is behind them.                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { Product } from "../types";

export interface ProductRepository {
  /**
   * Fetches a limited number of active products for featured sections.
   * Used by: Homepage (featured harvest grid).
   */
  getFeaturedProducts(limit: number): Promise<Product[]>;

  /**
   * Fetches all active products, ordered by newest first.
   * Used by: Shop All page, Trial Kits page.
   */
  getActiveProducts(): Promise<Product[]>;

  /**
   * Fetches a single product by its ID.
   * Returns null if the product does not exist.
   * Used by: Product Detail page (/shop/[id]).
   */
  getProductById(id: string): Promise<Product | null>;

  /**
   * Fetches the items included in a product kit.
   * Used by: Product Detail page (/shop/[id]) for kits.
   */
  getKitItems(productId: string): Promise<import("../types").ProductKitItem[]>;
}
