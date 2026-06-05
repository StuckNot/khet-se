/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Authentication Server Actions                                      │
 * │  File: app/(shop)/login/actions.ts                                           │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Server Actions for the authentication flow: login, signup, and signout.     │
 * │  These run on the server — form submissions POST to Next.js, which invokes   │
 * │  these functions without an API route.                                       │
 * │                                                                              │
 * │  WHY SERVER ACTIONS FOR AUTH?                                                │
 * │  Auth actions MUST run server-side to:                                       │
 * │  1. Use the httpOnly cookie client (secure, immune to XSS).                 │
 * │  2. Call revalidatePath() to clear RSC caches after login/logout.            │
 * │  3. Redirect using next/navigation's redirect() (works in RSC context).      │
 * │                                                                              │
 * │  TRIGGER DEPENDENCY:                                                         │
 * │  The `signup` action passes `first_name` and `phone` inside                  │
 * │  `options.data` (raw_user_meta_data). The backend trigger                    │
 * │  `handle_new_user()` (migration 20260429100749_security_and_triggers.sql)    │
 * │  reads these fields to auto-create the profile row. If you change the        │
 * │  field names here, you MUST update the trigger too.                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * login — authenticates an existing user with email + password.
 * On success: revalidates the layout cache and redirects to the homepage.
 * On failure: redirects to /login with an error query parameter.
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
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Revalidate the root layout so the Navbar re-renders with the logged-in state.
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * signup — registers a new user with email, password, first_name, and phone.
 *
 * On success: Supabase sends a confirmation email (if email verification is enabled),
 *             the app redirects to the homepage.
 * On failure: redirects to /login with an error query parameter.
 *
 * IMPORTANT: first_name and phone are passed in `options.data` (raw_user_meta_data).
 * The backend trigger `handle_new_user()` reads these to create the profile row.
 * If email/phone verification is enabled in Supabase Auth settings, the user will
 * need to verify before they can log in.
 *
 * @param formData - Expected fields: `email`, `password`, `firstName`, `phone`.
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const phone = formData.get("phone") as string;

  // Basic validation before calling Supabase to give better error messages.
  if (!firstName || !phone) {
    redirect(`/login?error=${encodeURIComponent("First Name and Phone are required to create an account.")}`);
  }

  /**
   * IMPORTANT — Trigger dependency:
   * The backend trigger `handle_new_user` reads:
   *   raw_user_meta_data->>'first_name'
   *   raw_user_meta_data->>'phone'
   * to populate the profiles table. If these keys change, the trigger breaks.
   */
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        phone: phone,
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * signout — logs the current user out by clearing their auth session.
 * Revalidates the root layout cache so the Navbar shows the logged-out state.
 */
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
