"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard, Heart, BookOpen, MessageSquare,
  Bell, LogOut, Search, Star, MapPin, Calendar,
  ChevronRight, Settings, User, Clock, CheckCircle2,
  XCircle, Eye, Phone, MessageCircle, Home
} from "lucide-react";
import { formatPrice, timeAgo } from "@/utils";
import { BOOKING_STATUS_COLORS } from "@/constants";

const SAVED_PGS = [
  { id: "1", name: "Sunrise PG for Girls", area: "Kothrud, Pune", rent: 8500, rating: 4.8, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60", verified: true, hasFood: true, hasAC: true },
  { id: "2", name: "Pearl Girls Hostel", area: "Deccan, Pune", rent: 12000, rating: 4.9, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=60", verified: true, hasFood: true, hasAC: true },
  { id: "3", name: "Green Valley PG", area: "Baner, Pune", rent: 7000, rating: 4.5, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=60", verified: false, hasFood: false, hasAC: false },
];

const MY_BOOKINGS = [
  { id: "b1", pg: "Sunrise PG for Girls", area: "Kothrud, Pune", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60", roomType: "Single", status: "CONFIRMED", checkIn: "2026-06-01", amount: 12000, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "b2", pg: "Comfort Boys PG", area: "Shivajinagar, Pune", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=60", roomType: "Double", status: "PENDING", checkIn: "2026-06-10", amount: 9000, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "b3", pg: "BlueBell PG", area: "Aundh, Pune", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=60", roomType: "Triple", status: "COMPLETED", checkIn: "2026-03-01", amount: 7500, createdAt: new Date(Date.now() - 90 * 86400000).toISOString() },
];

const MY_INQUIRIES = [
  { id: "i1", pg: "Sunrise PG for Girls", message: "Hi, I'm interested in a single room from June 1st.", status: "RESPONDED", response: "Hi! Yes, we have 2 single rooms available from June 1st. Rent is ₹12,000/month. Please schedule a visit!", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "i2", pg: "Pearl Girls Hostel", message: "What is the curfew timing and are visitors allowed?", status: "OPEN", response: null, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const NOTIFICATIONS = [
  { id: "n1", type: "BOOKING", title: "Booking Confirmed!", message: "Your booking at Sunrise PG for Girls has been confirmed.", time: new Date(Date.now() - 2 * 3600000).toISOString(), read: false },
  { id: "n2", type: "INQUIRY", title: "Inquiry Replied", message: "The owner of Sunrise PG replied to your inquiry.", time: new Date(Date.now() - 4 * 3600000).toISOString(), read: false },
  { id: "n3", type: "SYSTEM", title: "Profile Incomplete", message: "Complete your profile to get better PG recommendations.", time: new Date(Date.now() - 1 * 86400000).toISOString(), read: true },
];

type Tab = "overview" | "saved" | "bookings" | "inquiries" | "notifications";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [savedPGs, setSavedPGs] = useState(SAVED_PGS);

  const NAV = [
    { tab: "overview" as Tab, icon: LayoutDashboard, label: "Overview" },
    { tab: "saved" as Tab, icon: Heart, label: "Saved PGs", badge: savedPGs.length },
    { tab: "bookings" as Tab, icon: BookOpen, label: "My Bookings", badge: MY_BOOKINGS.filter(b => b.status === "PENDING").length },
    { tab: "inquiries" as Tab, icon: MessageSquare, label: "Inquiries", badge: MY_INQUIRIES.filter(i => i.status === "OPEN").length },
    { tab: "notifications" as Tab, icon: Bell, label: "Notifications", badge: NOTIFICATIONS.filter(n => !n.read).length },
  ];

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-sm">StayNest</p>
              <p className="text-slate-400 text-xs">Student Portal</p>
            </div>
          </Link>
        </div>

        {/* Student profile */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-3 py-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-slate-800 text-sm font-semibold">Anjali Sharma</p>
              <p className="text-slate-400 text-xs">MIT College, Pune</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ tab, icon: Icon, label, badge }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${activeTab === tab ? "text-blue-600" : "text-slate-400"}`} />
                {label}
              </div>
              {badge !== undefined && badge > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-100">
          <Link href="/settings" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-sm transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 text-sm transition-colors">
            <User className="w-4 h-4" /> My Profile
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-display font-bold text-xl text-slate-900">
              {activeTab === "overview" ? "Welcome back, Anjali! 👋" :
               activeTab === "saved" ? "Saved PGs" :
               activeTab === "bookings" ? "My Bookings" :
               activeTab === "inquiries" ? "My Inquiries" : "Notifications"}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("notifications")}
              className="relative w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </button>
            <Link href="/search" className="btn-primary text-sm flex items-center gap-2 py-2.5">
              <Search className="w-4 h-4" />
              Find PG
            </Link>
          </div>
        </div>

        <div className="p-8">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Saved PGs", value: savedPGs.length.toString(), icon: Heart, color: "text-red-500", bg: "bg-red-50", tab: "saved" as Tab },
                  { label: "Active Bookings", value: MY_BOOKINGS.filter(b => b.status === "CONFIRMED").length.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", tab: "bookings" as Tab },
                  { label: "Pending Bookings", value: MY_BOOKINGS.filter(b => b.status === "PENDING").length.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-50", tab: "bookings" as Tab },
                  { label: "Open Inquiries", value: MY_INQUIRIES.filter(i => i.status === "OPEN").length.toString(), icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", tab: "inquiries" as Tab },
                ].map(({ label, value, icon: Icon, color, bg, tab }, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setActiveTab(tab)}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-left hover:shadow-card-hover transition-all"
                  >
                    <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="font-display font-bold text-2xl text-slate-900">{value}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                  </motion.button>
                ))}
              </div>

              {/* Current / recent booking */}
              {MY_BOOKINGS.filter(b => b.status === "CONFIRMED").length > 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                  <p className="text-blue-200 text-sm font-medium mb-1">Current Booking</p>
                  {MY_BOOKINGS.filter(b => b.status === "CONFIRMED").map(b => (
                    <div key={b.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={b.image} alt={b.pg} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" />
                        <div>
                          <h3 className="font-display font-bold text-xl">{b.pg}</h3>
                          <p className="text-blue-200 text-sm">{b.area}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-white/80 text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              Check-in: {b.checkIn}
                            </span>
                            <span className="text-white font-bold text-sm">{formatPrice(b.amount)}/mo</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/pg/sunrise-pg-girls-pune`} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Saved PGs preview */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-slate-900">Saved PGs</h3>
                    <button onClick={() => setActiveTab("saved")} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {savedPGs.slice(0, 3).map((pg) => (
                      <Link key={pg.id} href={`/pg/sunrise-pg-girls-pune`}>
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                          <img src={pg.image} alt={pg.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{pg.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <p className="text-xs text-slate-400 truncate">{pg.area}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-blue-600">{formatPrice(pg.rent, true)}<span className="text-slate-400 font-normal text-xs">/mo</span></p>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-semibold text-slate-600">{pg.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent bookings */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-slate-900">Booking History</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {MY_BOOKINGS.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={b.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{b.pg}</p>
                            <p className="text-xs text-slate-400">{b.roomType} · {b.checkIn}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${BOOKING_STATUS_COLORS[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SAVED PGs TAB */}
          {activeTab === "saved" && (
            <div className="space-y-5">
              {savedPGs.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 shadow-card border border-slate-100 text-center">
                  <Heart className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-2">No Saved PGs</h3>
                  <p className="text-slate-500 text-sm mb-6">Browse PGs and save the ones you like to compare later.</p>
                  <Link href="/search" className="btn-primary">Browse PGs</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {savedPGs.map((pg, i) => (
                    <motion.div
                      key={pg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden"
                    >
                      <div className="relative h-44">
                        <img src={pg.image} alt={pg.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setSavedPGs(prev => prev.filter(p => p.id !== pg.id))}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                        {pg.verified && (
                          <span className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold text-slate-900 mb-1">{pg.name}</h3>
                        <div className="flex items-center gap-1.5 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm text-slate-500">{pg.area}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {pg.hasFood && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">🍽️ Food</span>}
                          {pg.hasAC && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">❄️ AC</span>}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-lg font-display font-bold text-blue-600">{formatPrice(pg.rent, true)}</span>
                            <span className="text-slate-400 text-xs">/mo</span>
                          </div>
                          <Link href={`/pg/sunrise-pg-girls-pune`} className="btn-primary text-xs px-4 py-2">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {MY_BOOKINGS.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img src={b.image} alt={b.pg} className="w-full sm:w-28 h-44 sm:h-28 rounded-2xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display font-bold text-lg text-slate-900">{b.pg}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-sm text-slate-500">{b.area}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex-shrink-0 ${BOOKING_STATUS_COLORS[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-400">Room Type</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{b.roomType} Sharing</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Check-In Date</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{b.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Monthly Rent</p>
                          <p className="text-sm font-bold text-blue-600 mt-0.5">{formatPrice(b.amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Booked {timeAgo(b.createdAt)}</p>
                        <div className="flex gap-2">
                          <Link href={`/pg/sunrise-pg-girls-pune`} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">
                            <Eye className="w-3.5 h-3.5" /> View PG
                          </Link>
                          {b.status === "PENDING" && (
                            <button className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-500 hover:text-white transition-all">
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )}
                          {b.status === "COMPLETED" && (
                            <button className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 border border-yellow-100 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-yellow-500 hover:text-white transition-all">
                              <Star className="w-3.5 h-3.5" /> Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {MY_INQUIRIES.map((inq, i) => (
                <motion.div
                  key={inq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-slate-900">{inq.pg}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(inq.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1.5 rounded-full font-semibold ${inq.status === "OPEN" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {inq.status}
                    </span>
                  </div>

                  {/* Your message */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-3">
                    <p className="text-xs text-blue-500 font-semibold mb-1.5">Your Message</p>
                    <p className="text-sm text-slate-700">{inq.message}</p>
                  </div>

                  {/* Owner response */}
                  {inq.response ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <p className="text-xs text-green-600 font-semibold mb-1.5">Owner&apos;s Reply</p>
                      <p className="text-sm text-slate-700">{inq.response}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for owner&apos;s reply...</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              {NOTIFICATIONS.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white rounded-2xl p-5 shadow-card border transition-all ${notif.read ? "border-slate-100 opacity-70" : "border-blue-100 ring-1 ring-blue-50"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notif.type === "BOOKING" ? "bg-green-100 text-green-600" :
                      notif.type === "INQUIRY" ? "bg-blue-100 text-blue-600" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {notif.type === "BOOKING" ? <CheckCircle2 className="w-5 h-5" /> :
                       notif.type === "INQUIRY" ? <MessageSquare className="w-5 h-5" /> :
                       <Bell className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-slate-900 text-sm">{notif.title}</p>
                        <div className="flex items-center gap-2">
                          {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          <span className="text-xs text-slate-400">{timeAgo(notif.time)}</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">{notif.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
