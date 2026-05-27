"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const CITIES = [
  { name: "Pune", slug: "pune", state: "Maharashtra", pgCount: 2840, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=60", color: "from-blue-600 to-blue-800" },
  { name: "Bangalore", slug: "bangalore", state: "Karnataka", pgCount: 4120, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=60", color: "from-purple-600 to-purple-800" },
  { name: "Mumbai", slug: "mumbai", state: "Maharashtra", pgCount: 3560, image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&auto=format&fit=crop&q=60", color: "from-cyan-600 to-cyan-800" },
  { name: "Delhi", slug: "delhi", state: "Delhi NCR", pgCount: 5230, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60", color: "from-red-600 to-red-800" },
  { name: "Hyderabad", slug: "hyderabad", state: "Telangana", pgCount: 2190, image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&auto=format&fit=crop&q=60", color: "from-orange-600 to-orange-800" },
  { name: "Chennai", slug: "chennai", state: "Tamil Nadu", pgCount: 1870, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60", color: "from-teal-600 to-teal-800" },
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
              Thousands of PGs available in India&apos;s top student cities
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
