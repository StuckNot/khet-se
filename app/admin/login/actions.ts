/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Authentication Server Actions                                      │
 * │  File: app/(shop)/login/actions.ts                                           │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Actions for the authentication flow: login and signout.              │
 * │  These run on the server — form submissions POST to Next.js, which invokes   │
 * │  these functions without an API route.                                       │
 * │                                                                              │
 * │  WHY SERVER ACTIONS FOR AUTH?                                                │
 * │  Auth actions MUST run server-side to:                                       │
 * │  1. Use the httpOnly cookie client (secure, immune to XSS).                 │
 * │  2. Call revalidatePath() to clear RSC caches after login/logout.            │
 * │  3. Redirect using next/navigation's redirect() (works in RSC context).      │
 * │                                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * login — authenticates an existing user with email + password.
 * On success: revalidates the layout cache and redirects to the homepage.
 * On failure: redirects to /admin/login with an error query parameter.
 *
 * @param formData - Expected fields: `email`, `password`.
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  // Revalidate the root layout so the Navbar re-renders with the logged-in state.
  revalidatePath("/", "layout");
  redirect("/admin");
}


/**
 * signout — logs the current user out by clearing their auth session.
 * Revalidates the root layout cache so the Navbar shows the logged-out state.
 */
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/admin/login");
}
