"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            💬 Student Stories
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
            What Students Are Saying
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Join 50,000+ students who found their dream PG through StayNest
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`card-premium p-6 cursor-pointer transition-all ${active === i ? "ring-2 ring-blue-300" : ""}`}
              onClick={() => setActive(i)}
            >
              {/* Quote */}
              <Quote className="w-8 h-8 text-blue-100 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-slate-100"
        >
          {[
            { label: "Average Rating", value: "4.8/5", note: "from 12K+ reviews" },
            { label: "Students Helped", value: "50,000+", note: "across India" },
            { label: "PG Owners", value: "3,200+", note: "verified & trusted" },
            { label: "Cities Covered", value: "80+", note: "and growing" },
          ].map(({ label, value, note }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-2xl text-blue-600">{value}</div>
              <div className="text-sm font-semibold text-slate-700 mt-0.5">{label}</div>
              <div className="text-xs text-slate-400">{note}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
