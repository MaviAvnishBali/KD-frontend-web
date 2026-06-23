"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReveal } from "../../hooks/useReveal";

const pillars = [
  {
    number: "01",
    title: "Royal Ambiance",
    desc: "Step into a world of Mughal grandeur — hand-crafted arches, intricate jali-work, and candlelit alcoves transport you to a 16th century palace.",
    emoji: "🏰",
  },
  {
    number: "02",
    title: "Master Chefs",
    desc: "Our Ustads carry recipes passed down through generations, each dish crafted with patience, intuition, and the finest hand-selected ingredients.",
    emoji: "👨‍🍳",
  },
  {
    number: "03",
    title: "Private Dining",
    desc: "Host intimate gatherings in our royal dining chambers — bespoke menus, personal butlers, and an experience reserved for the discerning few.",
    emoji: "🕯️",
  },
];

function PillarCard({ item, index }: { item: typeof pillars[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      className="group relative"
    >
      {/* Vertical accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: "linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)",
        }}
      />

      <div className="pl-8">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="font-royal text-5xl"
            style={{ color: "rgba(212,175,55,0.15)", lineHeight: 1 }}
          >
            {item.number}
          </span>
          <span className="text-4xl">{item.emoji}</span>
        </div>

        <h3 className="font-royal text-2xl text-ivory mb-4">{item.title}</h3>
        <p className="font-cormo text-base text-ivory/55 leading-relaxed">{item.desc}</p>

        <motion.div
          className="mt-6 flex items-center gap-2 text-gold-400 text-sm font-royal tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ x: 6 }}
        >
          <span>Discover More</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function RoyalExperience() {
  const { ref, isVisible } = useReveal();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-obsidian relative overflow-hidden"
    >
      {/* Subtle maroon glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(107,15,26,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — visual */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main visual frame */}
            <motion.div
              style={{ y: y1 }}
              className="absolute top-0 left-0 right-16 bottom-16 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: "linear-gradient(145deg, #6B0F1A 0%, #3d0409 40%, #1a0a0b 100%)",
                }}
              >
                {/* Large decorative element */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <motion.div
                    className="text-[200px] opacity-20 select-none"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    ✦
                  </motion.div>

                  {/* Inner content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <span className="text-7xl mb-6">🕌</span>
                    <p className="font-royal text-2xl text-gold-400 mb-3">Royal Heritage</p>
                    <p className="font-cormo text-base text-ivory/50 leading-relaxed">
                      Inspired by the grandeur of Mughal forts and the refinement of their royal courts
                    </p>
                  </div>
                </div>
              </div>

              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-8 h-8" style={{ borderTop: "2px solid rgba(212,175,55,0.5)", borderLeft: "2px solid rgba(212,175,55,0.5)" }} />
              <div className="absolute top-4 right-4 w-8 h-8" style={{ borderTop: "2px solid rgba(212,175,55,0.5)", borderRight: "2px solid rgba(212,175,55,0.5)" }} />
              <div className="absolute bottom-4 left-4 w-8 h-8" style={{ borderBottom: "2px solid rgba(212,175,55,0.5)", borderLeft: "2px solid rgba(212,175,55,0.5)" }} />
              <div className="absolute bottom-4 right-4 w-8 h-8" style={{ borderBottom: "2px solid rgba(212,175,55,0.5)", borderRight: "2px solid rgba(212,175,55,0.5)" }} />
            </motion.div>

            {/* Floating overlay card */}
            <motion.div
              className="absolute bottom-0 right-0 w-56 p-6 rounded-2xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{
                y: y2,
                background: "linear-gradient(135deg, #111 0%, #1a0a0b 100%)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <div className="text-4xl mb-3">⭐</div>
              <p className="font-royal text-3xl text-gold-400 mb-1">4.9</p>
              <p className="font-cormo text-xs text-ivory/50 uppercase tracking-widest">50,000+ Reviews</p>
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-gold-400 fill-gold-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            {/* Gold ring decoration */}
            <div
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20"
              style={{ border: "1px dashed #D4AF37" }}
            />
          </div>

          {/* Right — content */}
          <div ref={ref as any}>
            <motion.div
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="section-eyebrow">The Experience</p>
              <h2 className="section-title mt-2 mb-4">
                More Than <br />
                Just a <span className="text-gold-shimmer">Meal</span>
              </h2>
              <p className="font-cormo text-lg text-ivory/55 leading-relaxed mb-14">
                Dining at Kila Darbar is a journey through centuries of Mughal culinary artistry.
                From the moment you enter, every detail is curated to transport you to a realm of regal opulence.
              </p>
            </motion.div>

            <div className="flex flex-col gap-12">
              {pillars.map((item, i) => (
                <PillarCard key={item.number} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
