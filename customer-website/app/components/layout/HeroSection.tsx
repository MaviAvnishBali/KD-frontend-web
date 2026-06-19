"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Calendar, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-royal-dark">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-royal-dark via-royal-dark/90 to-transparent" />

      {/* Background image */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-40">
        <Image
          src="/images/hero-biryani.jpg"
          alt="Signature Royal Biryani"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-brand-gold-500/20 border border-brand-gold-500/50 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-brand-gold-400 fill-brand-gold-400" />
            <span className="text-brand-gold-300 text-sm font-medium">
              Authentic Royal Mughal Cuisine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mughal text-5xl md:text-7xl font-bold text-royal-cream leading-tight mb-4"
          >
            Kila{" "}
            <span className="text-gradient-gold">Darbar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Step into the grandeur of the Mughal empire. Every dish is a journey
            through centuries of royal tradition — crafted with passion, served
            with pride.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-8 mb-10"
          >
            {[
              { label: "Happy Guests", value: "50K+" },
              { label: "Signature Dishes", value: "120+" },
              { label: "Rating", value: "4.8★" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-brand-gold-400">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/menu" className="btn-gold">
              <ShoppingBag className="w-5 h-5" />
              Order Now
            </Link>
            <Link href="/reservations" className="btn-outline-royal !border-royal-cream !text-royal-cream hover:!bg-royal-cream hover:!text-royal-dark">
              <Calendar className="w-5 h-5" />
              Book a Table
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-400 text-xs uppercase tracking-widest">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-brand-gold-500 to-transparent"
        />
      </motion.div>
    </section>
  );
}
