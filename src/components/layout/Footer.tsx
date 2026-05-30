import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Hostel<span className="text-blue-400"> Dudes</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s most trusted platform to find verified PG accommodations near colleges and universities. Safe, affordable, and student-friendly.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Students</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Find PG", href: "/search" },
                { label: "PG Near Colleges", href: "/search" },
                { label: "Trending Cities", href: "/cities" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Student Reviews", href: "/reviews" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Owners</h4>
            <ul className="space-y-2.5">
              {[
                { label: "List Your PG", href: "/owner/register" },
                { label: "Owner Dashboard", href: "/owner" },
                { label: "Manage Listings", href: "/owner/listings" },
                { label: "Analytics", href: "/owner/analytics" },
                { label: "Pricing", href: "/pricing" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">Hostel Dudes HQ, Sector 62, Noida 201301</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="https://wa.me/918506021056?text=can%20i%20get%20info" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">+91 85060 21056 (WhatsApp)</a>
                  <a href="https://wa.me/918826687134?text=can%20i%20get%20info" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">+91 88266 87134 (WhatsApp)</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:hello@hostelsdudes.in" className="text-sm text-slate-400 hover:text-white transition-colors">hello@hostelsdudes.in</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-3">Available on</p>
              <div className="flex gap-2">
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-medium">App Store</div>
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-medium">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Hostel Dudes. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
