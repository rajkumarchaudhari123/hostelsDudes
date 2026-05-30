"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, GraduationCap, Building2, Sparkles, Shield, Star, Users } from "lucide-react";
import { buildQueryString } from "@/utils";

const ROTATING_CITIES = ["Noida", "Greater Noida"];

const STATS = [
  { label: "Verified PGs", value: "Real PGs", icon: Building2 },
  { label: "Dedicated Help", value: "Student-First", icon: Users },
  { label: "Areas Covered", value: "Noida & Greater Noida", icon: MapPin },
  { label: "Service Support", value: "24/7 Live", icon: Star },
];

const FLOAT_CARDS = [
  { top: "15%", left: "5%", text: "WiFi Included", icon: "📶" },
  { top: "15%", right: "5%", text: "Verified Listing", icon: "✅" },
  { bottom: "25%", left: "3%", text: "₹6,500/month", icon: "💰" },
  { bottom: "25%", right: "3%", text: "4.9 Rating", icon: "⭐" },
];

export default function HeroSection() {
  const router = useRouter();
  const [cityIndex, setCityIndex] = useState(0);
  const [searchType, setSearchType] = useState<"college" | "city" | "area">("college");
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("ANY");

  useEffect(() => {
    const interval = setInterval(() => {
      setCityIndex((i) => (i + 1) % ROTATING_CITIES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = { gender };
    if (searchType === "college") params.college = query;
    else if (searchType === "city") params.city = query;
    else params.area = query;
    router.push(`/search?${buildQueryString(params)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating cards (desktop only) */}
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
          style={{
            position: "absolute",
            ...Object.fromEntries(Object.entries(card).filter(([k]) => ["top","bottom","left","right"].includes(k))),
            animationDelay: `${i * 1.2}s`
          } as React.CSSProperties}
          className="hidden lg:flex items-center gap-2.5 glass px-4 py-3 rounded-2xl animate-float"
        >
          <span className="text-xl">{card.icon}</span>
          <span className="text-white text-sm font-semibold">{card.text}</span>
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/90 font-medium">India&apos;s #1 PG Finder Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
          >
            Find Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Perfect PG</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9 C 75 2, 225 2, 298 9" stroke="#F97316" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            <br />
            Near Your College
          </motion.h1>

          {/* Subheadline with rotating cities */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/75 mb-10 leading-relaxed"
          >
            Verified PGs in{" "}
            <span className="text-cyan-400 font-semibold inline-block min-w-[80px]">
              {ROTATING_CITIES[cityIndex]}
            </span>
          </motion.p>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-3xl p-2 shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
          >
            {/* Search Type Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl mb-2">
              {(["college", "city", "area"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                    searchType === type
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {type === "college" ? "By College" : type === "city" ? "By City" : "By Area"}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-2">
              {/* Main Input */}
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                {searchType === "college" ? (
                  <GraduationCap className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
                <input
                  type="text"
                  placeholder={
                    searchType === "college"
                      ? "Enter college or university name..."
                      : searchType === "city"
                      ? "Enter city (e.g. Pune, Bangalore)..."
                      : "Enter area or locality..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 outline-none text-slate-800 placeholder:text-slate-400 text-sm bg-transparent font-medium"
                />
              </div>

              {/* Gender Filter */}
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-white text-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold outline-none cursor-pointer sm:w-36"
              >
                <option value="ANY">Co-ed</option>
                <option value="MALE">Boys PG</option>
                <option value="FEMALE">Girls PG</option>
              </select>

              {/* Submit */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Search PGs
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 px-3 pb-2 pt-1">
              <span className="text-white/50 text-xs">Popular:</span>
              {["IIT Bombay", "VIT Vellore", "Pune University", "BITS Pilani"].map((item) => (
                <button
                  key={item}
                  onClick={() => { setSearchType("college"); setQuery(item); }}
                  className="text-xs bg-white/10 text-white/80 hover:bg-white/20 hover:text-white px-3 py-1.5 rounded-full transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10"
          >
            {[
              { icon: Shield, text: "Verified Listings" },
              { icon: Star, text: "Top Rated Support" },
              { icon: MapPin, text: "Noida & Greater Noida" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/60">
                <Icon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
        >
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="font-display font-bold text-2xl text-white">{value}</div>
              <div className="text-white/60 text-xs mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 69.3C120 59 240 37 360 32C480 27 600 37 720 48C840 59 960 69 1080 69.3C1200 69 1320 59 1380 53.3L1440 48V80H0Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
