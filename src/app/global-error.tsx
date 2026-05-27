"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            An unexpected error occurred. Our team has been notified.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="btn-primary"
            >
              Try Again
            </button>
            <Link href="/" className="btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
