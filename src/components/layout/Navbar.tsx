"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  Bell,
  LogOut,
  Settings,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Building2,
} from "lucide-react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Find PG" },
  { href: "/cities", label: "Cities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const isTransparent = false;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "SUPER_ADMIN") return "/admin";
    if (user.role === "PG_OWNER") return "/owner";
    return "/dashboard";
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-slate-100/80 backdrop-blur-md"
            : "bg-slate-100/95 backdrop-blur-xl border-b border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-blue-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span
                className={`font-display font-bold text-xl transition-colors ${
                  isTransparent ? "text-white" : "text-slate-900"
                }`}
              >
                Hostel<span className="text-blue-600"> Dudes</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/favorites"
                    className={`p-2 rounded-lg transition-all ${
                      isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/notifications"
                    className={`p-2 rounded-lg transition-all relative ${
                      isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                        isTransparent
                          ? "text-white/90 hover:bg-white/10"
                          : "text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-blue-sm">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium">{user.name?.split(" ")[0]}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_40px_rgba(15,23,42,0.12)] border border-slate-100 overflow-hidden"
                        >
                          <div className="p-3 border-b border-slate-100">
                            <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                          <div className="p-2">
                            <Link
                              href={getDashboardLink()}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                            {user.role === "SUPER_ADMIN" && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setProfileOpen(false)}
                              >
                                <Shield className="w-4 h-4" />
                                Admin Panel
                              </Link>
                            )}
                            <Link
                              href="/settings"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                            <form action="/api/auth/signout" method="post">
                              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-slate-700 hover:text-blue-600"
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary text-sm px-5 py-2.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isTransparent ? "text-white" : "text-slate-700"
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link href={getDashboardLink()} className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="btn-secondary text-center" onClick={() => setMobileOpen(false)}>
                        Log in
                      </Link>
                      <Link href="/signup" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for profile dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
