/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — Supabase Product Provider                                          │
 * │  File: app/lib/providers/supabase/product.supabase.ts                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Implements the ProductRepository interface using Supabase as the            │
 * │  data source. All Supabase-specific query logic is isolated here.            │
 * │                                                                              │
 * │  SWAPPING PROVIDERS:                                                         │
 * │  To switch to Firebase or JSON, create a new file (e.g.,                     │
 * │  product.firebase.ts) implementing ProductRepository, then update            │
 * │  the factory in repositories/index.ts. No page code changes needed.          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { createClient } from "@/utils/supabase/server";
import type { ProductRepository } from "../../repositories/product.repository";
import type { Product } from "../../types";

export function createSupabaseProductRepo(): ProductRepository {
  return {
    async getFeaturedProducts(limit: number): Promise<Product[]> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(limit);

      if (error) {
        console.error("[ProductRepo] getFeaturedProducts error:", error.message);
        return [];
      }

      return (data as Product[]) ?? [];
    },

    async getActiveProducts(): Promise<Product[]> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[ProductRepo] getActiveProducts error:", error.message);
        return [];
      }

      return (data as Product[]) ?? [];
    },

    async getProductById(id: string): Promise<Product | null> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("[ProductRepo] getProductById error:", error.message);
        return null;
      }

      return (data as Product) ?? null;
    },

    async getKitItems(productId: string): Promise<import("../../types").ProductKitItem[]> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("product_kit_items")
        .select("*")
        .eq("kit_product_id", productId)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[ProductRepo] getKitItems error:", error.message);
        return [];
      }

      return (data as import("../../types").ProductKitItem[]) ?? [];
    },
  };
}
