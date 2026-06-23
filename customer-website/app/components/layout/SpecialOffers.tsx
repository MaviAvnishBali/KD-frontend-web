"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tag } from "lucide-react";
import { useOffers } from "../../lib/api/hooks";

const FALLBACK_COLORS = ["from-brand-maroon-800 to-brand-maroon-600", "from-amber-800 to-amber-600", "from-emerald-800 to-emerald-600"];

export function SpecialOffers() {
  const { data, isLoading } = useOffers();
  const offers = data ?? [];

  if (!isLoading && offers.length === 0) return null;

  return (
    <section className="py-20 bg-royal-cream dark:bg-royal-dark-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Special Offers</h2>
          <div className="gold-divider" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse h-44" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} p-6 text-white shadow-royal`}
              >
                {offer.badgeText && (
                  <span className="absolute top-4 right-4 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {offer.badgeText}
                  </span>
                )}
                <span className="text-3xl mb-4 block">{offer.emoji}</span>
                <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                {offer.description && <p className="text-sm text-white/80 mb-4">{offer.description}</p>}
                <div className="flex items-center gap-3 flex-wrap">
                  {offer.promoCode && (
                    <span className="font-mono font-bold bg-white/20 px-3 py-1 rounded-lg text-sm tracking-widest">
                      {offer.promoCode}
                    </span>
                  )}
                  {offer.savingText && (
                    <span className="text-sm text-white/80">{offer.savingText}</span>
                  )}
                  <Link href="/menu" className="text-sm underline opacity-80 hover:opacity-100 ml-auto">
                    Order now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
