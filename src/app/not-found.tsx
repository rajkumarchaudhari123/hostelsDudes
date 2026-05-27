import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <div className="text-9xl font-display font-black text-slate-100 select-none mb-4">404</div>
          <div className="text-6xl mb-6">🏠</div>
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-3">Page Not Found</h1>
          <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">
            Looks like this PG moved out! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/search" className="btn-secondary">
              Find PGs
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
