/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Testimonial Repository Interface                                   │
 * │  File: app/lib/repositories/testimonial.repository.ts                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Defines the contract for testimonial data access. Any data provider         │
 * │  (Supabase, Firebase, JSON) must implement this interface.                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import type { Testimonial } from "../types";

export interface TestimonialRepository {
  /**
   * Fetches all active testimonials, ordered by sort_order ascending.
   * Used by: Homepage (testimonials section).
   */
  getActiveTestimonials(): Promise<Testimonial[]>;
}
