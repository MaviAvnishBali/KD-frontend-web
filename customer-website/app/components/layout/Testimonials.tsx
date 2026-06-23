"use client";

import { motion } from "framer-motion";
import { useReveal } from "../../hooks/useReveal";

const reviews = [
  { name: "Priya Sharma",     role: "Food Critic",        rating: 5, text: "The Dum Biryani was transcendent. I've eaten at Michelin-starred restaurants across the world — Kila Darbar stands among them.", avatar: "PS", city: "Mumbai" },
  { name: "Arjun Malhotra",   role: "Business Executive", rating: 5, text: "Hosted our board dinner here. The private dining experience was impeccable — the food, service, and ambiance left everyone speechless.", avatar: "AM", city: "Bangalore" },
  { name: "Fatima Siddiqui",  role: "Travel Blogger",     rating: 5, text: "If you visit Bangalore for one meal, make it Kila Darbar. The Shahi Paneer Kofta melts before it even touches your tongue.", avatar: "FS", city: "Delhi" },
  { name: "Rohan Verma",      role: "Chef & Restaurateur",rating: 5, text: "As a professional chef, I'm hard to impress. The complexity of spice layering in their Veg Dum Biryani is a masterclass in patience.", avatar: "RV", city: "Hyderabad" },
  { name: "Sneha Iyer",       role: "Wedding Planner",    rating: 5, text: "Catered our 400-guest wedding reception. Every single dish arrived at the perfect temperature, perfectly plated. Pure magic.", avatar: "SI", city: "Chennai" },
  { name: "Vikram Nair",      role: "Retired IAS Officer", rating: 5, text: "Reminds me of the royal feasts I attended in Lucknow. The authentic Mughal recipes are preserved with remarkable fidelity.", avatar: "VN", city: "Mysore" },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div
      className="flex-none w-[340px] card-luxury rounded-2xl p-8 flex flex-col gap-5"
      style={{ background: "rgba(26, 10, 11, 0.85)" }}
    >
      <StarRow count={review.rating} />

      <p className="font-cormo text-lg text-ivory/80 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-gold-400/10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-royal text-sm text-ivory"
          style={{ background: "linear-gradient(135deg, #6B0F1A, #3d0409)" }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="font-royal text-sm text-ivory">{review.name}</p>
          <p className="font-cormo text-xs text-ivory/40">{review.role} · {review.city}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof reviews; reverse?: boolean }) {
  return (
    <div className="flex gap-6 overflow-hidden">
      <motion.div
        className="flex gap-6 flex-none"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((review, i) => (
          <TestimonialCard key={`${review.name}-${i}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const { ref, isVisible } = useReveal();

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(107,15,26,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Heading */}
      <div className="container mx-auto px-6 mb-16" ref={ref as any}>
        <motion.div
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="section-eyebrow">Guest Chronicles</p>
          <h2 className="section-title mt-2">
            Voices of <span className="text-gold-shimmer">Royalty</span>
          </h2>
          <p className="font-cormo text-lg text-ivory/50 mt-4 max-w-lg mx-auto">
            50,000+ guests have experienced the Kila Darbar difference. Here are their stories.
          </p>
        </motion.div>
      </div>

      {/* Marquees */}
      <div className="flex flex-col gap-6">
        <MarqueeRow items={reviews.slice(0, 3).concat(reviews.slice(0, 3))} />
        <MarqueeRow items={reviews.slice(3).concat(reviews.slice(3))} reverse />
      </div>

      {/* Edge fades */}
      <div
        className="absolute top-0 left-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #111111, transparent)" }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #111111, transparent)" }}
      />
    </section>
  );
}
