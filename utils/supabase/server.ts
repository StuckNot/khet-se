/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Supabase Server Client Factory                                     │
 * │  File: utils/supabase/server.ts                                              │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Creates a type-safe Supabase client for use in:                             │
 * │  - Server Components (RSC) that need to fetch data.                          │
 * │  - Server Actions ("use server") that need to write data.                    │
 * │  - API Route Handlers (route.ts) in app/api/.                               │
 * │                                                                              │
 * │  HOW IT WORKS:                                                               │
 * │  Uses @supabase/ssr's `createServerClient` which reads and writes auth       │
 * │  tokens from/to httpOnly cookies instead of localStorage.                    │
 * │  - httpOnly cookies cannot be read by JavaScript, making them immune to XSS. │
 * │  - The cookie middleware (middleware.ts) refreshes the session on each       │
 * │    request so the JWT stays fresh.                                           │
 * │                                                                              │
 * │  IMPORTANT: DO NOT use the browser client (utils/supabase/client.ts) in     │
 * │  Server Components or Server Actions — it uses localStorage which is         │
 * │  unavailable on the server.                                                  │
 * │                                                                              │
 * │  GENERIC TYPE:                                                               │
 * │  The `<Database>` generic gives us full type inference on all Supabase       │
 * │  queries (tables, columns, return types). The `Database` type is generated  │
 * │  from the schema by: `npx supabase gen types typescript --local > types.ts` │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * createClient — creates a Supabase client bound to the current request's cookies.
 *
 * Must be called as `await createClient()` because `cookies()` from Next.js 15+
 * is an async API. Always create a fresh client per request — do not cache it.
 *
 * @returns A typed Supabase client instance.
 *
 * @example
 * // In a Server Component:
 * const supabase = await createClient();
 * const { data } = await supabase.from("products").select("*");
 *
 * @example
 * // In a Server Action:
 * "use server";
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * getAll — reads all cookies from the incoming request.
         * Required by @supabase/ssr to find the auth session cookie.
         */
        getAll() {
          return cookieStore.getAll();
        },
        /**
         * setAll — writes cookies to the outgoing response.
         * Used by the auth client to persist refreshed tokens.
         *
         * The try/catch is intentional: when this function is called from
         * a Server Component (not a Server Action), Next.js will throw because
         * you cannot set cookies in a render function. This is expected
         * behavior — the middleware handles the actual refresh.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    }
  );
}
