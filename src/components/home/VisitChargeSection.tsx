"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Phone, Star, Clock, Shield, CheckCircle2,
  ArrowRight, Sparkles, Zap
} from "lucide-react";

const PERKS = [
  { icon: MapPin, title: "In-Person Guided Tour", desc: "Our executive physically visits every PG with you, so you don't get cheated." },
  { icon: Shield, title: "100% Verified Quality", desc: "We verify cleanliness, safety, neighbourhood, and landlord authenticity on-site." },
  { icon: Clock, title: "Flexible Scheduling", desc: "Book a site visit any day, any time — including weekends and evenings." },
  { icon: Star, title: "Zero Hidden Charges", desc: "Pay only ₹100 for the visit. No commission, no brokerage, no surprises." },
];

const STEPS = [
  { no: "01", title: "WhatsApp Us", desc: "Message us on WhatsApp to request a site visit." },
  { no: "02", title: "Pick a Slot", desc: "We'll schedule a time that works for you — same-day available." },
  { no: "03", title: "Visit with Us", desc: "Our expert executive guides you through the PG in person." },
  { no: "04", title: "Move In Happy", desc: "You pick the PG you love with complete confidence and zero regret." },
];

export default function VisitChargeSection() {
  const waLink = "https://wa.me/918506021056?text=Hi%2C+I+want+to+book+a+PG+site+visit.+Can+I+get+info%3F";

  return (
    <section
      id="visit-charge"
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a2744 40%, #0f2a1f 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-400/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/25 px-5 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-bold text-orange-300 uppercase tracking-widest">
              Exclusive Service · Only We Offer This
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Visit Your Dream PG
            <br />
            <span className="relative inline-block mt-2">
              <span
                style={{
                  background: "linear-gradient(90deg, #fb923c, #f59e0b, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                For Just ₹100
              </span>
              {/* Underline swoosh */}
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 400 16"
                fill="none"
              >
                <path
                  d="M3 12 C 100 3, 300 3, 397 12"
                  stroke="#f97316"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="400"
                  strokeDashoffset="0"
                />
              </svg>
            </span>
          </h2>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed mt-8">
            We personally accompany you to every PG — so you see exactly what
            you&apos;re paying for, with no guesswork, no scams, and no regrets.
            <span className="text-orange-400 font-semibold"> Zero brokerage. Just ₹100.</span>
          </p>
        </motion.div>

        {/* ── Main Content Grid ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">

          {/* LEFT — Hero card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Price Badge */}
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-25 blur-lg animate-pulse" />

              <div
                className="relative rounded-3xl p-8 sm:p-10 border border-orange-400/20 overflow-hidden"
                style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)" }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-3xl pointer-events-none" />

                {/* Price display */}
                <div className="flex items-end gap-3 mb-2">
                  <span
                    className="text-7xl sm:text-8xl font-extrabold font-display"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ₹100
                  </span>
                  <div className="mb-4 text-slate-400 text-sm font-medium leading-snug">
                    per<br />visit
                  </div>
                </div>

                <h3 className="font-display font-bold text-2xl text-white mb-4">
                  PG Site Visit Charge
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  Our dedicated executive accompanies you in person, shows you around verified PGs, and ensures you only commit to a place you truly love.
                </p>

                {/* Mini checklist */}
                <ul className="space-y-3 mb-8">
                  {[
                    "Physical tour by our trained executive",
                    "On-spot verification of amenities",
                    "Zero brokerage or commission",
                    "Same-day visits available",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="w-5 h-5 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-xl"
                    style={{ background: "linear-gradient(135deg, #f97316, #d97706)" }}
                  >
                    <Phone className="w-4 h-4" />
                    Book a Visit on WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/search"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-white border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Browse PGs First
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Perks list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative rounded-2xl p-6 border border-white/8 hover:border-orange-400/30 transition-all duration-300 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-400/0 group-hover:from-orange-500/8 group-hover:to-amber-400/5 transition-all duration-500 rounded-2xl" />

                <div className="relative z-10">
                  <div className="w-11 h-11 bg-orange-500/15 border border-orange-400/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <perk.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h4 className="font-display font-bold text-white text-sm mb-2">
                    {perk.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── How it works steps ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-4"
        >
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3" /> How It Works
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Book Your ₹100 Visit in 4 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 z-0" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div
                  className="w-24 h-24 rounded-3xl flex flex-col items-center justify-center mb-5 shadow-xl"
                  style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "1px solid rgba(249,115,22,0.25)" }}
                >
                  <span
                    className="text-3xl font-extrabold font-display"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.no}
                  </span>
                </div>
                <h4 className="font-display font-bold text-white text-sm mb-2">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed max-w-[180px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-14 text-center"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95 shadow-[0_8px_40px_rgba(249,115,22,0.4)]"
              style={{ background: "linear-gradient(135deg, #f97316, #d97706, #f97316)" }}
            >
              <Phone className="w-5 h-5" />
              WhatsApp Us to Book Your Visit — Only ₹100
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-slate-500 text-xs mt-4">
              +91 85060 21056 &nbsp;·&nbsp; +91 88266 87134 &nbsp;·&nbsp; Available 7 days a week
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
