import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedPGs from "@/components/home/FeaturedPGs";
import TrendingCities from "@/components/home/TrendingCities";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Hostel Dudes – Find Your Perfect PG Near College",
  description:
    "Discover 12,000+ verified PG accommodations near top colleges across India. Filter by budget, gender, amenities and more.",
};

export default function HomePage() {
  return (
    <>
      <Navbar user={null} />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedPGs />
        <TrendingCities />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
