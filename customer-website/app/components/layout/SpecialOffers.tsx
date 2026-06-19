"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tag } from "lucide-react";

const offers = [
  {
    code: "WELCOME20",
    title: "First Order Discount",
    desc: "Get 20% off your very first order with us.",
    badge: "New Users",
    color: "from-brand-maroon-800 to-brand-maroon-600",
  },
  {
    code: "ROYAL50",
    title: "Weekend Royal Feast",
    desc: "Flat ₹50 off on orders above ₹500 every weekend.",
    badge: "Weekend Special",
    color: "from-amber-800 to-amber-600",
  },
  {
    code: "LOYALTY2X",
    title: "Double Loyalty Points",
    desc: "Earn 2× loyalty points on all Tuesday orders.",
    badge: "Members",
    color: "from-emerald-800 to-emerald-600",
  },
];

export function SpecialOffers() {
  return (
    <section className="py-20 bg-royal-cream dark:bg-royal-dark-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Special Offers</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.color}
                         p-6 text-white shadow-royal`}
            >
              <span className="absolute top-4 right-4 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {offer.badge}
              </span>
              <Tag className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
              <p className="text-sm text-white/80 mb-4">{offer.desc}</p>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold bg-white/20 px-3 py-1 rounded-lg text-sm tracking-widest">
                  {offer.code}
                </span>
                <Link href="/menu" className="text-sm underline opacity-80 hover:opacity-100">
                  Order now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
