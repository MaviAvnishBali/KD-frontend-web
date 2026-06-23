"use client";

import { motion } from "framer-motion";
import { useReveal } from "../../hooks/useReveal";

const chefs = [
  {
    name: "Ustad Hamid Khan",
    title: "Executive Chef & Ustad",
    expertise: "Dum Biryani · Kebabs · Mughal Gravies",
    legacy: "3rd generation Mughal cuisine specialist from Lucknow",
    emoji: "👨‍🍳",
    quote: "Every grain of rice in my biryani carries the memory of generations.",
    years: "38",
  },
  {
    name: "Chef Pradeep Sharma",
    title: "Pastry & Dessert Chef",
    expertise: "Shahi Tukda · Gulab Jamun · Kulfi",
    legacy: "Trained at Taj Hotels, specialising in Mughal confectionery",
    emoji: "🍮",
    quote: "A meal without a proper mithai is a letter without a seal.",
    years: "22",
  },
];

function ChefCard({ chef, index }: { chef: typeof chefs[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.2 }}
      className="group relative"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(26,10,11,0.95) 0%, rgba(17,17,17,0.95) 100%)",
          border: "1px solid rgba(212,175,55,0.12)",
        }}
      >
        {/* Spotlight top */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "radial-gradient(ellipse at top, rgba(212,175,55,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Header visual */}
        <div
          className="relative h-72 flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(107,15,26,0.6) 0%, #111 80%)",
          }}
        >
          <motion.div
            className="text-[120px] select-none"
            animate={{
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index }}
          >
            {chef.emoji}
          </motion.div>

          {/* Years badge */}
          <div className="absolute top-6 right-6 text-center">
            <p className="font-royal text-4xl text-gold-400 leading-none">{chef.years}</p>
            <p className="font-royal text-[9px] tracking-[0.3em] uppercase text-ivory/50 mt-1">years</p>
          </div>

          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 w-6 h-6" style={{ borderTop: "1px solid rgba(212,175,55,0.4)", borderLeft: "1px solid rgba(212,175,55,0.4)" }} />
          <div className="absolute bottom-4 right-4 w-6 h-6" style={{ borderBottom: "1px solid rgba(212,175,55,0.4)", borderRight: "1px solid rgba(212,175,55,0.4)" }} />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Quote */}
          <blockquote className="font-cormo text-xl italic text-ivory/70 leading-relaxed mb-6 relative">
            <span className="absolute -top-2 -left-2 text-5xl text-gold-400/20 font-serif leading-none">"</span>
            {chef.quote}
          </blockquote>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gold-400/30 via-gold-400/10 to-transparent mb-6" />

          {/* Info */}
          <h3 className="font-royal text-xl text-ivory mb-1">{chef.name}</h3>
          <p className="font-royal text-xs tracking-[0.2em] uppercase text-gold-400 mb-4">{chef.title}</p>
          <p className="font-cormo text-sm text-ivory/50 mb-3">{chef.expertise}</p>
          <p className="font-cormo text-xs text-ivory/35 italic">{chef.legacy}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ChefSpecial() {
  const { ref, isVisible } = useReveal();

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(107,15,26,0.25) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div ref={ref as any} className="text-center mb-20">
          <motion.div
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-eyebrow">The Craftsmen</p>
            <h2 className="section-title mt-2">
              Meet Our <span className="text-gold-shimmer">Ustads</span>
            </h2>
            <p className="font-cormo text-lg text-ivory/50 mt-4 max-w-lg mx-auto">
              Behind every legendary dish is a master who has devoted their life to the art.
            </p>
          </motion.div>
        </div>

        {/* Chef cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {chefs.map((chef, i) => (
            <ChefCard key={chef.name} chef={chef} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="font-cormo text-lg text-ivory/40 mb-6">
            Want to meet the team? Join our exclusive Chef's Table experience.
          </p>
          <a href="/reservations" className="btn-outline-gold inline-flex magnetic">
            <span>Book Chef's Table</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
