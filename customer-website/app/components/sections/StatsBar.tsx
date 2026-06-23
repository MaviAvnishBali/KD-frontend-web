"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../../hooks/useReveal";

const stats = [
  { end: 50000, label: "Happy Guests",     suffix: "+" },
  { end: 120,   label: "Signature Dishes", suffix: "+" },
  { end: 25,    label: "Years of Legacy",  suffix: "+" },
  { end: 4.9,   label: "Average Rating",   suffix: "★" },
  { end: 3,     label: "Dining Spaces",    suffix: "" },
];

function AnimatedNumber({ end, suffix }: { end: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const { ref, isVisible } = useReveal(0.5);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;

    const duration = 2000;
    const start    = performance.now();
    const isDecimal = !Number.isInteger(end);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      const current = end * ease;
      setVal(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isVisible, end]);

  return (
    <span ref={ref as any} className="font-royal text-4xl md:text-5xl text-gold-400">
      {Number.isInteger(end) ? val.toLocaleString() : val.toFixed(1)}{suffix}
    </span>
  );
}

export function StatsBar() {
  const { ref, isVisible } = useReveal();

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #6B0F1A 0%, #3d0409 50%, #1a0a0b 100%)",
        borderTop: "1px solid rgba(212,175,55,0.1)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6" ref={ref as any}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <AnimatedNumber end={stat.end} suffix={stat.suffix} />
              <p className="font-royal text-[10px] tracking-[0.3em] uppercase text-ivory/40">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
