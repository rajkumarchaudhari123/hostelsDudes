"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-12">
      <div className="text-center px-4 max-w-md mx-auto bg-white rounded-3xl p-8 shadow-card border border-slate-100">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="font-display font-bold text-2xl text-slate-900 mb-2">
          An error occurred
        </h1>
        <p className="text-slate-500 mb-6 text-sm">
          Something went wrong while rendering this page. You can try reloading or heading back home.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Try Again
          </button>
          <Link href="/" className="btn-secondary text-sm px-5 py-2.5">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
