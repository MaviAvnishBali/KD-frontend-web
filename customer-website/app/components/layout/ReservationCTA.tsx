"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";

export function ReservationCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-maroon-900 via-brand-maroon-800 to-royal-dark relative overflow-hidden">
      <div className="absolute inset-0 mughal-border opacity-5 pointer-events-none" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-royal-cream font-mughal mb-4"
        >
          Reserve Your <span className="text-gradient-gold">Royal Table</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 max-w-lg mx-auto mb-10"
        >
          Celebrate your special moments in true Mughal grandeur. Book a table
          for dine-in or enquire about our private dining experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/reservations" className="btn-gold">
            <Calendar className="w-5 h-5" />
            Book a Table
          </Link>
          <a href="tel:+911234567890" className="btn-outline-royal !border-royal-cream !text-royal-cream hover:!bg-royal-cream hover:!text-royal-dark">
            <Phone className="w-5 h-5" />
            Call Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
