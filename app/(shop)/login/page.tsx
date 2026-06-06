/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Login / Registration Page                                         │
 * │  File: app/(shop)/login/page.tsx                                            │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Unified auth form. Updated to collect required Profile fields (Name, Phone)  │
 * │  to satisfy backend database constraints without modifying the schema.       │
 * │                                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import Link from "next/link";
import { login, signup } from "./actions";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-brand-canvas px-4 py-16">
      <div className="w-full max-w-md">
        {/* ─── Header ─── */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block font-display text-3xl font-bold tracking-tight text-brand-primary mb-2"
          >
            KhetSe
          </Link>
          <p className="text-brand-primary/50 text-sm">
            Join the farm-to-table movement.
          </p>
        </div>

        {/* ─── Card ─── */}
        <div className="rounded-xl border border-brand-primary/10 bg-brand-canvas p-8 shadow-sm">
          {/* ─── Error Banner ─── */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium">Authentication Error</p>
              <p className="mt-0.5 opacity-80">{error}</p>
            </div>
          )}

          {/* ─── Form ─── */}
          <form className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-brand-primary">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-brand-primary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
              />
            </div>

            {/* Registration-only fields (grouped for visual distinction) */}
            <div className="pt-2 flex flex-col gap-5 border-t border-brand-primary/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">
                Required for New Accounts
              </p>
              
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-brand-primary">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Arjun"
                  className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-brand-primary">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-brand-primary/20 bg-brand-canvas px-4 py-3 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                />
              </div>
            </div>

            {/* ─── Actions ─── */}
            <div className="mt-2 flex flex-col gap-3">
              <button
                formAction={login}
                className="w-full rounded-lg bg-brand-primary py-3 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              >
                Log In
              </button>

              <button
                formAction={signup}
                className="w-full rounded-lg border-2 border-brand-secondary py-3 text-sm font-bold text-brand-secondary transition-colors hover:bg-brand-secondary hover:text-brand-canvas focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* ─── Footer ─── */}
          <p className="mt-6 text-center text-xs text-brand-primary/40">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand-primary/70">
              Terms of Service
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-brand-primary/50 hover:text-brand-primary transition-colors">
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
