"use client";

/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │  KhetSe — Admin Error Boundary                                               │
 * │  File: app/admin/error.tsx                                                   │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Error boundary for the admin dashboard route group. Shows a branded error  │
 * │  screen when an admin page crashes (e.g. DB query failure).                  │
 * │                                                                              │
 * │  Separate from the shop error boundary so admin errors can show different   │
 * │  messaging and navigation options appropriate for internal tools.            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center p-10">
      <div className="max-w-md text-center">
        <span className="text-5xl mb-6 block">⚠️</span>
        <h2 className="text-2xl font-bold text-brand-primary mb-3">
          Admin Panel Error
        </h2>
        <p className="text-brand-primary/60 mb-2 text-sm">
          An error occurred while loading this admin page.
        </p>
        {error.message && (
          <p className="mb-6 rounded-md bg-red-50 p-3 text-xs font-mono text-red-700 text-left border border-red-200">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90"
          >
            Retry
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-brand-primary/20 px-5 py-2.5 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary/5"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
