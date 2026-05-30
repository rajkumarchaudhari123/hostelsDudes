"use client";

import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search by College",
    description: "Enter your college name, city, or area to find all nearby PGs with distances and prices.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-600 to-blue-500",
  },
  {
    icon: Filter,
    step: "02",
    title: "Apply Smart Filters",
    description: "Filter by budget, gender, amenities like AC, food, WiFi, parking, and more to narrow your search.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    gradient: "from-indigo-600 to-indigo-500",
  },
  {
    icon: Eye,
    step: "03",
    title: "View & Compare",
    description: "Browse verified PG listings, view photos, check amenities, read reviews, and compare prices on the map.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    gradient: "from-cyan-600 to-cyan-500",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Book & Move In",
    description: "Directly contact the owner, schedule a visit, and book your PG securely through Hostel Dudes.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    gradient: "from-teal-600 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
            🚀 Simple Process
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
            Find Your PG in 4 Easy Steps
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            From search to move-in, Hostel Dudes makes the whole process smooth and transparent
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-teal-200 z-0 mx-28" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map(({ icon: Icon, step, title, description, color, bg, gradient }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-5">
                  <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${gradient} text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm`}>
                    {i + 1}
                  </div>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
