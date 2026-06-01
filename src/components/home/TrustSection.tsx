"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck, Users, HeartHandshake, BadgeCheck,
  Star, Lock, Zap, Clock
} from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    gradient: "from-blue-500 to-cyan-500",
    glow: "rgba(59,130,246,0.25)",
    title: "Verified Listings Only",
    desc: "Every PG on Hostel Dudes is physically inspected by our team before going live. No fake listings, no misleading photos.",
    stat: "100%",
    statLabel: "Listings Verified",
  },
  {
    icon: HeartHandshake,
    gradient: "from-purple-500 to-pink-500",
    glow: "rgba(168,85,247,0.25)",
    title: "Student-First Approach",
    desc: "We're built by students, for students. We understand your budget, safety needs, and college proximity requirements.",
    stat: "0",
    statLabel: "Brokerage Fees",
  },
  {
    icon: BadgeCheck,
    gradient: "from-green-500 to-teal-500",
    glow: "rgba(34,197,94,0.25)",
    title: "Transparent Pricing",
    desc: "What you see is what you pay. No hidden charges, no last-minute surprises. Rent, deposit, and facilities — all upfront.",
    stat: "₹100",
    statLabel: "Site Visit Only",
  },
  {
    icon: Lock,
    gradient: "from-orange-500 to-amber-500",
    glow: "rgba(249,115,22,0.25)",
    title: "Privacy & Data Safety",
    desc: "Your contact details are shared only with verified owners. We never sell your data or spam you with unwanted calls.",
    stat: "Zero",
    statLabel: "Data Selling",
  },
  {
    icon: Users,
    gradient: "from-indigo-500 to-blue-500",
    glow: "rgba(99,102,241,0.25)",
    title: "Real Human Support",
    desc: "Our support team is made of real people who respond fast. Call or WhatsApp — we're here every single day.",
    stat: "24/7",
    statLabel: "Human Support",
  },
  {
    icon: Zap,
    gradient: "from-yellow-400 to-orange-500",
    glow: "rgba(234,179,8,0.25)",
    title: "Fast & Easy Process",
    desc: "From browsing to booking — the entire process takes minutes, not days. We eliminate the friction of PG hunting.",
    stat: "Fast",
    statLabel: "Quick Response",
  },
];

const AWARDS = [
  { label: "Student Satisfaction", value: "⭐⭐⭐⭐⭐" },
  { label: "PGs in Noida", value: "Growing" },
  { label: "Same-Day Visits", value: "Available" },
  { label: "Brokerage", value: "Zero" },
];

export default function TrustSection() {
  return (
    <section
      id="why-trust-us"
      className="relative py-28 overflow-hidden bg-slate-50"
    >
      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-5 py-2 rounded-full mb-6"
          >
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">
              Why Trust Us
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            We&apos;re Not Just a
            <br />
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #2563eb, #4f46e5, #0891b2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Listing Website
            </span>
          </h2>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Hostel Dudes is your trusted companion in finding safe, affordable, and comfortable student PGs in Noida & Greater Noida.
            We stand with you from the first search to your first night in your new room.
          </p>
        </motion.div>

        {/* ── Award Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-20"
        >
          {AWARDS.map((a) => (
            <div
              key={a.label}
              className="flex flex-col items-center px-8 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-display font-extrabold text-xl text-slate-900">{a.value}</span>
              <span className="text-slate-500 text-xs mt-1 font-medium">{a.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Pillars Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {TRUST_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover glow bg */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${pillar.glow} 0%, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div className="relative z-10 mb-5">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${pillar.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Stat */}
              <div className="relative z-10 mb-1">
                <span
                  className="text-3xl font-extrabold font-display"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-from, #2563eb), var(--tw-gradient-to, #4f46e5))`,
                  }}
                >
                  {pillar.stat}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-2">{pillar.statLabel}</span>
              </div>

              <h3 className="relative z-10 font-display font-bold text-slate-900 text-lg mb-3">
                {pillar.title}
              </h3>

              <p className="relative z-10 text-slate-500 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Founders Promise Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f2a1f 100%)" }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-0">
            {/* Left: Promise text */}
            <div className="p-10 sm:p-14">
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 px-4 py-1.5 rounded-full mb-6">
                <Clock className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Our Promise to You</span>
              </div>

              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-5 leading-tight">
                If You&apos;re Not Happy,
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  We Make It Right.
                </span>
              </h3>

              <p className="text-slate-300 text-base leading-relaxed mb-8">
                If a PG you visited through us doesn&apos;t match what was shown online, we&apos;ll personally ensure the issue is resolved or arrange another visit at no extra cost.
                That&apos;s our commitment to every student.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  "Personalized attention from real humans",
                  "Every complaint actioned within 2 hours",
                  "Your ₹100 visit fee is our skin in the game too",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-200 text-sm">
                    <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Team intro */}
            <div className="p-10 sm:p-14 border-t md:border-t-0 md:border-l border-white/10">
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 px-4 py-1.5 rounded-full mb-6">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">The Team Behind HD</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4 leading-tight">
                Real Students.
                <br />Real Experience.
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Hostel Dudes was built by co-founders who personally struggled with PG hunting in Noida. We know every bad landlord trick in the book — and we protect you from all of them.
              </p>

              <div className="flex flex-col gap-4">
                {[
                  { name: "Himanshu Sharma", role: "CEO & Co-founder", avatar: "H" },
                  { name: "Harshit Singh", role: "Co-founder", avatar: "HS" },
                  { name: "Rajkumar Chaudhari", role: "CTO & Co-founder", avatar: "R" },
                ].map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}
                    >
                      {person.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{person.name}</p>
                      <p className="text-slate-400 text-xs">{person.role}</p>
                    </div>
                    <BadgeCheck className="w-4 h-4 text-blue-400 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
