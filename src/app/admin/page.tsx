"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Building2, ShieldCheck, Bell,
  TrendingUp, Plus, Search, Filter, MoreVertical, Check,
  X, Eye, Edit, Trash2, AlertTriangle, Key, RefreshCw,
  LogOut, ChevronDown, DollarSign, Star, Clock, Settings,
  UserPlus, Mail, Phone, Lock, Copy, CheckCircle2, Loader2,
  GraduationCap, Home, Activity, ChevronRight, Menu
} from "lucide-react";
import { formatPrice, generateAdminId, timeAgo } from "@/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TabType = "overview" | "owners" | "students" | "pgs" | "approvals";
type ModalType = "owner" | "student" | null;

// ─── Demo stats ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Students", value: "52,840", change: "+12%", icon: GraduationCap, color: "#6366f1" },
  { label: "PG Owners", value: "3,214", change: "+8%", icon: Building2, color: "#0ea5e9" },
  { label: "Total PGs", value: "12,450", change: "+15%", icon: Home, color: "#10b981" },
  { label: "Pending Approvals", value: "47", change: "-3", icon: Clock, color: "#f59e0b" },
  { label: "Monthly Revenue", value: "₹8.4L", change: "+22%", icon: DollarSign, color: "#ec4899" },
  { label: "Avg PG Rating", value: "4.7★", change: "+0.1", icon: Star, color: "#f97316" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 420000 },
  { month: "Feb", revenue: 510000 },
  { month: "Mar", revenue: 480000 },
  { month: "Apr", revenue: 620000 },
  { month: "May", revenue: 590000 },
  { month: "Jun", revenue: 710000 },
  { month: "Jul", revenue: 840000 },
];

const PENDING_PGS = [
  { id: "pg1", name: "Green Valley PG", owner: "Rajesh Mehta", city: "Pune", area: "Wakad", submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), rent: 7500 },
  { id: "pg2", name: "Sunrise Boys PG", owner: "Vikram Singh", city: "Bangalore", area: "Koramangala", submittedAt: new Date(Date.now() - 86400000).toISOString(), rent: 9000 },
  { id: "pg3", name: "Pearl Girls Hostel", owner: "Sunita Khanna", city: "Mumbai", area: "Andheri", submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(), rent: 12000 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 9, gradient = "from-blue-400 to-indigo-500" }: { name: string; size?: number; gradient?: string }) {
  return (
    <div className={`w-${size} h-${size} bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    SUSPENDED: "bg-red-100 text-red-700",
    DELETED: "bg-slate-100 text-slate-500",
    PENDING: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors[status] || colors.ACTIVE}`}>
      {status}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState<ModalType>(null);

  // Owner state
  const [owners, setOwners] = useState<any[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [searchOwner, setSearchOwner] = useState("");
  const [newOwner, setNewOwner] = useState({ name: "", email: "", phone: "" });
  const [ownerCreds, setOwnerCreds] = useState<{ adminId: string; email: string; password: string } | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Student state
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", email: "", phone: "", password: "" });
  const [studentCreds, setStudentCreds] = useState<{ email: string; password: string; name: string } | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.revenue));

  // ─── Fetch owners ────────────────────────────────────────────────────────────
  const fetchOwners = async () => {
    setOwnersLoading(true);
    try {
      const res = await fetch("/api/owners");
      const data = await res.json();
      if (data.success && data.data) {
        setOwners(
          data.data.map((item: any) => ({
            id: item.id,
            adminId: item.adminId,
            name: item.user?.name || item.name || "—",
            email: item.user?.email || item.email || "—",
            phone: item.user?.phone || item.phone || "—",
            pgCount: item._count?.pgs || 0,
            status: item.status || "ACTIVE",
            joinedAt: item.createdAt || new Date().toISOString(),
          }))
        );
      }
    } catch (e) {
      console.error("Failed to fetch owners", e);
    } finally {
      setOwnersLoading(false);
    }
  };

  // ─── Fetch students ──────────────────────────────────────────────────────────
  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success && data.data) {
        setStudents(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch students", e);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => { fetchOwners(); fetchStudents(); }, []);

  // ─── Create Owner ────────────────────────────────────────────────────────────
  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerLoading(true);
    try {
      const res = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOwner),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOwnerCreds({ adminId: data.data.adminId, email: data.data.email, password: data.data.password });
        fetchOwners();
      } else {
        alert(data.error || "Failed to create owner account");
      }
    } catch (e) {
      alert("Connection error. Please try again.");
    } finally {
      setOwnerLoading(false);
    }
  };

  // ─── Create Student ──────────────────────────────────────────────────────────
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStudentCreds({ name: data.data.name, email: data.data.email, password: data.data.password });
        fetchStudents();
      } else {
        alert(data.error || "Failed to create student account");
      }
    } catch (e) {
      alert("Connection error. Please try again.");
    } finally {
      setStudentLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openCreateModal = (type: ModalType) => {
    setOpenModal(type);
    setOwnerCreds(null);
    setStudentCreds(null);
    setNewOwner({ name: "", email: "", phone: "" });
    setNewStudent({ name: "", email: "", phone: "", password: "" });
  };

  const filteredOwners = owners.filter((o) =>
    [o.name, o.email, o.adminId].some((v) => v?.toLowerCase().includes(searchOwner.toLowerCase()))
  );
  const filteredStudents = students.filter((s) =>
    [s.name, s.email].some((v) => v?.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  // ─── Sidebar nav ─────────────────────────────────────────────────────────────
  const NAV_ITEMS: { tab: TabType; icon: React.ElementType; label: string; badge?: number }[] = [
    { tab: "overview", icon: LayoutDashboard, label: "Overview" },
    { tab: "owners", icon: Building2, label: "PG Owners", badge: owners.length || undefined },
    { tab: "students", icon: GraduationCap, label: "Students", badge: students.length || undefined },
    { tab: "pgs", icon: Home, label: "All PGs" },
    { tab: "approvals", icon: ShieldCheck, label: "Approvals", badge: PENDING_PGS.length },
  ];

  // ─── Page titles ──────────────────────────────────────────────────────────────
  const pageTitles: Record<TabType, string> = {
    overview: "Dashboard Overview",
    owners: "PG Owner Management",
    students: "Student Management",
    pgs: "All PG Listings",
    approvals: "Pending Approvals",
  };

  const navClick = (tab: TabType) => { setActiveTab(tab); setSidebarOpen(false); };

  return (
    <div className="min-h-screen flex" style={{ background: "#f1f5f9" }}>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)" }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-tight">Hostel Dudes</p>
              <p className="text-slate-400 text-xs">Super Admin</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>SA</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold">Super Admin</p>
              <p className="text-slate-400 text-xs truncate">admin@hostelsdudes.in</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ tab, icon: Icon, label, badge }) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                id={`admin-nav-${tab}`}
                onClick={() => navClick(tab)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  color: active ? "#fff" : "#94a3b8",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                {badge !== undefined && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", color: active ? "#fff" : "#cbd5e1" }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-xl text-slate-900 truncate">{pageTitles[activeTab]}</h1>
              <p className="text-slate-400 text-xs mt-0.5 hidden sm:block">Hostel Dudes Super Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {activeTab === "owners" && (
              <button
                id="create-owner-btn"
                onClick={() => openCreateModal("owner")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Owner</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            {activeTab === "students" && (
              <button
                id="create-student-btn"
                onClick={() => openCreateModal("student")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Create Student</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-slate-200 flex shadow-lg">
          {NAV_ITEMS.map(({ tab, icon: Icon, label, badge }) => (
            <button key={tab} onClick={() => navClick(tab)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[9px] sm:text-[10px] font-semibold transition-colors ${
                activeTab === tab ? "text-indigo-600" : "text-slate-400"
              }`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">{badge > 9 ? "9+" : badge}</span>
                )}
              </div>
              <span className="truncate w-full text-center px-1">{label.replace("PG ","").replace(" Management","")}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">

          {/* ══ OVERVIEW TAB ══════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                {STATS.map(({ label, value, change, icon: Icon, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + "1a" }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <p className="font-bold text-xl text-slate-900">{value}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{label}</p>
                    <p className={`text-xs font-semibold mt-1.5 ${change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                      {change} this month
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Revenue chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Revenue Overview</h3>
                    <p className="text-slate-400 text-sm">Monthly revenue from bookings &amp; services</p>
                  </div>
                  <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-600">
                    <option>Last 7 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div className="flex items-end gap-3 h-48">
                  {REVENUE_DATA.map(({ month, revenue }, i) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">{formatPrice(revenue, true)}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(revenue / maxRevenue) * 100}%` }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="w-full rounded-t-xl"
                        style={{ background: i === REVENUE_DATA.length - 1 ? "#6366f1" : "#e0e7ff" }}
                      />
                      <span className="text-xs text-slate-400">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick action cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quick create owner */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg text-slate-900">Recent PG Owners</h3>
                    <button onClick={() => setActiveTab("owners")} className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  {owners.length === 0 ? (
                    <div className="text-center py-6">
                      <Building2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No owners yet</p>
                      <button onClick={() => { setActiveTab("owners"); openCreateModal("owner"); }} className="mt-3 text-xs text-indigo-600 font-semibold hover:underline">+ Create first owner</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {owners.slice(0, 4).map((owner) => (
                        <div key={owner.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Avatar name={owner.name} gradient="from-indigo-400 to-blue-500" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{owner.name}</p>
                              <p className="text-xs text-slate-400">{owner.adminId} · {owner.pgCount} PGs</p>
                            </div>
                          </div>
                          <StatusBadge status={owner.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Quick create student */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg text-slate-900">Recent Students</h3>
                    <button onClick={() => setActiveTab("students")} className="text-emerald-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  {students.length === 0 ? (
                    <div className="text-center py-6">
                      <GraduationCap className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No students created yet</p>
                      <button onClick={() => { setActiveTab("students"); openCreateModal("student"); }} className="mt-3 text-xs text-emerald-600 font-semibold hover:underline">+ Create first student</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {students.slice(0, 4).map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Avatar name={s.name} gradient="from-emerald-400 to-teal-500" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                          <StatusBadge status={s.status || "ACTIVE"} />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}

          {/* ══ OWNERS TAB ════════════════════════════════════════════════════ */}
          {activeTab === "owners" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    id="search-owners-input"
                    type="text"
                    placeholder="Search by name, email or Admin ID…"
                    value={searchOwner}
                    onChange={(e) => setSearchOwner(e.target.value)}
                    className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
                  />
                </div>
                <button onClick={fetchOwners} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-indigo-300 shadow-sm transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {ownersLoading ? (
                  <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading owners…</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["Owner", "Admin ID", "Contact", "PGs", "Status", "Joined", "Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOwners.map((owner) => (
                          <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={owner.name} gradient="from-indigo-400 to-blue-500" />
                                <div>
                                  <p className="font-semibold text-sm text-slate-900">{owner.name}</p>
                                  <p className="text-xs text-slate-400">{owner.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{owner.adminId}</span>
                                <button onClick={() => copyToClipboard(owner.adminId, owner.id + "id")} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                  {copiedField === owner.id + "id" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4"><p className="text-sm text-slate-600">{owner.phone || "—"}</p></td>
                            <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-800">{owner.pgCount}</span></td>
                            <td className="px-6 py-4"><StatusBadge status={owner.status} /></td>
                            <td className="px-6 py-4"><span className="text-sm text-slate-500">{timeAgo(owner.joinedAt)}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                <button className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"><AlertTriangle className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setOwners((p) => p.filter((o) => o.id !== owner.id))} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOwners.length === 0 && (
                      <div className="text-center py-16">
                        <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No owners found</p>
                        <button onClick={() => openCreateModal("owner")} className="mt-3 text-sm text-indigo-600 font-semibold hover:underline">+ Create first owner</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ STUDENTS TAB ══════════════════════════════════════════════════ */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    id="search-students-input"
                    type="text"
                    placeholder="Search students by name or email…"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
                  />
                </div>
                <button onClick={fetchStudents} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-emerald-300 shadow-sm transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading students…</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["Student", "Email", "Phone", "Bookings", "Reviews", "Status", "Joined", "Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={s.name} gradient="from-emerald-400 to-teal-500" />
                                <p className="font-semibold text-sm text-slate-900">{s.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4"><p className="text-sm text-slate-600">{s.email}</p></td>
                            <td className="px-6 py-4"><p className="text-sm text-slate-600">{s.phone || "—"}</p></td>
                            <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-800">{s._count?.bookings ?? 0}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-800">{s._count?.reviews ?? 0}</span></td>
                            <td className="px-6 py-4"><StatusBadge status={s.status || "ACTIVE"} /></td>
                            <td className="px-6 py-4"><span className="text-sm text-slate-500">{timeAgo(s.createdAt)}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                <button className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"><AlertTriangle className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setStudents((p) => p.filter((x) => x.id !== s.id))} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                      <div className="text-center py-16">
                        <GraduationCap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No students found</p>
                        <button onClick={() => openCreateModal("student")} className="mt-3 text-sm text-emerald-600 font-semibold hover:underline">+ Create first student</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ APPROVALS TAB ═════════════════════════════════════════════════ */}
          {activeTab === "approvals" && (
            <div className="space-y-4">
              <p className="text-slate-500 text-sm">{PENDING_PGS.length} PG listings waiting for approval</p>
              {PENDING_PGS.map((pg) => (
                <motion.div
                  key={pg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-900">{pg.name}</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">Pending Review</span>
                      </div>
                      <p className="text-slate-500 text-sm">Owner: <span className="font-semibold text-slate-700">{pg.owner}</span></p>
                      <p className="text-slate-500 text-sm">{pg.area}, {pg.city} · Rent: <span className="font-semibold text-indigo-600">{formatPrice(pg.rent)}/mo</span></p>
                      <p className="text-slate-400 text-xs mt-2">Submitted {timeAgo(pg.submittedAt)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"><Check className="w-4 h-4" /> Approve</button>
                      <button className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"><X className="w-4 h-4" /> Reject</button>
                      <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"><Eye className="w-4 h-4" /> Preview</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ══ PGS TAB ═══════════════════════════════════════════════════════ */}
          {activeTab === "pgs" && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">PG Listings Management</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">All active and pending PG listings will appear here from the database.</p>
            </div>
          )}

        </div>
      </main>

      {/* ══ MODALS ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {openModal && (
          <>
            {/* Scrollable overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto px-4 py-8"
              onClick={(e) => { if (e.target === e.currentTarget && !ownerLoading && !studentLoading) setOpenModal(null); }}
            >
            {/* Modal panel — sits inside scrollable backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg mx-auto my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100" style={{ background: openModal === "owner" ? "linear-gradient(135deg,#eef2ff,#f5f3ff)" : "linear-gradient(135deg,#ecfdf5,#f0fdf4)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: openModal === "owner" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#10b981,#059669)" }}>
                    {openModal === "owner" ? <Building2 className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{openModal === "owner" ? "Create PG Owner Account" : "Create Student Account"}</h3>
                    <p className="text-slate-500 text-sm">Credentials generated automatically</p>
                  </div>
                </div>
                {!ownerLoading && !studentLoading && (
                  <button onClick={() => setOpenModal(null)} className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-300 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-6">
                {/* ─── Owner creation form ─────────────────────────────────── */}
                {openModal === "owner" && !ownerCreds && (
                  <form onSubmit={handleCreateOwner} className="space-y-4">
                    {[
                      { label: "Owner Full Name *", key: "name", type: "text", placeholder: "e.g. Rajkumar Sharma", icon: Users },
                      { label: "Email Address *", key: "email", type: "email", placeholder: "owner@example.com", icon: Mail },
                      { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX", icon: Phone },
                    ].map(({ label, key, type, placeholder, icon: Icon }) => (
                      <div key={key}>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id={`owner-${key}-input`}
                            type={type}
                            required={label.includes("*")}
                            placeholder={placeholder}
                            value={(newOwner as any)[key]}
                            onChange={(e) => setNewOwner({ ...newOwner, [key]: e.target.value })}
                            className="input-premium pl-11"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <p className="text-xs text-indigo-700 font-semibold mb-1">🔐 Auto-generated credentials</p>
                      <p className="text-xs text-indigo-600">A unique Admin ID and secure password will be created. Share with the owner securely.</p>
                    </div>
                    <button type="submit" id="submit-create-owner" disabled={ownerLoading} className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                      {ownerLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : <><UserPlus className="w-4 h-4" /> Create Owner Account</>}
                    </button>
                  </form>
                )}

                {/* ─── Student creation form ───────────────────────────────── */}
                {openModal === "student" && !studentCreds && (
                  <form onSubmit={handleCreateStudent} className="space-y-4">
                    {[
                      { label: "Student Full Name *", key: "name", type: "text", placeholder: "e.g. Priya Verma", icon: Users },
                      { label: "Email Address *", key: "email", type: "email", placeholder: "student@example.com", icon: Mail },
                      { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX", icon: Phone },
                      { label: "Custom Password (optional)", key: "password", type: "text", placeholder: "Leave blank to auto-generate", icon: Lock },
                    ].map(({ label, key, type, placeholder, icon: Icon }) => (
                      <div key={key}>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id={`student-${key}-input`}
                            type={type}
                            required={label.includes("*")}
                            placeholder={placeholder}
                            value={(newStudent as any)[key]}
                            onChange={(e) => setNewStudent({ ...newStudent, [key]: e.target.value })}
                            className="input-premium pl-11"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <p className="text-xs text-emerald-700 font-semibold mb-1">🎓 Student Account</p>
                      <p className="text-xs text-emerald-600">Student can log in and browse/book PG listings immediately after creation.</p>
                    </div>
                    <button type="submit" id="submit-create-student" disabled={studentLoading} className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                      {studentLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : <><GraduationCap className="w-4 h-4" /> Create Student Account</>}
                    </button>
                  </form>
                )}

                {/* ─── Success screen (shared) ─────────────────────────────── */}
                {(ownerCreds || studentCreds) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="text-center py-3">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      </div>
                      <h4 className="font-bold text-xl text-slate-900">Account Created!</h4>
                      <p className="text-slate-500 text-sm mt-1">Share these credentials with the {openModal === "owner" ? "PG owner" : "student"}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-200">
                      {openModal === "owner" && ownerCreds && [
                        { label: "Admin ID", value: ownerCreds.adminId, field: "adminId" },
                        { label: "Email", value: ownerCreds.email, field: "email" },
                        { label: "Password", value: ownerCreds.password, field: "password" },
                      ].map(({ label, value, field }) => (
                        <div key={field} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-sm font-mono font-bold text-slate-800">{value}</p>
                          </div>
                          <button onClick={() => copyToClipboard(value, field)} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                            {copiedField === field ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                      {openModal === "student" && studentCreds && [
                        { label: "Name", value: studentCreds.name, field: "sname" },
                        { label: "Email", value: studentCreds.email, field: "semail" },
                        { label: "Password", value: studentCreds.password, field: "spassword" },
                      ].map(({ label, value, field }) => (
                        <div key={field} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-sm font-mono font-bold text-slate-800">{value}</p>
                          </div>
                          <button onClick={() => copyToClipboard(value, field)} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors">
                            {copiedField === field ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                      <p className="text-xs text-yellow-700">⚠️ Save these credentials now. The password cannot be recovered later. Share securely.</p>
                    </div>

                    <button onClick={() => setOpenModal(null)} className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                      Done
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
