# Admin & Auth Migration (Deferred)

## Overview
During the initial Liskov Substitution Principle (LSP) / Repository Pattern migration, the **Admin Portal** and **Authentication** modules were intentionally left untouched. 

Currently, all customer-facing read pages (Homepage, Shop, Product Details, Trial Kits) successfully use the decoupled `Repository` pattern. However, the admin dashboard and auth flows still query Supabase directly.

## Why was this deferred?
We are currently building the MVP / informational version of Farm and Friends. The full e-commerce capabilities (cart checkout, order management, user accounts, and admin actions) are not required for this phase. 

Because the final authentication strategy and database provider for the full e-commerce version haven't been finalized yet, migrating these complex write-heavy modules now would be premature.

## Next Steps
This technical debt is known and accepted. 

When Farm and Friends transitions to the **Live E-Commerce Version**, the following modules must be migrated to the Repository Pattern:
1. `app/admin/login/*` (Authentication flows)
2. `app/admin/(protected)/*` (Order and inventory management)
3. Any future customer-facing write actions (e.g. Shopping Cart, Checkout, User Profiles).

Until then, the admin and auth directories are safely isolated from the rest of the application's architecture.
