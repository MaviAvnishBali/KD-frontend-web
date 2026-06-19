"use client";

import { motion } from "framer-motion";
import { Award, Clock, ChefHat, Leaf } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Royal Recipe Heritage",
    desc: "Recipes passed down through generations of Mughal royal kitchens.",
  },
  {
    icon: ChefHat,
    title: "Master Chefs",
    desc: "Our chefs trained in traditional dum cooking and tandoor techniques.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    desc: "Hot, fresh food delivered to your door in under 45 minutes.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Locally sourced spices and farm-fresh produce every single day.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-brand-maroon-900 dark:bg-royal-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-royal-cream font-mughal">
            Why Choose <span className="text-gradient-gold">Kila Darbar?</span>
          </h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl
                         bg-white/5 border border-white/10 hover:border-brand-gold-500/50
                         transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-gold-500/20 flex items-center justify-center mb-4">
                <f.icon className="w-7 h-7 text-brand-gold-400" />
              </div>
              <h3 className="text-royal-cream font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
