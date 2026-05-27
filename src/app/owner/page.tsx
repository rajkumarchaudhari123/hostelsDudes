"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, BookOpen, MessageSquare,
  Star, TrendingUp, Bell, LogOut, Plus, Eye, Edit,
  Trash2, CheckCircle2, Clock, XCircle, Users, DollarSign,
  BarChart2, Settings, ChevronRight, Calendar, X, Shield, Wind,
  Wifi, Utensils, Car, ShieldAlert, Zap, Camera, Dumbbell, Bath,
  Droplets, Tv, Info, MapPin, Tag, Menu
} from "lucide-react";
import { signOut } from "next-auth/react";
import { formatPrice, timeAgo } from "@/utils";
import { PG_STATUS_COLORS, BOOKING_STATUS_COLORS } from "@/constants";

const RECENT_BOOKINGS = [
  { id: "b1", student: "Anjali Sharma", pg: "Sunrise PG for Girls", roomType: "Single", status: "CONFIRMED", checkIn: "2026-06-01", amount: 12000, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "b2", student: "Rohan Mehta", pg: "Comfort Boys PG", roomType: "Double", status: "PENDING", checkIn: "2026-06-05", amount: 9000, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "b3", student: "Priya Nair", pg: "Sunrise PG for Girls", roomType: "Triple", status: "COMPLETED", checkIn: "2026-05-01", amount: 7500, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "b4", student: "Vikash Kumar", pg: "Comfort Boys PG", roomType: "Single", status: "CANCELLED", checkIn: "2026-05-15", amount: 12000, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
];

const RECENT_INQUIRIES = [
  { id: "i1", student: "Meera Joshi", pg: "Sunrise PG for Girls", message: "Hi, I'm interested in a single room from June. Is it available?", status: "OPEN", createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "i2", student: "Arun Singh", pg: "Comfort Boys PG", message: "What is the food menu? Do you provide non-veg also?", status: "RESPONDED", createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "i3", student: "Divya Patel", pg: "Sunrise PG for Girls", message: "Can I visit tomorrow between 2-4 PM?", status: "OPEN", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];

type Tab = "overview" | "listings" | "bookings" | "inquiries" | "analytics";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [addPgOpen, setAddPgOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form states
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    area: "",
    gender: "ANY",
    minRent: "",
    maxRent: "",
    deposit: "",
    curfewTime: "10:00 PM",
    totalRooms: "5",
    availableRooms: "3",
    coverImage: "",
    images: "",
    phone: "",
    whatsapp: "",
    hasWifi: false,
    hasAC: false,
    hasFood: false,
    hasParking: false,
    hasLaundry: false,
    hasSecurity: false,
    hasPowerBackup: false,
    hasCCTV: false,
    hasGym: false,
    hasAttachedBath: false,
    hasHotWater: false,
    hasTVRoom: false,
  });

  // Fetch session & owner listings
  const fetchSessionAndListings = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      setSession(sessionData);

      const ownerEmail = sessionData?.user?.email || "owner@hostelsdudes.in";
      
      const pgsRes = await fetch(`/api/pgs?ownerId=${ownerEmail}`);
      const pgsData = await pgsRes.json();
      if (pgsData.success && pgsData.data) {
        setListings(pgsData.data);
      }
    } catch (error) {
      console.error("Failed to load owner data:", error);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchSessionAndListings();
  }, []);

  const handleAddPG = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const ownerEmail = session?.user?.email || "owner@hostelsdudes.in";
      const payload = {
        ...form,
        ownerId: ownerEmail,
        images: form.images ? form.images.split(",").map(i => i.trim()) : [form.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60"],
        coverImage: form.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60",
      };

      const res = await fetch("/api/pgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setAddPgOpen(false);
        // Reset form
        setForm({
          name: "",
          description: "",
          address: "",
          area: "",
          gender: "ANY",
          minRent: "",
          maxRent: "",
          deposit: "",
          curfewTime: "10:00 PM",
          totalRooms: "5",
          availableRooms: "3",
          coverImage: "",
          images: "",
          phone: "",
          whatsapp: "",
          hasWifi: false,
          hasAC: false,
          hasFood: false,
          hasParking: false,
          hasLaundry: false,
          hasSecurity: false,
          hasPowerBackup: false,
          hasCCTV: false,
          hasGym: false,
          hasAttachedBath: false,
          hasHotWater: false,
          hasTVRoom: false,
        });
        await fetchSessionAndListings();
      } else {
        alert(data.error || "Failed to add PG");
      }
    } catch (error) {
      console.error("Error adding PG:", error);
      alert("Failed to submit PG listing.");
    } finally {
      setCreateLoading(false);
    }
  };

  const ownerName = session?.user?.name || "Sunita Khanna";
  const ownerEmail = session?.user?.email || "owner@hostelsdudes.in";
  const ownerInitial = ownerName[0]?.toUpperCase() || "S";

  const STATS = [
    { label: "My Listings", value: listings.length.toString(), icon: Building2, color: "blue", change: "Updated live" },
    { label: "Total Bookings", value: "128", icon: BookOpen, color: "indigo", change: "+12 this month" },
    { label: "New Inquiries", value: "23", icon: MessageSquare, color: "cyan", change: "+8 this week" },
    { label: "Monthly Revenue", value: "₹2.4L", icon: DollarSign, color: "green", change: "+18% vs last" },
    { label: "Avg Rating", value: "4.7★", icon: Star, color: "yellow", change: "124 reviews" },
    { label: "Occupancy", value: "87%", icon: Users, color: "teal", change: "30/34 beds filled" },
  ];

  const NAV = [
    { tab: "overview" as Tab, icon: LayoutDashboard, label: "Overview" },
    { tab: "listings" as Tab, icon: Building2, label: "My Listings", badge: listings.length },
    { tab: "bookings" as Tab, icon: BookOpen, label: "Bookings", badge: RECENT_BOOKINGS.filter((b) => b.status === "PENDING").length },
    { tab: "inquiries" as Tab, icon: MessageSquare, label: "Inquiries", badge: RECENT_INQUIRIES.filter((i) => i.status === "OPEN").length },
    { tab: "analytics" as Tab, icon: BarChart2, label: "Analytics" },
  ];

  const navClick = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Mobile sidebar backdrop ─────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col shadow-sm transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Hostel Dudes</p>
              <p className="text-slate-400 text-xs">Owner Dashboard</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {ownerInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-sm font-semibold truncate">{ownerName}</p>
              <p className="text-slate-400 text-xs truncate">{ownerEmail}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ tab, icon: Icon, label, badge }) => (
            <button
              key={tab}
              onClick={() => navClick(tab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${activeTab === tab ? "text-blue-600" : "text-slate-400"}`} />
                {label}
              </div>
              {badge !== undefined && badge > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-sm transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-lg sm:text-xl text-slate-900 truncate">
                {activeTab === "overview" ? `Hi, ${ownerName.split(" ")[0]}! 👋` :
                 activeTab === "listings" ? "My PG Listings" :
                 activeTab === "bookings" ? "Booking Requests" :
                 activeTab === "inquiries" ? "Student Inquiries" : "Analytics"}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 hidden sm:block">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {activeTab === "listings" && (
              <button onClick={() => setAddPgOpen(true)} className="btn-primary text-sm flex items-center gap-1.5 py-2 px-3">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add PG</span><span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-slate-200 flex">
          {NAV.map(({ tab, icon: Icon, label, badge }) => (
            <button key={tab} onClick={() => navClick(tab)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition-colors relative ${
                activeTab === tab ? "text-blue-600" : "text-slate-400"
              }`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{badge}</span>
                )}
              </div>
              <span className="truncate">{label.replace("My ","")}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                {STATS.map(({ label, value, icon: Icon, color, change }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-${color}-100`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <p className="font-display font-bold text-xl text-slate-900">{value}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                    <p className="text-xs text-green-600 font-medium mt-1.5">{change}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* My PGs quick view */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-slate-900">My Listings</h3>
                    <button onClick={() => setActiveTab("listings")} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {loadingListings ? (
                      <div className="text-center py-6 text-slate-400 text-sm">Loading listings...</div>
                    ) : listings.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">No PGs listed yet. Create one!</div>
                    ) : (
                      listings.slice(0, 3).map((pg) => (
                        <div key={pg.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                          <img src={pg.coverImage || pg.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60"} alt={pg.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{pg.name}</p>
                            <p className="text-xs text-slate-400 truncate">{pg.area}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${PG_STATUS_COLORS[pg.status] || "bg-green-100 text-green-700"}`}>
                              {pg.status}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">{pg.availableRooms || pg.available || 0} avail.</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent bookings */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-slate-900">Recent Bookings</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {RECENT_BOOKINGS.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{b.student}</p>
                          <p className="text-xs text-slate-400">{b.roomType} · Check-in {b.checkIn}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${BOOKING_STATUS_COLORS[b.status]}`}>{b.status}</span>
                          <p className="text-xs font-bold text-blue-600 mt-1">{formatPrice(b.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LISTINGS */}
          {activeTab === "listings" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                {loadingListings ? (
                  <div className="col-span-2 text-center py-12 text-slate-400">Loading your properties...</div>
                ) : (
                  listings.map((pg, i) => (
                    <motion.div
                      key={pg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden"
                    >
                      <div className="flex">
                        <img 
                          src={pg.coverImage || pg.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60"} 
                          alt={pg.name} 
                          className="w-32 h-auto object-cover flex-shrink-0" 
                          style={{ minHeight: "120px" }} 
                        />
                        <div className="flex-1 p-5 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-display font-bold text-slate-900 truncate">{pg.name}</h3>
                              <p className="text-slate-400 text-xs mt-0.5 truncate">{pg.area}, {pg.address}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${PG_STATUS_COLORS[pg.status] || "bg-green-100 text-green-700"}`}>
                              {pg.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                            <span><strong className="text-slate-800">{pg.totalRooms || 5}</strong> rooms</span>
                            <span><strong className="text-green-600">{pg.availableRooms || 3}</strong> available</span>
                            <span><strong className="text-yellow-600">★ {pg.rating || "0.0"}</strong></span>
                            <span><strong className="text-blue-600">{formatPrice(pg.minRent || pg.rent)}</strong>/mo</span>
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium text-[10px]">
                              {pg.gender === "ANY" ? "Co-ed" : pg.gender === "MALE" ? "Boys" : "Girls"}
                            </span>
                          </div>
                          
                          {/* Display short Curfew & Amenities flags */}
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {pg.curfewTime && (
                              <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                                Curfew: {pg.curfewTime}
                              </span>
                            )}
                            {pg.hasWifi && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">WiFi</span>}
                            {pg.hasAC && <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">AC</span>}
                            {pg.hasFood && <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">Food</span>}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all">
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Add new PG card */}
                <motion.button
                  onClick={() => setAddPgOpen(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-blue-700">Add New PG</p>
                    <p className="text-blue-500/70 text-xs mt-0.5">List a new property</p>
                  </div>
                </motion.button>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Student", "PG & Room", "Check-In", "Amount", "Status", "Date", "Action"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RECENT_BOOKINGS.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{b.student[0]}</div>
                            <span className="text-sm font-semibold text-slate-800">{b.student}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">{b.pg}</p>
                          <p className="text-xs text-slate-400">{b.roomType} sharing</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">{b.checkIn}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-blue-600">{formatPrice(b.amount)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${BOOKING_STATUS_COLORS[b.status]}`}>{b.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-400">{timeAgo(b.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          {b.status === "PENDING" && (
                            <div className="flex gap-2">
                              <button className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {RECENT_INQUIRIES.map((inq) => (
                <div key={inq.id} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {inq.student[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{inq.student}</p>
                          <p className="text-xs text-slate-400">{inq.pg} · {timeAgo(inq.createdAt)}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${inq.status === "OPEN" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm p-3 bg-slate-50 rounded-xl">{inq.message}</p>
                      {inq.status === "OPEN" && (
                        <div className="mt-3 flex gap-2">
                          <input type="text" placeholder="Type your reply..." className="flex-1 input-premium text-sm py-2.5" />
                          <button className="btn-primary text-sm px-5 py-2.5">Reply</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-2xl p-12 shadow-card border border-slate-100 text-center">
              <BarChart2 className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Analytics Dashboard</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Detailed analytics with charts will be shown here. Connect to your database to see live data.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add PG Modal */}
      <AnimatePresence>
        {addPgOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget && !createLoading) setAddPgOpen(false); }}
          >
            <div className="min-h-full flex items-start justify-center p-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900">List Your PG Details</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Fill in property information, curfew, and amenities</p>
                </div>
                {!createLoading && (
                  <button onClick={() => setAddPgOpen(false)} className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-300 transition-colors flex-shrink-0 ml-3">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleAddPG} className="p-5 sm:p-6 space-y-6">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b pb-1.5"><Info className="w-4 h-4" /> Basic Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">PG Listing Name *</label>
                      <input 
                        type="text" required placeholder="e.g. Sunrise Premium PG" 
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Area / Locality *</label>
                      <input 
                        type="text" required placeholder="e.g. Kothrud" 
                        value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Address *</label>
                    <input 
                      type="text" required placeholder="Street address, landmark details" 
                      value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} 
                      className="input-premium py-2 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">PG Description *</label>
                    <textarea 
                      required placeholder="Write details about the PG, cleanrooms, environment, house rules..." 
                      rows={3}
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} 
                      className="input-premium py-2 text-sm w-full outline-none" 
                    />
                  </div>
                </div>

                {/* 2. Room & Pricing */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b pb-1.5"><Tag className="w-4 h-4" /> Pricing & Rooms</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Min Monthly Rent *</label>
                      <input 
                        type="number" required placeholder="₹ Min (e.g. 6000)" 
                        value={form.minRent} onChange={(e) => setForm({ ...form, minRent: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Max Monthly Rent *</label>
                      <input 
                        type="number" required placeholder="₹ Max (e.g. 12000)" 
                        value={form.maxRent} onChange={(e) => setForm({ ...form, maxRent: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Security Deposit</label>
                      <input 
                        type="number" placeholder="₹ Deposit (e.g. 5000)" 
                        value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Gender Limit *</label>
                      <select 
                        value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="input-premium py-2 text-sm text-slate-700 border border-slate-200 outline-none"
                      >
                        <option value="ANY">Co-ed / Any</option>
                        <option value="MALE">Boys Only</option>
                        <option value="FEMALE">Girls Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Total Rooms</label>
                      <input 
                        type="number" placeholder="5" 
                        value={form.totalRooms} onChange={(e) => setForm({ ...form, totalRooms: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Available Rooms</label>
                      <input 
                        type="number" placeholder="3" 
                        value={form.availableRooms} onChange={(e) => setForm({ ...form, availableRooms: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Media & Policies */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b pb-1.5"><MapPin className="w-4 h-4" /> Media & Policies</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Cover Image URL</label>
                      <input 
                        type="url" placeholder="https://images.unsplash.com/..." 
                        value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Curfew Time (e.g. 10:30 PM)</label>
                      <input 
                        type="text" placeholder="10:00 PM" 
                        value={form.curfewTime} onChange={(e) => setForm({ ...form, curfewTime: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone *</label>
                      <input 
                        type="text" required placeholder="e.g. +91 9876543210" 
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">WhatsApp Number *</label>
                      <input 
                        type="text" required placeholder="e.g. +91 9876543210" 
                        value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} 
                        className="input-premium py-2 text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">More Image URLs (Comma-separated)</label>
                    <input 
                      type="text" placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2" 
                      value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} 
                      className="input-premium py-2 text-sm" 
                    />
                  </div>
                </div>

                {/* 4. Amenities Checklist */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b pb-1.5"><Shield className="w-4 h-4" /> Amenities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {[
                      { key: "hasWifi", label: "WiFi", icon: Wifi },
                      { key: "hasAC", label: "Air Conditioning", icon: Wind },
                      { key: "hasFood", label: "Food Provided", icon: Utensils },
                      { key: "hasParking", label: "Parking", icon: Car },
                      { key: "hasSecurity", label: "24x7 Warden", icon: ShieldAlert },
                      { key: "hasPowerBackup", label: "Power Backup", icon: Zap },
                      { key: "hasCCTV", label: "CCTV", icon: Camera },
                      { key: "hasGym", label: "In-house Gym", icon: Dumbbell },
                      { key: "hasAttachedBath", label: "Attached Bath", icon: Bath },
                      { key: "hasHotWater", label: "Geyser/Hot Water", icon: Droplets },
                      { key: "hasTVRoom", label: "TV Room", icon: Tv },
                    ].map(({ key, label, icon: Icon }) => (
                      <label 
                        key={key} 
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:bg-white select-none ${
                          (form as any)[key] ? "bg-white border-blue-200 text-blue-700 shadow-sm" : "border-slate-200 text-slate-500 bg-transparent"
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                          className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 pb-1 border-t flex gap-3">
                  <button 
                    type="button" 
                    disabled={createLoading}
                    onClick={() => setAddPgOpen(false)}
                    className="flex-1 btn-secondary py-3 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={createLoading}
                    className="flex-[2] btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    {createLoading ? (
                      <><Clock className="w-4 h-4 animate-spin" /> Adding Property...</>
                    ) : (
                      "Publish PG Listing"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
