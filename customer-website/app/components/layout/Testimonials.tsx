"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    text: "The Dum Biryani was absolutely divine! Reminded me of old Hyderabad. Fast delivery and beautifully packed.",
    avatar: "PS",
  },
  {
    name: "Rajesh Mehta",
    rating: 5,
    text: "Booked a table for our anniversary — the decor, food, and service were all royal. Highly recommend the Seekh Kebab platter.",
    avatar: "RM",
  },
  {
    name: "Fatima Ali",
    rating: 5,
    text: "Ordered catering for our family event. 200 guests and every single dish was perfect. Will definitely order again!",
    avatar: "FA",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-royal-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Guests Say</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-royal p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-maroon-600 flex items-center
                               justify-center text-white font-bold text-sm">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-royal-cream">{r.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-brand-gold-500 fill-brand-gold-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">"{r.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
