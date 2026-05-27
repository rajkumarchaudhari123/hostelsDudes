import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy – Hostel Dudes",
  description: "Read Hostel Dudes's privacy policy to understand how we collect and use your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-10">
            <h1 className="font-display font-bold text-4xl text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm mb-10">Last updated: January 1, 2026</p>

            <div className="prose prose-slate max-w-none space-y-8">
              {[
                {
                  title: "1. Information We Collect",
                  content: "We collect information you provide directly, such as your name, email address, phone number, and profile information when you create an account. We also collect information about your usage of our platform, search queries, and interactions with PG listings."
                },
                {
                  title: "2. How We Use Your Information",
                  content: "We use your information to provide and improve our services, send you relevant PG recommendations, process bookings and inquiries, communicate important updates, and ensure platform safety and prevent fraud."
                },
                {
                  title: "3. Information Sharing",
                  content: "We share your contact information with PG owners only when you send an inquiry or make a booking. We do not sell your personal data to third parties. We may share anonymized, aggregated data for analytics purposes."
                },
                {
                  title: "4. Data Security",
                  content: "We implement industry-standard security measures including encryption, secure HTTPS connections, and regular security audits to protect your personal information. Passwords are hashed using bcrypt and never stored in plain text."
                },
                {
                  title: "5. Cookies",
                  content: "We use cookies to maintain your session, remember your preferences, and analyze how our platform is used. You can control cookie settings through your browser."
                },
                {
                  title: "6. Your Rights",
                  content: "You have the right to access, correct, or delete your personal data. You can update your profile information at any time. To request account deletion, contact us at privacy@hostelsdudes.in."
                },
                {
                  title: "7. Contact Us",
                  content: "If you have questions about this privacy policy or how we handle your data, please contact us at privacy@hostelsdudes.in or write to Hostel Dudes, Koregaon Park, Pune 411001."
                },
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
