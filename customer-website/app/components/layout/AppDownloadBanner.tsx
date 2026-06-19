"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

export function AppDownloadBanner() {
  return (
    <section className="py-16 bg-royal-cream dark:bg-royal-dark-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8
                     bg-gradient-to-r from-brand-maroon-800 to-brand-maroon-900
                     rounded-3xl p-8 md:p-12 shadow-royal"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-8 h-8 text-brand-gold-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-royal-cream font-mughal mb-1">
                Get the Kila Darbar App
              </h3>
              <p className="text-gray-300 text-sm">
                Order faster, track in real-time, earn loyalty points with every bite.
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors">
              <span className="text-2xl">▶</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Get it on</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
