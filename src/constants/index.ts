export const APP_NAME = "Hostel Dudes";
export const APP_TAGLINE = "Find Your Perfect PG Near College";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const AMENITIES = [
  { key: "hasWifi", label: "WiFi", icon: "Wifi" },
  { key: "hasAC", label: "AC", icon: "Wind" },
  { key: "hasFood", label: "Food", icon: "UtensilsCrossed" },
  { key: "hasParking", label: "Parking", icon: "Car" },
  { key: "hasLaundry", label: "Laundry", icon: "WashingMachine" },
  { key: "hasSecurity", label: "Security", icon: "Shield" },
  { key: "hasPowerBackup", label: "Power Backup", icon: "Zap" },
  { key: "hasCCTV", label: "CCTV", icon: "Camera" },
  { key: "hasGym", label: "Gym", icon: "Dumbbell" },
  { key: "hasAttachedBath", label: "Attached Bath", icon: "Bath" },
  { key: "hasHotWater", label: "Hot Water", icon: "Droplets" },
  { key: "hasTVRoom", label: "TV Room", icon: "Tv" },
] as const;

export const GENDER_OPTIONS = [
  { value: "ANY", label: "Co-ed / Any" },
  { value: "MALE", label: "Boys PG" },
  { value: "FEMALE", label: "Girls PG" },
] as const;

export const ROOM_TYPES = [
  { value: "SINGLE", label: "Single Sharing" },
  { value: "DOUBLE", label: "Double Sharing" },
  { value: "TRIPLE", label: "Triple Sharing" },
  { value: "DORMITORY", label: "Dormitory" },
] as const;

export const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "distance", label: "Distance" },
  { value: "newest", label: "Newest" },
] as const;

export const RENT_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹8,000", min: 5000, max: 8000 },
  { label: "₹8,000 – ₹12,000", min: 8000, max: 12000 },
  { label: "₹12,000 – ₹18,000", min: 12000, max: 18000 },
  { label: "₹18,000+", min: 18000, max: 100000 },
] as const;

export const POPULAR_CITIES = [
  { name: "Noida", slug: "noida", image: "https://images.unsplash.com/photo-1587907869105-a8597c91d76b?w=600&q=60" },
  { name: "Greater Noida", slug: "greater-noida", image: "https://images.unsplash.com/photo-1596276122653-651a3898309f?w=600&q=60" },
] as const;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-gray-100 text-gray-800",
};

export const PG_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-orange-100 text-orange-800",
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    college: "Amity University, Noida",
    text: "Found my perfect PG within 2 days of searching on Hostel Dudes. The verified listings gave me confidence, and the map feature helped me choose one that was just 5 mins from college!",
    rating: 5,
    avatar: "/testimonials/priya.jpg",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    college: "Sharda University, Greater Noida",
    text: "The filter system is incredible — I could filter by food, AC, budget, and gender all at once. Saved me hours of searching. Highly recommend to every student!",
    rating: 5,
    avatar: "/testimonials/rohan.jpg",
  },
  {
    id: 3,
    name: "Anjali Nair",
    college: "Galgotias University, Greater Noida",
    text: "The owner was super responsive through the chat feature. I scheduled a visit directly from the app and moved in within a week. Hostel Dudes made the whole process seamless.",
    rating: 5,
    avatar: "/testimonials/anjali.jpg",
  },
];

export const FAQS = [
  {
    q: "How do I search for PGs near my college?",
    a: "Simply enter your college name or area in the search bar on the homepage. Hostel Dudes will show all verified PGs nearby with distance, price, and amenity filters.",
  },
  {
    q: "Are the listings verified?",
    a: "Yes! Our team physically verifies PG listings before displaying them. Verified badges are shown on all genuine listings.",
  },
  {
    q: "Can I directly contact the PG owner?",
    a: "Absolutely. You can call, WhatsApp, or use our in-app chat feature to directly connect with the PG owner.",
  },
  {
    q: "Is Hostel Dudes free for students?",
    a: "Yes, searching and booking inquiries are completely free for students. We charge a small service fee only upon confirmed bookings.",
  },
  {
    q: "How do I list my PG on Hostel Dudes?",
    a: "PG owners can register or contact our admin team. We'll verify your property and create your owner dashboard to manage listings and bookings.",
  },
  {
    q: "Can I visit the PG before booking?",
    a: "Yes, you can schedule a visit directly from the PG details page. The owner will confirm a suitable time for you.",
  },
];
