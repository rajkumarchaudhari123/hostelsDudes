"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Student CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">
                Find Your Perfect PG Today
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-xs">
                Browse 12,000+ verified PGs near top colleges. Compare prices, amenities, and book instantly.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg"
              >
                Start Searching
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Owner CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">
                List Your PG & Grow Fast
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xs">
                Reach thousands of students looking for PGs near their colleges. Get bookings, manage inquiries, all in one dashboard.
              </p>
              <Link
                href="/owner/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-900/50"
              >
                List Your PG Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
