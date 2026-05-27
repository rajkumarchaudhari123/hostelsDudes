"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setLoading(false);
        setError("Invalid email or password.");
        return;
      }

      // Dynamically fetch the authenticated role from session API instead of hardcoded prefix checks!
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userRole = session?.user?.role;

      let redirectPath = "/dashboard";
      if (userRole === "SUPER_ADMIN") {
        redirectPath = "/admin";
      } else if (userRole === "PG_OWNER") {
        redirectPath = "/owner";
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred during sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <Link href="/" className="flex items-center gap-3 justify-center mb-12">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-3xl text-white">Hostel Dudes</span>
          </Link>

          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Welcome back to<br />your student hub
          </h2>
          <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
            12,000+ verified PGs across India. Find, compare, and book your perfect stay near college.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[
              { value: "12K+", label: "Verified PGs" },
              { value: "50K+", label: "Students" },
              { value: "4.8★", label: "Avg Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="font-display font-bold text-xl text-white">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">Hostel Dudes</span>
          </Link>

          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Sign In</h1>
          <p className="text-slate-500 mb-8">Welcome back! Enter your credentials to continue.</p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-6 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
              <path fill="#FBBC05" d="M11.68 28.18A13.13 13.13 0 0 1 11 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A22.01 22.01 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z" />
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-premium pl-11"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-premium pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">🔑 Demo Credentials</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p>Super Admin: admin@hostelsdudes.in / Hostel@123</p>
              <p>PG Owner: owner@hostelsdudes.in / Hostel@123</p>
              <p>Student: student@hostelsdudes.in / Hostel@123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
