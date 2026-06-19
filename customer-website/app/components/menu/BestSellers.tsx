"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MenuItemCard } from "./MenuItemCard";
import api from "../../lib/api";
import Link from "next/link";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => api.get("/menu/best-sellers").then((r) => r.data.data),
  });

  return (
    <section className="py-20 bg-white dark:bg-royal-dark-surface">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title">Best Sellers</h2>
            <div className="gold-divider" />
          </div>
          <Link
            href="/menu"
            className="text-brand-maroon-600 dark:text-brand-gold-400 font-medium hover:underline text-sm"
          >
            View full menu →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-gray-100 dark:bg-royal-dark-variant animate-pulse" />
            ))}
          </div>
        ) : data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.slice(0, 4).map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">
            Our kitchen is being set up — check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
