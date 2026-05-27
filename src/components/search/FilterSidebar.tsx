"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { AMENITIES, GENDER_OPTIONS, ROOM_TYPES } from "@/constants";
import type { SearchFilters } from "@/types";
import { formatPrice } from "@/utils";

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  resultCount?: number;
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  mobileOpen,
  onMobileClose,
  resultCount,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minRent || 0,
    filters.maxRent || 30000,
  ]);

  const handleAmenityToggle = (key: string) => {
    const currentVal = (filters as Record<string, boolean | undefined>)[key];
    onChange({ [key]: currentVal ? undefined : true } as Partial<SearchFilters>);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (k) => !["page", "limit", "sortBy", "city", "area", "college"].includes(k) && filters[k as keyof SearchFilters]
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h3 className="font-display font-bold text-slate-900">Filters</h3>
          {resultCount !== undefined && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {resultCount} results
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Gender */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">PG Type</h4>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ gender: opt.value as SearchFilters["gender"] })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filters.gender === opt.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Budget:{" "}
          <span className="text-blue-600">
            {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
          </span>
        </h4>
        <div className="space-y-2">
          <input
            type="range"
            min={1000}
            max={30000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPriceRange([priceRange[0], val]);
              onChange({ minRent: priceRange[0], maxRent: val });
            }}
            className="w-full accent-blue-600"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([val, priceRange[1]]);
                onChange({ minRent: val });
              }}
              className="w-full text-xs input-premium py-2"
              placeholder="Min"
            />
            <span className="text-slate-400 text-xs">–</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([priceRange[0], val]);
                onChange({ maxRent: val });
              }}
              className="w-full text-xs input-premium py-2"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Room Type</h4>
        <div className="space-y-2">
          {ROOM_TYPES.map((rt) => (
            <label
              key={rt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                filters.roomType === rt.value
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300 group-hover:border-blue-400"
              }`}>
                {filters.roomType === rt.value && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={filters.roomType === rt.value}
                onChange={() => onChange({ roomType: filters.roomType === rt.value ? undefined : rt.value as SearchFilters["roomType"] })}
              />
              <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{rt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Amenities</h4>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((amenity) => {
            const isActive = !!(filters as Record<string, boolean | undefined>)[amenity.key];
            return (
              <button
                key={amenity.key}
                onClick={() => handleAmenityToggle(amenity.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? "bg-blue-600" : "bg-slate-300"}`} />
                {amenity.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Max Distance</h4>
        <div className="flex flex-wrap gap-2">
          {[0.5, 1, 2, 3, 5].map((d) => (
            <button
              key={d}
              onClick={() => onChange({ maxDistance: filters.maxDistance === d ? undefined : d })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filters.maxDistance === d
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {d < 1 ? `${d * 1000}m` : `${d}km`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="card-premium p-5 sticky top-24">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display font-bold text-lg text-slate-900">Filters</span>
                  <button onClick={onMobileClose} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
