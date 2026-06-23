"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useReveal } from "../../hooks/useReveal";

export function ReservationCTA() {
  const { ref, isVisible } = useReveal();

  return (
    <section className="py-32 relative overflow-hidden bg-obsidian" ref={ref as any}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(107,15,26,0.35) 0%, #111111 70%)",
        }}
      />

      {/* Rotating rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 600, height: 600, border: "1px dashed rgba(212,175,55,0.08)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 420, height: 420, border: "1px solid rgba(212,175,55,0.05)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-eyebrow mb-4">Reserve Your Evening</p>

          <h2 className="font-royal text-5xl md:text-7xl text-ivory leading-tight mb-6">
            Claim Your<br />
            <span className="text-gold-shimmer">Royal Table</span>
          </h2>

          <p className="font-cormo text-xl text-ivory/50 max-w-xl mx-auto mb-12 leading-relaxed">
            From intimate dinners to grand celebrations — every reservation at Kila Darbar is
            a promise of an unforgettable experience.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-14">
            {[
              { icon: "🕯️", text: "Private Dining Rooms" },
              { icon: "👑", text: "Royal Butler Service" },
              { icon: "🎵", text: "Live Ghazal Evenings" },
              { icon: "🌹", text: "Event Décor Available" },
            ].map((feat) => (
              <div key={feat.text} className="flex items-center gap-2.5 text-ivory/60">
                <span className="text-xl">{feat.icon}</span>
                <span className="font-cormo text-base tracking-wide">{feat.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/reservations" className="btn-gold magnetic">
              <span>Book a Table</span>
            </Link>
            <a
              href="tel:+919876543210"
              className="btn-outline-gold magnetic inline-flex items-center gap-2.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call to Reserve</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
