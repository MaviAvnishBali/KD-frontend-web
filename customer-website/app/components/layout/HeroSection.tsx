"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

/* ── Particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; decay: number; color: string;
    };

    const COLORS = ["#D4AF37", "#F5E07A", "#b8962e", "#6B0F1A", "#9a1528"];
    const particles: Particle[] = [];

    function spawn() {
      const x = Math.random() * W;
      const y = Math.random() * H;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.2),
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        decay: Math.random() * 0.003 + 0.001,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    for (let i = 0; i < 140; i++) spawn();

    let raf: number;
    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* particles */
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          particles.splice(i, 1);
          spawn();
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === "#D4AF37" || p.color === "#F5E07A" || p.color === "#b8962e"
            ? `rgba(212,175,55,${p.alpha})`
            : `rgba(107,15,26,${p.alpha * 0.6})`;
        ctx.fill();

        /* glow on gold */
        if (p.r > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${p.alpha * 0.06})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

/* ── Fort SVG silhouette ── */
function FortSilhouette() {
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax meet"
      className="absolute bottom-0 left-0 right-0 w-full"
      style={{ height: "55%", opacity: 0.12 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="fortGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6B0F1A" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Fort silhouette path */}
      <path
        d="M0,500 L0,320 L40,320 L40,280 L55,280 L55,260 L70,260 L70,280 L85,280 L85,320
           L120,320 L120,200 L135,200 L135,160 L150,160 L150,200 L165,200 L165,320
           L200,320 L200,280 L215,280 L215,260 L230,260 L230,280 L245,280 L245,220
           L260,220 L260,180 L275,180 L275,140 L290,140 L290,180 L305,180 L305,220
           L320,220 L320,280 L335,280 L335,320 L370,320 L370,250 L385,250 L385,210
           L400,200 L415,210 L415,250 L430,250 L430,320
           L450,320 L450,150 L465,150 L465,100 L480,90 L495,100 L495,150 L510,150 L510,320
           L530,320 L530,280 L545,280 L545,260 L560,260 L560,280 L575,280 L575,220
           L590,220 L590,160 L605,150 L620,160 L620,220 L635,220 L635,280 L650,280 L650,320
           L670,320 L670,250 L685,250 L685,220 L700,220 L700,250 L715,250 L715,320
           L740,320 L740,150 L755,150 L755,100 L770,85 L785,100 L785,150 L800,150 L800,320
           L820,320 L820,250 L835,250 L835,220 L850,220 L850,280 L865,280 L865,320
           L890,320 L890,200 L905,200 L905,160 L920,150 L935,160 L935,200 L950,200 L950,320
           L980,320 L980,280 L995,280 L995,260 L1010,260 L1010,280 L1025,280 L1025,320
           L1060,320 L1060,200 L1075,200 L1075,160 L1090,160 L1090,200 L1105,200 L1105,320
           L1140,320 L1140,280 L1155,280 L1155,260 L1170,260 L1170,280 L1185,280 L1185,320
           L1200,320 L1200,500 Z"
        fill="url(#fortGrad)"
      />
      {/* Arch windows */}
      {[120, 300, 490, 660, 800, 960].map((x, i) => (
        <path
          key={i}
          d={`M${x + 8},320 L${x + 8},260 Q${x + 20},245 ${x + 32},260 L${x + 32},320 Z`}
          fill="#111111"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}

/* ── Light rays ── */
function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 origin-top"
          style={{
            width: 2,
            height: "80%",
            rotate: `${-60 + i * 24}deg`,
            background:
              "linear-gradient(to bottom, rgba(212,175,55,0.15), transparent)",
            transformOrigin: "top center",
            marginLeft: "-1px",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated headline letters ── */
const HEADLINE = "KILA DARBAR";
const SUBLINE  = "Royal Mughal Cuisine";

function AnimatedTitle() {
  return (
    <div className="overflow-hidden">
      <motion.h1
        className="font-royal text-[clamp(3.5rem,12vw,10rem)] leading-none tracking-[-0.02em] text-ivory"
        initial="hidden"
        animate="visible"
      >
        {HEADLINE.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ willChange: "transform" }}
            variants={{
              hidden:  { y: "100%", opacity: 0 },
              visible: {
                y: 0, opacity: 1,
                transition: {
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.04 + 0.2,
                },
              },
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}

/* ── Counter ── */
function Counter({ end, label }: { end: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
      className="flex flex-col items-center"
    >
      <span className="font-royal text-3xl md:text-4xl text-gold-400">{end}</span>
      <span className="font-cormo text-xs tracking-[0.2em] uppercase text-ivory/50 mt-1">{label}</span>
    </motion.div>
  );
}

/* ── Main hero ── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  const bgX     = useTransform(springX, [0, 1], ["-3%", "3%"]);
  const bgY     = useTransform(springY, [0, 1], ["-3%", "3%"]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      containerRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian"
    >
      {/* Deep radial bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(107,15,26,0.45) 0%, #111111 70%)",
        }}
      />

      {/* Parallax bg layer */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgX, y: bgY }}
      >
        {/* Golden circular ornament */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "min(90vw, 700px)",
            height: "min(90vw, 700px)",
            border: "1px solid rgba(212,175,55,0.06)",
            boxShadow: "0 0 120px rgba(107,15,26,0.3), inset 0 0 80px rgba(107,15,26,0.1)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "min(70vw, 520px)",
            height: "min(70vw, 520px)",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Particles */}
      <ParticleCanvas />

      {/* Light rays */}
      <LightRays />

      {/* Fort silhouette */}
      <FortSilhouette />

      {/* Bottom fog */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #111111, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <span className="h-px w-12 bg-gold-400/50" />
          <span className="font-royal text-gold-400 text-xs tracking-[0.4em] uppercase">
            Est. Since 1998
          </span>
          <span className="h-px w-12 bg-gold-400/50" />
        </motion.div>

        {/* Main title */}
        <AnimatedTitle />

        {/* Decorative subtitle */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="flex items-center justify-center gap-6 my-4"
        >
          <span className="h-px flex-1 max-w-[120px]"
            style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }}
          />
          <span className="font-cormo text-xl md:text-2xl text-ivory/70 tracking-[0.15em] italic">
            {SUBLINE}
          </span>
          <span className="h-px flex-1 max-w-[120px]"
            style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
          className="font-cormo text-lg md:text-xl text-ivory/60 max-w-xl mx-auto mt-4 mb-10 leading-relaxed"
        >
          Where centuries of Mughal culinary heritage meets contemporary luxury.
          Every dish tells the story of a royal court.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link href="/menu" className="btn-gold magnetic">
            <span>Explore the Menu</span>
          </Link>
          <Link href="/reservations" className="btn-outline-gold magnetic">
            <span>Reserve Your Table</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex items-center justify-center gap-8 md:gap-16"
        >
          <div className="h-10 w-px bg-gold-400/20" />
          <Counter end="50K+" label="Happy Guests" />
          <div className="h-10 w-px bg-gold-400/20" />
          <Counter end="120+" label="Signature Dishes" />
          <div className="h-10 w-px bg-gold-400/20" />
          <Counter end="4.9★" label="Google Rating" />
          <div className="h-10 w-px bg-gold-400/20" />
          <Counter end="25+" label="Years Legacy" />
          <div className="h-10 w-px bg-gold-400/20" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-royal text-[10px] tracking-[0.4em] uppercase text-ivory/30">
          Scroll
        </span>
        <motion.div
          className="w-px h-12 origin-top"
          style={{
            background: "linear-gradient(to bottom, #D4AF37, transparent)",
          }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
