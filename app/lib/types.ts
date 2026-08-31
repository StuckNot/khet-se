/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Domain Types                                                       │
 * │  File: app/lib/types.ts                                                      │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Database-independent domain types. These define the shape of data that      │
 * │  pages and components consume. They are NOT generated from any database      │
 * │  SDK — they are owned by us and remain stable regardless of whether the      │
 * │  backend is Supabase, Firebase, or a JSON file.                              │
 * │                                                                              │
 * │  IMPORTANT:                                                                  │
 * │  If you add a new column to the database, add the corresponding field        │
 * │  here AND in the relevant provider implementation. Components should         │
 * │  only import from this file — never from database.types.ts directly.         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Product
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  stock_quantity: number;
  is_active: boolean | null;
  farmer_notes: string | null;
  image_url: string | null;
  hindi_name: string | null;
  region: string | null;
  badge: string | null;
  taste_notes: string | null;
  lab_report_id: string | null;
  created_at: string | null;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Testimonial
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_city: string | null;
  rating: number | null;
  review_text: string;
  avatar_url: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Product Kit Item
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface ProductKitItem {
  id: string;
  kit_product_id: string;
  description: string;
  sort_order: number | null;
}
