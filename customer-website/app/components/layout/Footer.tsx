"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const links = {
  Explore: [
    { label: "Menu",        href: "/menu" },
    { label: "Reserve",     href: "/reservations" },
    { label: "Offers",      href: "/offers" },
    { label: "Catering",    href: "/catering" },
  ],
  Discover: [
    { label: "Our Story",   href: "/about" },
    { label: "Gallery",     href: "/gallery" },
    { label: "Press",       href: "/press" },
    { label: "Careers",     href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service",href: "/terms" },
    { label: "Refund Policy",   href: "/refunds" },
  ],
};

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0406 0%, #111111 100%)" }}
    >
      {/* Top border */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
      />

      {/* Main content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6B0F1A, #3d0409)",
                  border: "1px solid rgba(212,175,55,0.3)",
                }}
              >
                <span className="font-royal text-xl text-gold-400">ک</span>
              </div>
              <div>
                <p className="font-royal text-lg text-ivory tracking-widest">KILA DARBAR</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400/60">Royal Mughal Cuisine</p>
              </div>
            </div>

            <p className="font-cormo text-base text-ivory/40 leading-relaxed mb-8 max-w-xs">
              Where centuries of Mughal culinary heritage meets contemporary luxury. A dining experience that transcends the ordinary.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-ivory/40 hover:text-gold-400 transition-colors magnetic"
                  style={{ border: "1px solid rgba(212,175,55,0.15)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="font-royal text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-6">{group}</p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="font-cormo text-sm text-ivory/40 hover:text-ivory transition-colors tracking-wide"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div
          className="mt-16 pt-8 flex flex-wrap gap-6 text-ivory/30 font-cormo text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span>📍 123, MG Road, Indiranagar, Bangalore 560038</span>
          <span>⏰ 11 AM – 11 PM Daily</span>
          <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors">
            📞 +91 98765 43210
          </a>
          <a href="mailto:royal@kiladarbar.com" className="hover:text-gold-400 transition-colors">
            ✉ royal@kiladarbar.com
          </a>
        </div>

        {/* Bottom */}
        <div
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-ivory/20 text-xs font-cormo"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "1.5rem" }}
        >
          <span>© {new Date().getFullYear()} Kila Darbar. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Crafted with <span className="text-gold-400">❤</span> for the connoisseur
          </span>
        </div>
      </div>
    </footer>
  );
}
