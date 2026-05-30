"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PGCard from "@/components/pg/PGCard";
import type { PGSummary } from "@/types";

// Demo data for homepage display
const DEMO_PGS: PGSummary[] = [];

export default function FeaturedPGs() {
  const [pgs, setPgs] = useState<PGSummary[]>(DEMO_PGS);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/pgs");
        const data = await res.json();
        if (data.success && data.data) {
          // Normalize images: handle JSON string from MySQL, array, or string
          const normalize = (pg: any): PGSummary => {
            let images: string[] = [];
            if (Array.isArray(pg.images) && pg.images.length > 0) {
              images = pg.images;
            } else if (typeof pg.images === "string" && pg.images.length > 0) {
              try { images = JSON.parse(pg.images); } catch { images = [pg.images]; }
            }
            const fallback = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=60";
            if (images.length === 0) images = [pg.coverImage || fallback];

            return {
              id: pg.id || String(Date.now()),
              name: pg.name || "PG Listing",
              slug: pg.slug || pg.id,
              address: pg.address || pg.area || "",
              area: pg.area || "Unknown Area",
              city: pg.city && typeof pg.city === "object"
                ? pg.city
                : { name: pg.cityName || "Pune", slug: pg.citySlug || "pune" },
              gender: pg.gender || "ANY",
              minRent: Number(pg.minRent || pg.rent || 0),
              maxRent: Number(pg.maxRent || pg.minRent || 0),
              rating: Number(pg.rating || 0),
              reviewCount: Number(pg.reviewCount || 0),
              coverImage: images[0],
              images,
              verified: pg.verified ?? true,
              featured: pg.featured ?? false,
              status: pg.status || "ACTIVE",
              hasWifi: !!pg.hasWifi, hasAC: !!pg.hasAC, hasFood: !!pg.hasFood,
              hasParking: !!pg.hasParking, hasLaundry: !!pg.hasLaundry,
              hasSecurity: !!pg.hasSecurity, hasPowerBackup: !!pg.hasPowerBackup,
              hasAttachedBath: !!pg.hasAttachedBath,
              availableRooms: Number(pg.availableRooms ?? 0),
              latitude: Number(pg.latitude || 18.52),
              longitude: Number(pg.longitude || 73.85),
              phone: pg.phone,
              whatsapp: pg.whatsapp,
            };
          };

          const apiPgs = data.data.map(normalize);

          if (apiPgs.length > 0) {
            // Real owner listings first, then demo
            let merged = [...apiPgs];
            DEMO_PGS.forEach((demo) => {
              if (!merged.some((m) => m.id === demo.id || m.slug === demo.slug)) merged.push(demo);
            });
            setPgs(merged.slice(0, 8));
          }
          // else keep demo data as-is
        }
      } catch (error) {
        console.error("Failed to load featured PGs from API:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              ⭐ Top Picks
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mt-3">
              Featured PGs This Week
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg">
              Hand-picked, verified PGs with the best amenities, ratings, and value for money.
            </p>
          </div>
          <Link
            href="/search?featured=true"
            className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
          >
            View All PGs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pgs.map((pg, i) => (
            <motion.div
              key={pg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PGCard pg={pg} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
