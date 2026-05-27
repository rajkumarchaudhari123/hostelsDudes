import fs from "fs";
import path from "path";

// Paths for JSON storage files in src/data/
const DATA_DIR = path.join(process.cwd(), "src", "data");
const OWNERS_FILE = path.join(DATA_DIR, "custom_owners.json");
const PGS_FILE = path.join(DATA_DIR, "custom_pgs.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export interface CustomOwner {
  id: string;
  adminId: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Stored in plain text for demo auth
  pgCount: number;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  joinedAt: string;
}

export interface CustomPG {
  id: string;
  ownerId: string; // adminId or email of owner
  cityId: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  area: string;
  latitude: number;
  longitude: number;
  gender: "MALE" | "FEMALE" | "ANY";
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  featured: boolean;
  verified: boolean;
  images: string[];
  coverImage: string;
  minRent: number;
  maxRent: number;
  deposit?: number;
  noticePeriod?: number;
  curfewTime?: string;
  totalRooms: number;
  availableRooms: number;
  rating: number;
  reviewCount: number;
  phone?: string;
  whatsapp?: string;
  hasWifi: boolean;
  hasAC: boolean;
  hasFood: boolean;
  hasParking: boolean;
  hasLaundry: boolean;
  hasSecurity: boolean;
  hasPowerBackup: boolean;
  hasCCTV: boolean;
  hasGym: boolean;
  hasAttachedBath: boolean;
  hasHotWater: boolean;
  hasTVRoom: boolean;
}

// ─── Owner Storage ────────────────────────────────────────────────────────────

export function getCustomOwners(): CustomOwner[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(OWNERS_FILE)) {
      fs.writeFileSync(OWNERS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(OWNERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read custom owners:", error);
    return [];
  }
}

export function saveCustomOwners(owners: CustomOwner[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners, null, 2));
  } catch (error) {
    console.error("Failed to save custom owners:", error);
  }
}

export function addCustomOwner(owner: CustomOwner) {
  const owners = getCustomOwners();
  // Avoid duplicate emails
  if (owners.some(o => o.email.toLowerCase() === owner.email.toLowerCase())) {
    return false;
  }
  owners.push(owner);
  saveCustomOwners(owners);
  return true;
}

// ─── PG Storage ───────────────────────────────────────────────────────────────

export function getCustomPGs(): CustomPG[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(PGS_FILE)) {
      fs.writeFileSync(PGS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(PGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read custom PGs:", error);
    return [];
  }
}

export function saveCustomPGs(pgs: CustomPG[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(PGS_FILE, JSON.stringify(pgs, null, 2));
  } catch (error) {
    console.error("Failed to save custom PGs:", error);
  }
}

export function addCustomPG(pg: CustomPG) {
  const pgs = getCustomPGs();
  pgs.push(pg);
  saveCustomPGs(pgs);
  return true;
}
