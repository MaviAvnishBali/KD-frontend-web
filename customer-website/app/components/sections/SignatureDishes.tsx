"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "../../hooks/useReveal";
import { useBestSellers, useAddToCart } from "../../lib/api/hooks";
import type { MenuItem } from "../../lib/api/types";

const CARD_COLORS = ["#6B0F1A", "#4a0b14", "#3d0409", "#5a0e1a", "#3a0e08"];

function menuEmoji(name: string) {
  if (/biryani/i.test(name)) return "🍚";
  if (/paneer|cheese/i.test(name)) return "🧀";
  if (/dal|lentil/i.test(name)) return "🥘";
  if (/handi/i.test(name)) return "🫕";
  if (/tukda|gulab|dessert|sweet/i.test(name)) return "🍮";
  if (/tikka|kebab|grill/i.test(name)) return "🔥";
  if (/roti|naan|bread/i.test(name)) return "🫓";
  return "🍽️";
}

function DishCard({ item, index }: { item: MenuItem; index: number }) {
  const addToCart = useAddToCart();
  const price = item.discountPrice ?? item.price;
  const tag = item.isBestSeller ? "Signature" : item.isRecommended ? "Chef's Pick" : "Heritage";
  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="flex-none w-[340px] md:w-[420px] group"
    >
      <div
        className="relative h-[480px] md:h-[560px] rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${color}, #111111)`, border: "1px solid rgba(212,175,55,0.12)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-[160px] md:text-[200px] opacity-15 select-none pointer-events-none"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {menuEmoji(item.name)}
          </motion.div>
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        <div className="absolute top-6 right-6 w-24 h-24 rounded-full opacity-10" style={{ border: "1px solid #D4AF37" }} />
        <div className="absolute top-6 left-6">
          <span className="font-royal text-[10px] tracking-[0.3em] uppercase px-3 py-1.5" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37" }}>
            {tag}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h3 className="font-royal text-2xl text-ivory mb-3 leading-tight">{item.name}</h3>
          <p className="font-cormo text-base text-ivory/60 leading-relaxed mb-6 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-royal text-2xl text-gold-400">₹{price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart.mutate({ menuItemId: item.id })}
              disabled={!item.isAvailable || addToCart.isPending}
              className="btn-gold magnetic text-xs py-2.5 px-5 disabled:opacity-50"
            >
              <span>{item.isAvailable ? "Order Now" : "Unavailable"}</span>
            </motion.button>
          </div>
        </div>
        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 60%)" }} />
      </div>
    </motion.div>
  );
}

export function SignatureDishes() {
  const { ref, isVisible } = useReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const lineWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);
  const { data } = useBestSellers();
  const items = (data ?? []).slice(0, 5);

  return (
    <section className="py-24 overflow-hidden bg-obsidian">
      {/* Heading */}
      <div className="container mx-auto px-6 mb-16" ref={ref as any}>
        <motion.div
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-eyebrow">Culinary Heritage</p>
          <h2 className="section-title mt-2">
            Signature <span className="text-gold-shimmer">Creations</span>
          </h2>
          <p className="font-cormo text-lg text-ivory/50 mt-4 max-w-lg">
            Dishes that have graced the tables of royalty for generations, perfected and preserved.
          </p>
        </motion.div>
      </div>

      {/* Scroll progress bar */}
      <div className="container mx-auto px-6 mb-8">
        <div className="h-px bg-gold-400/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gold-400"
            style={{ width: lineWidth }}
          />
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden pb-6 px-6 md:px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, i) => (
          <DishCard key={item.id} item={item} index={i} />
        ))}
        {/* End spacer */}
        <div className="flex-none w-6" />
      </div>

      {/* Drag hint */}
      <div className="container mx-auto px-6 mt-8 flex items-center gap-3 text-ivory/30">
        <motion.div
          animate={{ x: [0, 16, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.div>
        <span className="font-royal text-[10px] tracking-[0.3em] uppercase">Drag to explore</span>
      </div>
    </section>
  );
}
