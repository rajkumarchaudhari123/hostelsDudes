"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContact() {
  const phoneNumber = "+918796103287";
  const whatsappNumber = "918796103287";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      <AnimatePresence>
        {/* WhatsApp Pill */}
        <motion.a
          key="whatsapp-pill"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all text-[10px] font-bold"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </motion.a>

        {/* Call Now Button */}
        <motion.a
          key="call-button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          href={`tel:${phoneNumber}`}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all text-xs font-bold relative group"
        >
          {/* Subtle pulse animation */}
          <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping group-hover:hidden" style={{ animationDuration: "2s" }} />
          
          <Phone className="w-3.5 h-3.5 fill-white" />
          <span>Call Now</span>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
