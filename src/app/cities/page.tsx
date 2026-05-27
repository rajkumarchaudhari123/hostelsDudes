import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse PGs by City – Hostel Dudes",
  description: "Find verified PG accommodations in 80+ cities across India.",
};

const ALL_CITIES = [
  { name: "Pune", slug: "pune", state: "Maharashtra", pgCount: 2840, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=60" },
  { name: "Bangalore", slug: "bangalore", state: "Karnataka", pgCount: 4120, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=60" },
  { name: "Mumbai", slug: "mumbai", state: "Maharashtra", pgCount: 3560, image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=60" },
  { name: "Delhi", slug: "delhi", state: "Delhi NCR", pgCount: 5230, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=60" },
  { name: "Hyderabad", slug: "hyderabad", state: "Telangana", pgCount: 2190, image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=60" },
  { name: "Chennai", slug: "chennai", state: "Tamil Nadu", pgCount: 1870, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=60" },
  { name: "Kolkata", slug: "kolkata", state: "West Bengal", pgCount: 1540, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=60" },
  { name: "Jaipur", slug: "jaipur", state: "Rajasthan", pgCount: 980, image: "https://images.unsplash.com/photo-1477587458883-47145ed68813?w=600&q=60" },
  { name: "Ahmedabad", slug: "ahmedabad", state: "Gujarat", pgCount: 1120, image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=600&q=60" },
  { name: "Bhopal", slug: "bhopal", state: "Madhya Pradesh", pgCount: 620, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=60" },
  { name: "Lucknow", slug: "lucknow", state: "Uttar Pradesh", pgCount: 840, image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=600&q=60" },
  { name: "Chandigarh", slug: "chandigarh", state: "Punjab", pgCount: 760, image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=60" },
];

export default function CitiesPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        {/* Header */}
        <section className="bg-hero-gradient py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="font-display font-bold text-5xl text-white mb-4">Find PGs by City</h1>
            <p className="text-white/70 text-lg mb-8">12,000+ verified PGs across 80+ cities in India</p>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg max-w-md mx-auto">
              <Search className="w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search for a city..." className="flex-1 outline-none text-slate-700 bg-transparent text-sm" />
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_CITIES.map((city) => (
              <Link key={city.slug} href={`/search?city=${city.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display font-bold text-white text-sm">{city.name}</h3>
                    <p className="text-white/60 text-xs">{city.state}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                      <span className="text-white/70 text-xs">{city.pgCount.toLocaleString()} PGs</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
