"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const galleryItems = [
  { id: 1, emoji: "🍚", label: "Dum Biryani", tall: true  },
  { id: 2, emoji: "🔥", label: "Paneer Tikka", tall: false },
  { id: 3, emoji: "🕌", label: "The Darbar",   tall: false },
  { id: 4, emoji: "🫕", label: "Veg Handi",    tall: true  },
  { id: 5, emoji: "🎭", label: "Live Music",  tall: false },
  { id: 6, emoji: "🍮", label: "Shahi Tukda", tall: false },
  { id: 7, emoji: "🥘", label: "Dal Makhani", tall: true  },
  { id: 8, emoji: "🕯️", label: "Fine Dining", tall: false },
  { id: 9, emoji: "🥘", label: "Dal Makhani", tall: false },
];

function GalleryItem({
  item,
  onClick,
}: {
  item: typeof galleryItems[0];
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.tall ? "row-span-2" : ""}`}
      style={{ minHeight: item.tall ? "360px" : "170px" }}
    >
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
        style={{
          background: `radial-gradient(ellipse at center, rgba(107,15,26,${0.3 + (item.id % 3) * 0.1}) 0%, rgba(17,17,17,0.95) 100%)`,
        }}
      >
        <motion.div
          className="text-7xl md:text-8xl select-none"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: item.id * 0.4 }}
        >
          {item.emoji}
        </motion.div>
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ border: "1px solid rgba(212,175,55,0.3)" }}
      />

      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
      >
        <p className="font-royal text-sm tracking-widest text-ivory uppercase">{item.label}</p>
      </motion.div>

      {/* Expand icon */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
          <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const { ref, isVisible } = useReveal();
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null);

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div ref={ref as any} className="text-center mb-16">
          <motion.div
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-eyebrow">Visual Feast</p>
            <h2 className="section-title mt-2">
              The <span className="text-gold-shimmer">Gallery</span>
            </h2>
          </motion.div>
        </div>

        {/* Masonry grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[170px]"
          style={{ gridAutoRows: "170px" }}
        >
          {galleryItems.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[800] flex items-center justify-center p-8"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full rounded-2xl overflow-hidden text-center"
              style={{
                background: "linear-gradient(145deg, #1a0a0b, #111)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className="h-72 flex items-center justify-center text-9xl"
                style={{ background: "radial-gradient(ellipse at center, rgba(107,15,26,0.5) 0%, transparent 70%)" }}
              >
                {selected.emoji}
              </div>

              <div className="p-8">
                <h3 className="font-royal text-2xl text-ivory mb-2">{selected.label}</h3>
                <p className="font-cormo text-sm text-ivory/40">Kila Darbar · Royal Mughal Cuisine</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
