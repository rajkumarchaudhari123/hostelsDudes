"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const CITIES = [
  { name: "Noida", slug: "noida", state: "Uttar Pradesh", pgCount: 12, image: "https://images.unsplash.com/photo-1661858435242-ed971767e954?q=80&w=661&auto=format&fit=crop", color: "from-blue-600 to-blue-800" },
  { name: "Greater Noida", slug: "greater-noida", state: "Uttar Pradesh", pgCount: 8, image: "https://images.unsplash.com/photo-1709015653284-1c121cf92ddf?q=80&w=1228&auto=format&fit=crop", color: "from-purple-600 to-purple-800" },
];

export default function TrendingCities() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              🏙️ Popular Destinations
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-3">
              Trending Cities for Students
            </h2>
            <p className="text-slate-500 mt-2">
              Explore real PGs and hostels in Noida and Greater Noida
            </p>
          </div>
          <Link
            href="/cities"
            className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all"
          >
            All Cities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {CITIES.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/search?city=${city.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                  {/* Image */}
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${city.color} opacity-50 group-hover:opacity-60 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display font-bold text-white text-base leading-tight">{city.name}</h3>
                    <p className="text-white/70 text-xs">{city.state}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-white/60" />
                      <span className="text-white/80 text-xs font-medium">{city.pgCount.toLocaleString()} PGs</span>
                    </div>
                  </div>

                  {/* Hover chip */}
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Explore →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
