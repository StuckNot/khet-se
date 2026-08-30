/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  Farm and Friends — Supabase Testimonial Provider                                      │
 * │  File: app/lib/providers/supabase/testimonial.supabase.ts                    │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Implements the TestimonialRepository interface using Supabase as the        │
 * │  data source. All Supabase-specific query logic is isolated here.            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { createClient } from "@/utils/supabase/server";
import type { TestimonialRepository } from "../../repositories/testimonial.repository";
import type { Testimonial } from "../../types";

export function createSupabaseTestimonialRepo(): TestimonialRepository {
  return {
    async getActiveTestimonials(): Promise<Testimonial[]> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("[TestimonialRepo] getActiveTestimonials error:", error.message);
        return [];
      }

      return (data as Testimonial[]) ?? [];
    },
  };
}
