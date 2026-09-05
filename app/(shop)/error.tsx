"use client";

/**
 * ┌──────────────────────────────────────────────────────────────────────────────â”
 * │  KhetSe — Shop Error Boundary                                                │
 * │  File: app/(shop)/error.tsx                                                  │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │                                                                              │
 * │  PURPOSE:                                                                    │
 * │  Next.js App Router automatically wraps page content in a React Error        │
 * │  Boundary. When an unhandled error is thrown during rendering (e.g. a DB     │
 * │  query fails, a null dereference, etc.), this component is rendered instead  │
 * │  of the white screen of death.                                               │
 * │                                                                              │
 * │  MUST BE "use client":                                                       │
 * │  Error boundaries in React must be class components or use the               │
 * │  `"use client"` directive. Next.js enforces this for error.tsx files.        │
 * │                                                                              │
 * │  PROPS:                                                                      │
 * │  - error: The Error object that was thrown.                                  │
 * │  - reset: A function to re-attempt rendering the failed segment.             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ShopError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for server-side observability (e.g., Sentry in the future).
    console.error("[ShopError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-canvas flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">🌿</span>
        <h2 className="text-2xl font-bold text-brand-primary mb-3">
          Something went wrong
        </h2>
        <p className="text-brand-primary/60 mb-8">
          Our fields hit an unexpected bump. Please try refreshing — if the
          problem persists, come back a little later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-brand-secondary px-6 py-3 text-sm font-bold text-brand-canvas transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border-2 border-brand-primary px-6 py-3 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-canvas"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
