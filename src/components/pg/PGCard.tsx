"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin, Star, Wifi, Wind, UtensilsCrossed, Car,
  Shield, Zap, Bath, Heart, Phone, MessageCircle,
  CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
import { formatPrice, genderLabel, cn } from "@/utils";
import type { PGSummary } from "@/types";

interface PGCardProps {
  pg: PGSummary;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  variant?: "default" | "compact" | "horizontal";
  distance?: number; // km
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  hasWifi: Wifi,
  hasAC: Wind,
  hasFood: UtensilsCrossed,
  hasParking: Car,
  hasSecurity: Shield,
  hasPowerBackup: Zap,
  hasAttachedBath: Bath,
};

const GENDER_COLORS: Record<string, string> = {
  MALE: "bg-blue-100 text-blue-700",
  FEMALE: "bg-pink-100 text-pink-700",
  ANY: "bg-purple-100 text-purple-700",
};

export default function PGCard({
  pg,
  isFavorite = false,
  onFavoriteToggle,
  variant = "default",
  distance,
}: PGCardProps) {
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);
  const [fav, setFav] = useState(isFavorite);

  // images may be a JSON string (from MySQL), array, or plain string
  let images: string[] = [];
  if (Array.isArray(pg.images) && pg.images.length > 0) {
    images = pg.images as string[];
  } else if (typeof pg.images === "string" && (pg.images as string).length > 0) {
    try { images = JSON.parse(pg.images as string); } catch { images = [pg.images as string]; }
  }
  if (images.length === 0) {
    images = pg.coverImage ? [pg.coverImage] : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=60"];
  }

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    setFav(!fav);
    onFavoriteToggle?.(pg.id);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i + 1) % images.length);
  };

  if (variant === "compact") {
    return (
      <Link href={`/pg/${pg.slug}`}>
        <div className="card-premium overflow-hidden">
          <div className="relative h-40">
            <img
              src={images[imgIndex]}
              alt={pg.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-pg.jpg"; }}
            />
            {pg.verified && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-display font-semibold text-slate-900 text-sm truncate">{pg.name}</h3>
            <p className="text-slate-500 text-xs mt-0.5">{pg.area}, {pg.city.name}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-blue-600 font-bold text-sm">{formatPrice(pg.minRent)}<span className="text-slate-400 font-normal text-xs">/mo</span></span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-slate-700">{pg.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  const handleCardClick = () => {
    router.push(`/pg/${pg.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className="cursor-pointer block"
    >
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100 overflow-hidden group">
          {/* Image Gallery */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={images[imgIndex]}
              alt={pg.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-pg.jpg"; }}
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === imgIndex ? "bg-white w-4" : "bg-white/60")} />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
              {pg.verified && (
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
              {pg.featured && (
                <span className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  ⭐ Featured
                </span>
              )}
              <span className={cn("badge text-xs", GENDER_COLORS[pg.gender])}>
                {genderLabel(pg.gender)}
              </span>
            </div>

            {/* Favorite */}
            <button
              onClick={handleFav}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <Heart className={cn("w-4 h-4 transition-colors", fav ? "fill-red-500 text-red-500" : "text-slate-400")} />
            </button>

            {/* Available rooms */}
            {pg.availableRooms === 0 ? (
              <div className="absolute bottom-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                Full
              </div>
            ) : pg.availableRooms <= 2 ? (
              <div className="absolute bottom-3 right-3 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                {pg.availableRooms} left!
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title & Rating */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-display font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                {pg.name}
              </h3>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                {(pg.rating || 0) > 0 ? (
                  <><span className="text-xs font-bold text-yellow-700">{pg.rating.toFixed(1)}</span>
                  <span className="text-xs text-yellow-600/60">({pg.reviewCount})</span></>
                ) : <span className="text-xs font-bold text-yellow-700">New</span>}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-slate-500 truncate">{pg.area}, {pg.city.name}</span>
              {distance !== undefined && (
                <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{distance} km</span>
              )}
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {Object.entries(AMENITY_ICONS).map(([key, Icon]) => {
                if (!(pg as unknown as Record<string, boolean>)[key]) return null;
                return (
                  <div key={key} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                    <Icon className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {key === "hasWifi" ? "WiFi" : key === "hasAC" ? "AC" : key === "hasFood" ? "Food" : key === "hasParking" ? "Parking" : key === "hasSecurity" ? "Security" : key === "hasPowerBackup" ? "Power" : "Bath"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-xl font-display font-bold text-blue-600">{formatPrice(pg.minRent)}</span>
                <span className="text-slate-400 text-sm">/month</span>
                {pg.minRent !== pg.maxRent && (
                  <span className="text-slate-400 text-xs ml-1">– {formatPrice(pg.maxRent)}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {pg.phone && (
                  <a
                    href={`tel:${pg.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {pg.whatsapp && (
                  <a
                    href={`https://wa.me/${pg.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/pg/${pg.slug}`}
                  className="btn-primary text-xs px-4 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
}
