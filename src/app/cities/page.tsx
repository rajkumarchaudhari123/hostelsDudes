import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse PGs by City – Hostel Dudes",
  description: "Find verified PG accommodations in Noida and Greater Noida.",
};

const ALL_CITIES = [
  { name: "Noida", slug: "noida", state: "Uttar Pradesh", pgCount: 12, image: "https://images.unsplash.com/photo-1661858435242-ed971767e954?q=80&w=661&auto=format&fit=crop" },
  { name: "Greater Noida", slug: "greater-noida", state: "Uttar Pradesh", pgCount: 8, image: "https://images.unsplash.com/photo-1709015653284-1c121cf92ddf?q=80&w=1228&auto=format&fit=crop" },
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
            <p className="text-white/70 text-lg mb-8">Verified PGs across Noida and Greater Noida</p>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg max-w-md mx-auto">
              <Search className="w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search for a city..." className="flex-1 outline-none text-slate-700 bg-transparent text-sm" />
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
