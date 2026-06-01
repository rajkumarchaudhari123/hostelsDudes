"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, Star, Phone, MessageCircle, Heart, Share2,
  Wifi, Wind, UtensilsCrossed, Car, Shield, Zap, Bath,
  Camera, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Banknote, Home, X, Send, ArrowLeft, Loader2,
  Users, Dumbbell, Droplets, Tv, Lock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice, timeAgo } from "@/utils";

const AMENITY_LIST = [
  { key: "hasWifi", label: "High-Speed WiFi", icon: Wifi, color: "#6366f1" },
  { key: "hasAC", label: "Air Conditioning", icon: Wind, color: "#0ea5e9" },
  { key: "hasFood", label: "Home-cooked Food", icon: UtensilsCrossed, color: "#10b981" },
  { key: "hasParking", label: "Parking", icon: Car, color: "#f59e0b" },
  { key: "hasSecurity", label: "24/7 Security", icon: Shield, color: "#8b5cf6" },
  { key: "hasPowerBackup", label: "Power Backup", icon: Zap, color: "#f97316" },
  { key: "hasAttachedBath", label: "Attached Bathroom", icon: Bath, color: "#06b6d4" },
  { key: "hasCCTV", label: "CCTV Cameras", icon: Camera, color: "#ec4899" },
  { key: "hasHotWater", label: "Hot Water / Geyser", icon: Droplets, color: "#3b82f6" },
  { key: "hasGym", label: "In-house Gym", icon: Dumbbell, color: "#84cc16" },
  { key: "hasLaundry", label: "Laundry", icon: Tv, color: "#64748b" },
  { key: "hasTVRoom", label: "TV Room", icon: Tv, color: "#a855f7" },
];

// Default images if none provided
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
];

function GenderBadge({ gender }: { gender: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    MALE:   { label: "Boys PG 🧑", bg: "#dbeafe", text: "#1d4ed8" },
    FEMALE: { label: "Girls PG 👩", bg: "#fce7f3", text: "#be185d" },
    ANY:    { label: "Co-ed PG 🏠", bg: "#dcfce7", text: "#15803d" },
  };
  const s = map[gender] || map.ANY;
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

export default function PGDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pg, setPg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [imgIndex, setImgIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "food" | "reviews">("overview");

  // ─── Fetch PG by slug ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPG = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/pgs/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPg(data.data);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Failed to load PG", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [slug]);

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar user={null} />
        <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
            <p className="text-slate-500">Loading PG details…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Not found ───────────────────────────────────────────────────────────────
  if (notFound || !pg) {
    return (
      <>
        <Navbar user={null} />
        <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Home className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="font-bold text-xl text-slate-800 mb-2">PG Not Found</h2>
            <p className="text-slate-500 mb-6">This listing may have been removed or the link is incorrect.</p>
            <Link href="/search" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Normalise images ────────────────────────────────────────────────────────
  let images: string[] = [];
  if (Array.isArray(pg.images) && pg.images.length > 0) {
    images = pg.images;
  } else if (pg.coverImage) {
    images = [pg.coverImage];
  } else {
    images = DEFAULT_IMAGES;
  }

  const safeImgIndex = Math.min(imgIndex, images.length - 1);
  const ratingBars = [5, 4, 3, 2, 1];
  const genderLabel = pg.gender === "MALE" ? "Boys" : pg.gender === "FEMALE" ? "Girls" : "Co-ed";

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        {/* Back */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="relative h-72 sm:h-96 cursor-pointer" onClick={() => setGalleryOpen(true)}>
                  <img
                    src={images[safeImgIndex]}
                    alt={`${pg.name} - photo ${safeImgIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.src = DEFAULT_IMAGES[0]; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Gender badge overlay */}
                  <div className="absolute top-4 left-4">
                    <GenderBadge gender={pg.gender} />
                  </div>

                  {/* Arrows */}
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-700" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    {safeImgIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden ring-2 transition-all ${i === safeImgIndex ? "ring-indigo-500" : "ring-transparent opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e: any) => { e.target.src = DEFAULT_IMAGES[0]; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Title & Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {pg.verified && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <GenderBadge gender={pg.gender} />
                      {pg.featured && (
                        <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-semibold">⭐ Featured</span>
                      )}
                    </div>
                    <h1 className="font-bold text-2xl text-slate-900">{pg.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <p className="text-slate-500 text-sm">{pg.address}{pg.area ? `, ${pg.area}` : ""}{pg.city?.name ? `, ${pg.city.name}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsFav(!isFav)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
                      <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                    </button>
                    <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-50 transition-colors">
                      <Share2 className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Rating bar */}
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl mb-4">
                  <div className="text-center">
                    <div className="font-bold text-3xl text-yellow-600">{pg.rating ? pg.rating.toFixed(1) : "New"}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(pg.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-yellow-600/70 mt-1">{pg.reviewCount || 0} reviews</p>
                  </div>
                  {(pg.reviewCount || 0) > 0 && (
                    <div className="flex-1 space-y-1">
                      {ratingBars.map((r) => (
                        <div key={r} className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-4">{r}</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r === 5 ? 70 : r === 4 ? 20 : r === 3 ? 7 : 3}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Banknote, label: "Monthly Rent", value: pg.maxRent ? `${formatPrice(pg.minRent)} – ${formatPrice(pg.maxRent)}` : formatPrice(pg.minRent) },
                    { icon: Home, label: "Rooms", value: `${pg.availableRooms ?? 0} avail / ${pg.totalRooms ?? 0} total` },
                    { icon: Clock, label: "Curfew", value: pg.curfewTime || "No curfew" },
                    { icon: Calendar, label: "Notice Period", value: `${pg.noticePeriod || 30} days` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <Icon className="w-4 h-4 text-indigo-500 mb-1.5" />
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-100 overflow-x-auto">
                  {(["overview", "rooms", "food", "reviews"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-semibold capitalize whitespace-nowrap px-4 transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>
                      {tab === "overview" ? "Overview" : tab === "rooms" ? "Rooms & Pricing" : tab === "food" ? "Food Menu" : "Reviews"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* ── OVERVIEW ── */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3">About This PG</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{pg.description || "No description provided."}</p>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {AMENITY_LIST.map(({ key, label, icon: Icon, color }) => {
                            const active = !!(pg as any)[key];
                            return (
                              <div key={key} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50 opacity-40"}`}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: active ? color + "20" : "#f1f5f9" }}>
                                  <Icon className="w-4 h-4" style={{ color: active ? color : "#94a3b8" }} />
                                </div>
                                <span className={`text-sm font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
                                {active && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {(pg.colleges || []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-4">Nearby Colleges</h3>
                          <div className="space-y-3">
                            {pg.colleges.map(({ college, distance, travelTime }: any) => (
                              <div key={college.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">{college.name}</p>
                                    <p className="text-xs text-slate-400">{distance} km away</p>
                                  </div>
                                </div>
                                {travelTime && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">~{travelTime} min</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ROOMS ── */}
                  {activeTab === "rooms" && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-slate-900">Room Types & Pricing</h3>
                      {(pg.rooms || []).length === 0 ? (
                        <div className="text-center py-10">
                          <Home className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm">Room details not added yet by owner.</p>
                          <p className="text-slate-300 text-xs mt-1">Rent range: {formatPrice(pg.minRent)} – {formatPrice(pg.maxRent)} / month</p>
                        </div>
                      ) : (
                        pg.rooms.map((room: any) => (
                          <div key={room.id} className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-slate-900">
                                    {room.type === "SINGLE" ? "Single Sharing" : room.type === "DOUBLE" ? "Double Sharing" : room.type === "TRIPLE" ? "Triple Sharing" : "Dormitory"}
                                  </span>
                                  {room.availBeds === 0
                                    ? <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Full</span>
                                    : <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">{room.availBeds} available</span>
                                  }
                                </div>
                                {room.description && <p className="text-slate-500 text-sm mb-2">{room.description}</p>}
                                <p className="text-xs text-slate-400">{room.floor ? `Floor ${room.floor} •` : ""} {room.totalBeds} bed(s)</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-xl text-indigo-600">{formatPrice(room.rent)}</p>
                                <p className="text-slate-400 text-xs">/month</p>
                                {room.deposit && <p className="text-slate-400 text-xs mt-0.5">Deposit: {formatPrice(room.deposit)}</p>}
                              </div>
                            </div>
                            {room.availBeds > 0 && (
                              <button onClick={() => setInquiryOpen(true)} className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                                Inquire for This Room
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* ── FOOD ── */}
                  {activeTab === "food" && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-4">Weekly Food Menu</h3>
                      {(pg.foodMenu || []).length === 0 ? (
                        <div className="text-center py-10">
                          <UtensilsCrossed className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm">{pg.hasFood ? "Food menu not added yet." : "This PG does not provide food."}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pg.foodMenu.map((day: any) => (
                            <div key={day.day} className="border border-slate-100 rounded-xl overflow-hidden">
                              <div className="bg-indigo-50 px-4 py-2">
                                <span className="font-semibold text-indigo-700 text-sm">{day.day}</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-slate-100">
                                {[{ label: "Breakfast", value: day.breakfast }, { label: "Lunch", value: day.lunch }, { label: "Dinner", value: day.dinner }, { label: "Snacks", value: day.snacks }].map(({ label, value }) => (
                                  <div key={label} className="p-3">
                                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                                    <p className="text-xs text-slate-700 leading-snug">{value || "–"}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── REVIEWS ── */}
                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-slate-900">Student Reviews ({pg.reviewCount || 0})</h3>
                      {(pg.reviews || []).length === 0 ? (
                        <div className="text-center py-10">
                          <Star className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>
                        </div>
                      ) : (
                        pg.reviews.map((review: any) => (
                          <div key={review.id} className="border border-slate-100 rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                                  {review.user?.name?.[0] || "?"}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-slate-800">{review.user?.name || "Student"}</p>
                                  <p className="text-xs text-slate-400">{timeAgo(review.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map((s) => (
                                  <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            {review.isVerified && (
                              <div className="flex items-center gap-1.5 mt-3">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Verified Stay</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">

                {/* Price Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-bold text-3xl text-indigo-600">{formatPrice(pg.minRent)}</span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>
                  {pg.maxRent && pg.maxRent !== pg.minRent && (
                    <p className="text-slate-400 text-xs mb-1">Up to {formatPrice(pg.maxRent)}/month</p>
                  )}
                  {pg.deposit > 0 && (
                    <p className="text-slate-400 text-xs mb-4">Deposit: {formatPrice(pg.deposit)}</p>
                  )}

                  <div className="space-y-3 mb-5 mt-4">
                    <button onClick={() => setInquiryOpen(true)}
                      className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                      Send Inquiry
                    </button>
                    {pg.whatsapp && (
                      <a href={`https://wa.me/${String(pg.whatsapp).replace(/\D/g, "")}?text=Hi, I found your PG on Hostel Dudes. I'm interested in ${pg.name}. Please share more details.`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-3.5 rounded-xl text-sm font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                        <MessageCircle className="w-4 h-4" /> WhatsApp Owner
                      </a>
                    )}
                    {pg.phone && (
                      <a href={`tel:${pg.phone}`}
                        className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all">
                        <Phone className="w-4 h-4" /> Call Owner
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 text-center">Free to inquire · No booking fees</p>
                </div>

                {/* Key Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h4 className="font-semibold text-slate-800 text-sm mb-4">Quick Details</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Users, label: "For", value: genderLabel + " students" },
                      { icon: Home, label: "Available rooms", value: `${pg.availableRooms ?? 0} of ${pg.totalRooms ?? 0}` },
                      { icon: Lock, label: "Curfew", value: pg.curfewTime || "No curfew" },
                      { icon: MapPin, label: "Area", value: pg.area || "—" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-semibold text-slate-700">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h4 className="font-semibold text-slate-800 text-sm mb-4">PG Owner</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                      {pg.owner?.user?.name?.[0] || "O"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{pg.owner?.user?.name || "PG Owner"}</p>
                      <p className="text-xs text-slate-400">Verified Owner · Hostel Dudes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-700 font-medium">Usually responds within 1 hour</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {inquiryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto px-4 py-8"
              onClick={(e) => { if (e.target === e.currentTarget) setInquiryOpen(false); }}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">Send Inquiry</h3>
                  <button onClick={() => setInquiryOpen(false)} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{pg.name}</p>
                      <p className="text-xs text-slate-500">{pg.area}{pg.city?.name ? `, ${pg.city.name}` : ""}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Your Name</label>
                    <input type="text" placeholder="Enter your full name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Phone Number</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Message</label>
                    <textarea rows={3} placeholder="Hi, I'm interested in this PG. I'm looking for a room from [date]..." value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 resize-none" />
                  </div>
                  <button className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                    <Send className="w-4 h-4" /> Send Inquiry
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full screen gallery */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <button onClick={() => setGalleryOpen(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <img src={images[safeImgIndex]} alt="" className="max-h-screen max-w-full object-contain" />
            {images.length > 1 && (
              <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <div className="absolute bottom-4 text-white/60 text-sm">{safeImgIndex + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
