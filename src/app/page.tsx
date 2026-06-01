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
import VisitChargeSection from "@/components/home/VisitChargeSection";
import TrustSection from "@/components/home/TrustSection";

export const metadata: Metadata = {
  title: "Hostel Dudes – Find Your Perfect PG Near College in Noida",
  description:
    "Find verified PG accommodations near top colleges in Noida & Greater Noida. In-person site visits for just ₹100. Zero brokerage. Student-first platform.",
};

export default function HomePage() {
  return (
    <>
      <Navbar user={null} />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedPGs />
        <VisitChargeSection />
        <TrustSection />
        <TrendingCities />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
