import type { Metadata } from "next";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Hostel Dudes",
  description: "Learn about Hostel Dudes – India's most trusted PG finder platform for students.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient py-24 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-sm font-semibold text-cyan-400 bg-white/10 px-4 py-2 rounded-full">
              Our Story
            </span>
            <h1 className="font-display font-bold text-5xl text-white mt-6 mb-4 leading-tight">
              We Make Finding PGs<br />Simple & Safe
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Hostel Dudes was founded by students who struggled to find safe, affordable PGs near college. We built the platform we wished existed.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Our Mission</span>
                <h2 className="font-display font-bold text-4xl text-slate-900 mt-4 mb-5 leading-tight">
                  Every Student Deserves a Safe & Comfortable Home
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Moving to a new city for college is exciting but stressful. Finding a trustworthy PG close to college, within budget, and with the right amenities can take weeks.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We built Hostel Dudes to solve this — a platform where students can find verified PGs in minutes, compare options, read real reviews, and book safely. For PG owners, we offer powerful tools to manage listings and bookings effortlessly.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "2021", label: "Founded" },
                  { value: "12,000+", label: "Verified PGs" },
                  { value: "50,000+", label: "Students Helped" },
                  { value: "80+", label: "Cities" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
                    <p className="font-display font-bold text-3xl text-blue-600">{value}</p>
                    <p className="text-slate-500 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display font-bold text-4xl text-slate-900">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "🔒", title: "Safety First", desc: "Every PG on our platform is physically verified by our team before going live. Safety of students is our top priority." },
                { emoji: "💡", title: "Transparency", desc: "No hidden costs, no fake reviews. Real photos, real prices, and honest information about every listing." },
                { emoji: "🤝", title: "Student-First", desc: "Everything we build is designed with students in mind — from search filters to booking flow to support." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-8 shadow-card border border-slate-100 text-center">
                  <div className="text-4xl mb-5">{emoji}</div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-4xl text-slate-900 mb-14">Built by Students, for Students</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Arjun Verma", role: "CEO & Co-founder", emoji: "👨‍💻" },
                { name: "Neha Sharma", role: "CTO & Co-founder", emoji: "👩‍💻" },
                { name: "Rahul Gupta", role: "Head of Product", emoji: "👨‍🎨" },
                { name: "Priya Nair", role: "Head of Ops", emoji: "👩‍💼" },
              ].map(({ name, role, emoji }) => (
                <div key={name} className="bg-slate-50 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">{emoji}</div>
                  <p className="font-display font-bold text-slate-900">{name}</p>
                  <p className="text-slate-400 text-sm mt-1">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
