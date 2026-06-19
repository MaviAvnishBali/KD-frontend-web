"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "../../lib/api";

const FALLBACK = [
  { id: 1, name: "Biryani", slug: "biryani", imageUrl: null },
  { id: 2, name: "Kebabs", slug: "kebabs", imageUrl: null },
  { id: 3, name: "Curries", slug: "curries", imageUrl: null },
  { id: 4, name: "Breads", slug: "breads", imageUrl: null },
  { id: 5, name: "Desserts", slug: "desserts", imageUrl: null },
  { id: 6, name: "Beverages", slug: "beverages", imageUrl: null },
];

export function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/menu/categories").then((r) => r.data.data),
  });

  const categories = (data && data.length > 0 ? data : FALLBACK);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: any, i: number) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/menu?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl
                           bg-white dark:bg-royal-dark-surface border border-gray-100
                           dark:border-royal-dark-variant hover:border-brand-gold-400
                           transition-all shadow-card hover:shadow-gold"
              >
                <div className="w-16 h-16 rounded-full bg-brand-maroon-100 dark:bg-royal-dark-variant
                               flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {["🍛", "🥩", "🍲", "🫓", "🍮", "🥤"][i % 6]}
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-royal-cream text-center">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
