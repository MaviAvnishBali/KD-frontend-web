"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useReveal } from "../../hooks/useReveal";
import { useBestSellers, useAddToCart } from "../../lib/api/hooks";
import type { MenuItem } from "../../lib/api/types";

function menuEmoji(name: string) {
  if (/biryani/i.test(name)) return "🍚";
  if (/paneer|cheese/i.test(name)) return "🧀";
  if (/dal|lentil/i.test(name)) return "🥘";
  if (/lassi|drink|beverag/i.test(name)) return "🍹";
  if (/roti|naan|bread/i.test(name)) return "🫓";
  if (/tukda|gulab|dessert|sweet/i.test(name)) return "🍮";
  if (/tikka|kebab|grill/i.test(name)) return "🔥";
  return "🍽️";
}

function BestSellerCard({ item, index }: { item: MenuItem; index: number }) {
  const addToCart = useAddToCart();
  const isVeg = item.foodType === "VEG" || item.foodType === "VEGAN" || item.foodType === "JAIN";
  const price = item.discountPrice ?? item.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable
        glareMaxOpacity={0.08}
        glareColor="#D4AF37"
        glarePosition="all"
        perspective={1000}
        transitionSpeed={500}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="group relative card-luxury rounded-2xl overflow-hidden"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Visual */}
          <div
            className="h-52 flex items-center justify-center relative overflow-hidden"
            style={{ background: `radial-gradient(ellipse at center, rgba(107,15,26,0.5) 0%, #111 100%)` }}
          >
            <motion.div
              className="text-8xl select-none"
              animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
            >
              {menuEmoji(item.name)}
            </motion.div>
            <div className="absolute inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ border: "1px solid rgba(212,175,55,0.2)" }} />
            <div className="absolute top-4 left-4">
              <span className="font-royal text-[9px] tracking-[0.3em] uppercase text-gold-400/80 bg-gold-400/10 px-2 py-1 border border-gold-400/20">
                {item.isBestSeller ? "Bestseller" : item.isRecommended ? "Chef's Pick" : "Featured"}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <div className="w-5 h-5 rounded-sm border-2 flex items-center justify-center" style={{ borderColor: isVeg ? "#22c55e" : "#ef4444" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: isVeg ? "#22c55e" : "#ef4444" }} />
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: "rgba(107,15,26,0.3)" }} />
          </div>

          {/* Info */}
          <div className="p-6" style={{ transform: "translateZ(20px)" }}>
            <h3 className="font-royal text-lg text-ivory mb-2 leading-tight">{item.name}</h3>
            <p className="font-cormo text-sm text-ivory/50 leading-relaxed mb-5 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-royal text-xl text-gold-400">₹{price}</span>
                {item.discountPrice && item.discountPrice < item.price && (
                  <span className="ml-2 text-sm text-ivory/30 line-through">₹{item.price}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart.mutate({ menuItemId: item.id })}
                disabled={!item.isAvailable || addToCart.isPending}
                className="btn-gold text-xs py-2 px-4 magnetic disabled:opacity-50"
              >
                <span>{item.isAvailable ? "Add to Order" : "Unavailable"}</span>
              </motion.button>
            </div>
          </div>

          <motion.div className="absolute bottom-0 left-0 h-px bg-gold-400" initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.4 }} />
        </div>
      </Tilt>
    </motion.div>
  );
}

export function BestSellers() {
  const { ref, isVisible } = useReveal();
  const { data, isLoading } = useBestSellers();
  const items = (data ?? []).slice(0, 4);

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Bg texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(212,175,55,0.5) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(212,175,55,0.5) 80px)",
        }}
      />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div ref={ref as any} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-eyebrow">Most Loved</p>
            <h2 className="section-title mt-2">
              Best <span className="text-gold-shimmer">Sellers</span>
            </h2>
          </motion.div>

          <motion.div
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link
              href="/menu"
              className="btn-outline-gold magnetic inline-flex"
            >
              <span>View Full Menu</span>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-luxury rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <BestSellerCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
