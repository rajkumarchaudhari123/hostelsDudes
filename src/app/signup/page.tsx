"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Building2, Mail, Lock, User, Phone, ArrowRight, Loader2, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "PG_OWNER">("STUDENT");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center">
          <Link href="/" className="flex items-center gap-3 justify-center mb-12">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-3xl text-white">Hostel Dudes</span>
          </Link>
          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Your perfect PG<br />is one step away
          </h2>
          <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
            Join 50,000+ students who found safe, affordable PGs near their colleges with Hostel Dudes.
          </p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {["Free to search & compare", "Verified & trusted listings", "Direct owner contact", "Book & schedule visits"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-6"
        >
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">Hostel Dudes</span>
          </Link>

          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 mb-8">Free forever. No credit card required.</p>

          {/* Role selector */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setRole("STUDENT")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === "STUDENT" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <GraduationCap className={`w-5 h-5 ${role === "STUDENT" ? "text-blue-600" : "text-slate-400"}`} />
              <div className="text-left">
                <p className={`text-sm font-bold ${role === "STUDENT" ? "text-blue-700" : "text-slate-700"}`}>Student</p>
                <p className="text-xs text-slate-400">Find PGs near college</p>
              </div>
            </button>
            <button
              onClick={() => setRole("PG_OWNER")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${role === "PG_OWNER" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <Building2 className={`w-5 h-5 ${role === "PG_OWNER" ? "text-indigo-600" : "text-slate-400"}`} />
              <div className="text-left">
                <p className={`text-sm font-bold ${role === "PG_OWNER" ? "text-indigo-700" : "text-slate-700"}`}>PG Owner</p>
                <p className="text-xs text-slate-400">List your PG</p>
              </div>
            </button>
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-6 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
              <path fill="#FBBC05" d="M11.68 28.18A13.13 13.13 0 0 1 11 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A22.01 22.01 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z" />
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or fill in details</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Your full name" required className="input-premium pl-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" placeholder="you@example.com" required className="input-premium pl-11" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" placeholder="+91 XXXXX XXXXX" className="input-premium pl-11" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" required className="input-premium pl-11 pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
