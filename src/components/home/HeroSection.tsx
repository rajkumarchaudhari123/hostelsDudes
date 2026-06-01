"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ShieldCheck, GraduationCap, Building } from "lucide-react";
import { buildQueryString } from "@/utils";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("ANY");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = { gender };
    if (query) {
      params.college = query; // Default search to college/area
    }
    router.push(`/search?${buildQueryString(params)}`);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    const params = { college: term, gender };
    router.push(`/search?${buildQueryString(params)}`);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-slate-50 pt-24 md:pt-32">
      {/* Background ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center">
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
          
          {/* Left Column: Text & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
                Zero Brokerage PG Finder
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              College Life Starts <br className="hidden sm:inline" />
              With The Right <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PG.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
            >
              Affordable and verified student PGs near your college in Noida & Greater Noida. 
              Compare facilities, check prices, and lock your visit instantly — 100% stress free.
            </motion.p>

            {/* Premium Pill Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl md:rounded-full p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-slate-100 mb-6 max-w-2xl w-full"
            >
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                {/* Search Input */}
                <div className="flex-grow flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl md:rounded-full border border-transparent focus-within:border-blue-100 transition-colors">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your college or preferred area..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Filter & Action Buttons Group */}
                <div className="flex gap-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex-grow md:flex-initial bg-slate-50 border border-slate-100 text-slate-700 rounded-xl md:rounded-full px-4 py-2.5 text-xs font-semibold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <option value="ANY">Co-Ed PG</option>
                    <option value="MALE">Boys PG</option>
                    <option value="FEMALE">Girls PG</option>
                  </select>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl md:rounded-full transition-colors whitespace-nowrap active:scale-[0.98] shadow-md shadow-blue-500/10"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Popular Colleges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-2 text-xs text-slate-500"
            >
              <span className="font-semibold text-slate-400">Popular:</span>
              {["GL Bajaj", "Galgotias", "Sharda", "Amity", "Knowledge Park"].map((college) => (
                <button
                  key={college}
                  onClick={() => handlePopularSearch(college)}
                  className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-blue-500 hover:text-blue-600 bg-white transition-colors font-medium text-slate-600"
                >
                  {college}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Hero Image with decorative touches */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-4 border-white"
            >
              <Image
                src="/hero_hostel.png"
                alt="Premium Student Co-Living Hostel Lounge"
                fill
                priority
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 40vw"
              />
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
            </motion.div>

            {/* Floating verification badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -top-4 -right-4 sm:-right-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-100 shadow-lg flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hostel Dudes</p>
                <p className="text-xs font-extrabold text-slate-800">100% Verified PGs</p>
              </div>
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-100 shadow-lg flex items-center gap-3"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-slate-800 border-l border-slate-200 pl-3">
                4.8 Rating
              </span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Horizontal Stats Strip */}
      <div className="relative bg-white border-t border-slate-100 py-6 md:py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
            {[
              { value: "2", label: "Active Cities (Noida & GN)" },
              { value: "4.8★", label: "Average Student Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <span className="font-display font-black text-2xl md:text-3xl text-slate-900 leading-none mb-1">
                  {stat.value}
                </span>
                <span className="text-[11px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
