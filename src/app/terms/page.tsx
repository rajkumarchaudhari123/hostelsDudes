import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service – Hostel Dudes",
};

export default function TermsPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-10">
            <h1 className="font-display font-bold text-4xl text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-slate-400 text-sm mb-10">Last updated: January 1, 2026</p>
            <div className="space-y-8">
              {[
                { title: "1. Acceptance of Terms", content: "By accessing or using Hostel Dudes, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform." },
                { title: "2. Platform Use", content: "Hostel Dudes is a marketplace connecting students with PG owners. We are not a party to any rental agreements. We facilitate connections but do not own or manage any PG properties listed on the platform." },
                { title: "3. User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information. Accounts may not be shared or transferred." },
                { title: "4. PG Listings", content: "PG owners are responsible for the accuracy of their listings. Hostel Dudes reserves the right to verify, modify, or remove any listing that violates our policies or contains misleading information." },
                { title: "5. Bookings & Payments", content: "Bookings made through Hostel Dudes are subject to confirmation by the PG owner. Payment of booking amounts does not guarantee a confirmed booking until the owner accepts. Refund policies are subject to individual PG owner terms." },
                { title: "6. Prohibited Conduct", content: "Users may not post false or misleading information, harass other users, attempt to circumvent our platform for transactions, scrape data, or engage in any fraudulent activity." },
                { title: "7. Limitation of Liability", content: "Hostel Dudes is not liable for disputes between students and PG owners, the accuracy of listings, or any loss arising from use of the platform. Use of the platform is at your own risk." },
                { title: "8. Changes to Terms", content: "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes by email." },
              ].map(({ title, content }) => (
                <div key={title}>
                  <h2 className="font-display font-bold text-xl text-slate-900 mb-3">{title}</h2>
                  <p className="text-slate-600 leading-relaxed">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
