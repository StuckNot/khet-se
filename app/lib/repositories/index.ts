/**
 * │  Farm and Friends — Repository Factory                                                 │
 * │                                                                              │
 * │  This file is the SINGLE source of truth for which database is currently     │
 * │  driving the customer-facing read paths.                                     │
 * │                                                                              │
 * │  To migrate from Supabase to Firebase (or anything else), simply:            │
 * │  1. Write a new Provider class that implements the Repository interface.     │
 * │  2. Change the exports here to instantiate and return your new Provider.     │
 * │  3. Done — zero page code changes needed.                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { ProductFirebaseProvider } from "../providers/firebase/product.firebase";
import { TestimonialFirebaseProvider } from "../providers/firebase/testimonial.firebase";
import { ProductRepository } from "./product.repository";
import { TestimonialRepository } from "./testimonial.repository";

// ═══════════════════════════════════════════════════
// Singleton Provider Instances
// ═══════════════════════════════════════════════════
const productRepoInstance = new ProductFirebaseProvider();
const testimonialRepoInstance = new TestimonialFirebaseProvider();

/**
 * Returns the active ProductRepository implementation.
 * Currently backed by Firebase. To swap providers, change this function.
 */
export function getProductRepo(): ProductRepository {
  return productRepoInstance;
}

/**
 * Returns the active TestimonialRepository implementation.
 * Currently backed by Firebase. To swap providers, change this function.
 */
export function getTestimonialRepo(): TestimonialRepository {
  return testimonialRepoInstance;
}
