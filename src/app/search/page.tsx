"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, MapIcon, LayoutGrid, Search,
  ArrowUpDown, X, Loader2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PGCard from "@/components/pg/PGCard";
import FilterSidebar from "@/components/search/FilterSidebar";
import { SORT_OPTIONS } from "@/constants";
import { buildQueryString } from "@/utils";
import type { PGSummary, SearchFilters } from "@/types";

const DEMO_RESULTS: PGSummary[] = [];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get("city") || undefined,
    area: searchParams.get("area") || undefined,
    college: searchParams.get("college") || undefined,
    gender: (searchParams.get("gender") as SearchFilters["gender"]) || undefined,
    sortBy: "rating",
    page: 1,
    limit: 24,
  });

  const [results, setResults] = useState<PGSummary[]>(DEMO_RESULTS);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const searchQuery = filters.college || filters.city || filters.area || "";

  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ sortBy: "rating", page: 1, limit: 24 });
  }, []);

  const handleSortChange = (sortBy: SearchFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setSortOpen(false);
  };

  // ─── Normalize raw API data → PGSummary shape ──────────────────────────────
  const normalizeApiPG = (raw: any): PGSummary => {
    // Handle images: could be JSON string, array, or plain string
    let images: string[] = [];
    if (Array.isArray(raw.images) && raw.images.length > 0) {
      images = raw.images;
    } else if (typeof raw.images === "string" && raw.images.length > 0) {
      try { images = JSON.parse(raw.images); } catch { images = [raw.images]; }
    }
    const fallbackImg = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=60";
    if (images.length === 0) images = [raw.coverImage || fallbackImg];

    return {
      id: raw.id || String(Date.now()),
      name: raw.name || "PG Listing",
      slug: raw.slug || raw.id,
      address: raw.address || raw.area || "",
      area: raw.area || "Unknown Area",
      city: raw.city && typeof raw.city === "object"
        ? raw.city
        : { name: raw.cityName || "Pune", slug: raw.citySlug || "pune" },
      gender: raw.gender || "ANY",
      minRent: Number(raw.minRent || raw.rent || 0),
      maxRent: Number(raw.maxRent || raw.minRent || raw.rent || 0),
      rating: Number(raw.rating || 0),
      reviewCount: Number(raw.reviewCount || 0),
      coverImage: images[0],
      images,
      verified: raw.verified ?? true,
      featured: raw.featured ?? false,
      status: raw.status || "ACTIVE",
      hasWifi: !!raw.hasWifi,
      hasAC: !!raw.hasAC,
      hasFood: !!raw.hasFood,
      hasParking: !!raw.hasParking,
      hasLaundry: !!raw.hasLaundry,
      hasSecurity: !!raw.hasSecurity,
      hasPowerBackup: !!raw.hasPowerBackup,
      hasAttachedBath: !!raw.hasAttachedBath,
      availableRooms: Number(raw.availableRooms ?? raw.available ?? 0),
      latitude: Number(raw.latitude || 18.52),
      longitude: Number(raw.longitude || 73.85),
      phone: raw.phone,
      whatsapp: raw.whatsapp,
    };
  };

  // ─── Fetch real search results ──────────────────────────────────────────────
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQueryString(filters as Record<string, unknown>);
      const res = await fetch(`/api/pgs?${qs}`);
      const data = await res.json();
      if (data.success && data.data) {
        setTotalPages(data.pagination?.totalPages || 1);
        const apiResults: PGSummary[] = data.data.map(normalizeApiPG);

        if (apiResults.length > 0) {
          // Real owner listings first — then add non-duplicate demo results
          const merged = [...apiResults];
          DEMO_RESULTS.forEach((demo) => {
            if (!merged.some((m) => m.id === demo.id || m.slug === demo.slug)) {
              let matches = true;
              if (filters.gender && filters.gender !== "ANY" && demo.gender !== filters.gender) matches = false;
              if (filters.area && !demo.area.toLowerCase().includes(filters.area.toLowerCase())) matches = false;
              if (filters.city && !demo.city.slug.toLowerCase().includes(filters.city.toLowerCase())) matches = false;
              if (matches) merged.push(demo);
            }
          });
          setResults(merged);
        } else {
          // No real listings — filter and show demo data
          let demoFiltered = [...DEMO_RESULTS];
          if (filters.gender && filters.gender !== "ANY") demoFiltered = demoFiltered.filter(d => d.gender === filters.gender);
          if (filters.area) demoFiltered = demoFiltered.filter(d => d.area.toLowerCase().includes(filters.area!.toLowerCase()));
          if (filters.city) demoFiltered = demoFiltered.filter(d => d.city.slug.toLowerCase().includes(filters.city!.toLowerCase()));
          setResults(demoFiltered);
        }
      }
    } catch (error) {
      console.error("Failed to fetch PGs:", error);
      setResults(DEMO_RESULTS);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const activeFilterCount = Object.keys(filters).filter(
    (k) => !["page", "limit", "sortBy", "city", "area", "college"].includes(k) &&
      filters[k as keyof SearchFilters] !== undefined
  ).length;

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        {/* Search Header */}
        <div className="bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  defaultValue={searchQuery}
                  placeholder="Search by college, city, or area..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value;
                      handleFilterChange({ college: val });
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => handleFilterChange({ college: undefined, city: undefined, area: undefined })}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile filter trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-300 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                    {SORT_OPTIONS.find((s) => s.value === filters.sortBy)?.label || "Sort"}
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden z-10"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleSortChange(opt.value as SearchFilters["sortBy"])}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                              filters.sortBy === opt.value
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "map" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Result summary */}
            <div className="flex items-center gap-2 mt-3">
              <p className="text-sm text-slate-500">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-slate-800">{results.length}</span> PGs found
                    {searchQuery && <> for <span className="font-semibold text-blue-600">&quot;{searchQuery}&quot;</span></>}
                  </>
                )}
              </p>
              {/* Active filter chips */}
              {filters.gender && filters.gender !== "ANY" && (
                <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  {filters.gender === "MALE" ? "Boys PG" : "Girls PG"}
                  <button onClick={() => handleFilterChange({ gender: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.hasFood && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  Food
                  <button onClick={() => handleFilterChange({ hasFood: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.hasAC && (
                <span className="flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full font-medium">
                  AC
                  <button onClick={() => handleFilterChange({ hasAC: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              mobileOpen={mobileFiltersOpen}
              onMobileClose={() => setMobileFiltersOpen(false)}
              resultCount={results.length}
            />

            {/* Results */}
            <div className="flex-1 min-w-0">
              {viewMode === "map" ? (
                <div className="bg-slate-200 rounded-2xl h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Map view requires Google Maps API key</p>
                    <p className="text-slate-400 text-sm mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                      <div className="skeleton h-52 w-full" />
                      <div className="p-4 space-y-3">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-3 w-1/2 rounded" />
                        <div className="skeleton h-3 w-full rounded" />
                        <div className="skeleton h-8 w-1/3 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Search className="w-9 h-9 text-slate-300" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-2">No PGs Found</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                    Try adjusting your filters or search for a different location.
                  </p>
                  <button onClick={handleReset} className="btn-primary">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {results.map((pg, i) => (
                    <motion.div
                      key={pg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <PGCard pg={pg} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {results.length > 0 && !loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                    disabled={(filters.page || 1) <= 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => handleFilterChange({ page: p })}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                          (filters.page || 1) === p
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 text-slate-600 hover:border-blue-300"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                    disabled={(filters.page || 1) >= totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* Close sort dropdown on outside click */}
      {sortOpen && <div className="fixed inset-0 z-0" onClick={() => setSortOpen(false)} />}
    </>
  );
}
