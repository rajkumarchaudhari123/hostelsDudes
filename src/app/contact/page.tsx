"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h1 className="font-display font-bold text-5xl text-slate-900 mb-4">Get in Touch</h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Have a question? We&apos;re here to help. Reach out and we&apos;ll get back to you within a few hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: Mail, label: "Email Us", value: "hello@hostelsdudes.in", href: "mailto:hello@hostelsdudes.in", color: "bg-blue-100 text-blue-600" },
                { icon: Phone, label: "Call Us", value: "+91 88000 00000", href: "tel:+918800000000", color: "bg-green-100 text-green-600" },
                { icon: MapPin, label: "Our Office", value: "Koregaon Park, Pune 411001", href: "#", color: "bg-orange-100 text-orange-600" },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <a key={label} href={href} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card border border-slate-100 hover:border-blue-200 transition-colors group">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-medium">{label}</p>
                    <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mt-0.5">{value}</p>
                  </div>
                </a>
              ))}

              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-2">Support Hours</h3>
                <div className="space-y-1 text-blue-100 text-sm">
                  <p>Monday – Friday: 9 AM – 8 PM</p>
                  <p>Saturday: 10 AM – 6 PM</p>
                  <p>Sunday: 11 AM – 4 PM</p>
                </div>
                <p className="text-blue-200 text-xs mt-3">Response time: within 2 hours on weekdays</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-100">
                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-500">Thanks for reaching out. We&apos;ll get back to you within a few hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-6 btn-secondary">Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Send a Message</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Your Name *</label>
                        <input type="text" required placeholder="Full name" className="input-premium" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Email Address *</label>
                        <input type="email" required placeholder="you@example.com" className="input-premium" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Subject *</label>
                      <select required className="input-premium" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                        <option value="">Select a topic</option>
                        <option>I&apos;m a student looking for PG help</option>
                        <option>I want to list my PG</option>
                        <option>Technical issue / bug report</option>
                        <option>Billing & payments</option>
                        <option>Partnership inquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Message *</label>
                      <textarea required rows={5} placeholder="Tell us how we can help..." className="input-premium resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
