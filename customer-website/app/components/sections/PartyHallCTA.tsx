"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Sparkles, Cake, Gem } from "lucide-react";

const OCCASIONS = ["Birthday", "Ring Ceremony", "Baby Shower", "Anniversary", "Corporate Event", "Engagement"];

export function PartyHallCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0407 0%, #0d0208 60%, #1a0407 100%)" }} />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(124,29,29,0.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(74,11,11,0.3) 0%, transparent 55%)" }} />

      {/* Ornamental divider top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
          >
            <p className="section-eyebrow mb-4">Private Events</p>
            <h2 className="section-title mb-6">
              Party Hall for<br />
              <span className="text-gold-shimmer">Special Gatherings</span>
            </h2>
            <p className="font-cormo text-ivory/50 text-lg leading-relaxed mb-8">
              Celebrate your most cherished moments in our elegantly appointed party hall.
              From intimate birthday parties to ring ceremonies and corporate gatherings —
              we host events of up to <strong className="text-ivory/70">100 guests</strong> with
              the warmth of Mughal hospitality.
            </p>

            {/* Occasion chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {OCCASIONS.map((occ) => (
                <span key={occ} className="px-3 py-1.5 rounded-full border border-gold-400/20 font-royal text-[10px] tracking-widest uppercase text-ivory/40">
                  {occ}
                </span>
              ))}
            </div>

            <Link href="/party-hall" className="btn-gold magnetic inline-flex">
              <span>Explore Party Hall</span>
            </Link>
          </motion.div>

          {/* Right — feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: <Users className="w-6 h-6" />,     title: "Up to 100 Guests",   body: "Spacious hall with flexible seating arrangements" },
              { icon: <Sparkles className="w-6 h-6" />,  title: "Custom Décor",        body: "Personalised themes — floral, Mughal, modern or bespoke" },
              { icon: <Cake className="w-6 h-6" />,      title: "In-house Catering",   body: "Multi-course banquets crafted by our royal kitchen" },
              { icon: <Gem className="w-6 h-6" />,       title: "3 Packages",          body: "Basic · Royal · Grand — starting from ₹15,000" },
            ].map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }} viewport={{ once: true }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.08)" }}
              >
                <div className="text-gold-400/70 mb-3">{icon}</div>
                <p className="font-royal text-ivory text-sm mb-1.5">{title}</p>
                <p className="font-cormo text-ivory/40 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Ornamental divider bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }} />
    </section>
  );
}
