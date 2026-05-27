// StayNest - Global TypeScript Types

import { UserRole, Gender, RoomType, BookingStatus, PGStatus } from "@prisma/client";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type { UserRole };

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

// ─── PG ───────────────────────────────────────────────────────────────────────

export interface PGSummary {
  id: string;
  name: string;
  slug: string;
  address: string;
  area: string;
  city: { name: string; slug: string };
  gender: Gender;
  minRent: number;
  maxRent: number;
  rating: number;
  reviewCount: number;
  coverImage?: string | null;
  images: string[];
  verified: boolean;
  featured: boolean;
  status: PGStatus;
  hasWifi: boolean;
  hasAC: boolean;
  hasFood: boolean;
  hasParking: boolean;
  hasLaundry: boolean;
  hasSecurity: boolean;
  latitude: number;
  longitude: number;
  availableRooms: number;
  phone?: string | null;
  whatsapp?: string | null;
}

export interface PGDetail extends PGSummary {
  description: string;
  deposit?: number | null;
  noticePeriod?: number | null;
  curfewTime?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  totalRooms: number;
  hasPowerBackup: boolean;
  hasCCTV: boolean;
  hasGym: boolean;
  hasAttachedBath: boolean;
  hasHotWater: boolean;
  hasTVRoom: boolean;
  rooms: RoomSummary[];
  reviews: ReviewSummary[];
  colleges: CollegeDistance[];
  foodMenu: FoodMenuDay[];
  owner: OwnerInfo;
}

// ─── Room ─────────────────────────────────────────────────────────────────────

export interface RoomSummary {
  id: string;
  type: RoomType;
  rent: number;
  deposit?: number | null;
  totalBeds: number;
  availBeds: number;
  floor?: number | null;
  images: string[];
  description?: string | null;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface ReviewSummary {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: string;
  user: { name?: string | null; image?: string | null };
}

// ─── College ──────────────────────────────────────────────────────────────────

export interface CollegeDistance {
  college: { id: string; name: string; slug: string };
  distance: number;
  travelTime?: number | null;
}

// ─── Food ─────────────────────────────────────────────────────────────────────

export interface FoodMenuDay {
  day: string;
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
  snacks?: string | null;
}

// ─── Owner ────────────────────────────────────────────────────────────────────

export interface OwnerInfo {
  id: string;
  adminId: string;
  user: { name?: string | null; image?: string | null; phone?: string | null };
}

// ─── City ─────────────────────────────────────────────────────────────────────

export interface CitySummary {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  pgCount: number;
  isPopular: boolean;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchFilters {
  city?: string;
  area?: string;
  college?: string;
  gender?: Gender | "ANY";
  minRent?: number;
  maxRent?: number;
  hasWifi?: boolean;
  hasAC?: boolean;
  hasFood?: boolean;
  hasParking?: boolean;
  hasLaundry?: boolean;
  hasSecurity?: boolean;
  hasPowerBackup?: boolean;
  hasAttachedBath?: boolean;
  roomType?: RoomType;
  maxDistance?: number;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "distance" | "newest";
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface BookingWithDetails {
  id: string;
  status: BookingStatus;
  checkInDate: string;
  checkOutDate?: string | null;
  rent: number;
  deposit?: number | null;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  pg: { name: string; slug: string; coverImage?: string | null; address: string };
  room?: { type: RoomType } | null;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface OwnerStats {
  totalPGs: number;
  activePGs: number;
  totalBookings: number;
  pendingBookings: number;
  totalInquiries: number;
  monthlyRevenue: number;
  totalReviews: number;
  avgRating: number;
}

export interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  totalPGs: number;
  pendingApprovals: number;
  totalBookings: number;
  totalRevenue: number;
  activeStudents: number;
  newUsersThisMonth: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
