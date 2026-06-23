"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "../../lib/api/hooks";

const CATEGORY_EMOJIS: Record<string, string> = {
  biryani: "🍚", kebab: "🔥", curry: "🍛", currie: "🍛",
  bread: "🫓", naan: "🫓", roti: "🫓",
  dessert: "🍮", sweet: "🍮",
  beverage: "🥤", drink: "🥤", lassi: "🍹",
  starter: "🥗", soup: "🥣", dal: "🥘",
};
function catEmoji(name: string) {
  const lower = name.toLowerCase();
  return Object.entries(CATEGORY_EMOJIS).find(([k]) => lower.includes(k))?.[1]
    ?? ["🍛", "🥩", "🍲", "🫓", "🍮", "🥤"][0];
}

export function FeaturedCategories() {
  const { data, isLoading } = useCategories();
  const categories = data ?? [];

  return (
    <section className="py-20 bg-royal-cream dark:bg-royal-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Explore Our Menu</h2>
          <div className="gold-divider" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            From regal biryanis to melt-in-your-mouth kebabs — a royal spread
            awaits.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-white/5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/menu?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl
                             bg-white dark:bg-royal-dark-surface border border-gray-100
                             dark:border-royal-dark-variant hover:border-brand-gold-400
                             transition-all shadow-card hover:shadow-gold"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-maroon-100 dark:bg-royal-dark-variant
                                 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {catEmoji(cat.name)}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-royal-cream text-center">
                    {cat.name}
                  </span>
                  {cat.itemCount != null && (
                    <span className="text-xs text-gray-400">{cat.itemCount} items</span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
