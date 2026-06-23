"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Menu, X, Phone, User, LogOut, ClipboardList, CalendarCheck } from "lucide-react";
import { useCart } from "../../lib/api/hooks";
import { useAuthStore } from "../../hooks/useAuthStore";
import { cn } from "../../lib/utils";

const navLinks = [
  { href: "/",             label: "Home" },
  { href: "/menu",         label: "Menu" },
  { href: "/reservations", label: "Reserve" },
  { href: "/offers",       label: "Offers" },
  { href: "/catering",     label: "Catering" },
  { href: "/about",        label: "Our Story" },
  { href: "/contact",      label: "Contact" },
];

function MughalLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 group magnetic">
      {/* Ornamental crest */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #6B0F1A, #3d0409)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}
        />
        <svg viewBox="0 0 40 40" className="relative z-10 w-7 h-7">
          <text
            x="50%" y="56%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-royal"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "16px",
              fill: "#D4AF37",
              fontWeight: 600,
            }}
          >
            ک
          </text>
        </svg>
      </div>

      {/* Name */}
      <div>
        <p
          className="font-royal text-base leading-none tracking-[0.08em] text-ivory"
          style={{ textShadow: "0 0 20px rgba(212,175,55,0.2)" }}
        >
          KILA DARBAR
        </p>
        <p className="text-[9px] tracking-[0.35em] uppercase text-gold-400/70 mt-0.5">
          Royal Mughal Cuisine
        </p>
      </div>
    </Link>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative font-royal text-[11px] tracking-[0.2em] uppercase py-1 transition-colors duration-300 magnetic",
        active ? "text-gold-400" : "text-ivory/60 hover:text-ivory"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute -bottom-1 left-0 right-0 h-px bg-gold-400"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 font-royal text-[11px] tracking-[0.2em] uppercase text-ivory/60 hover:text-gold-400 transition-colors magnetic"
      >
        <User className="w-4 h-4" />
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-obsidian magnetic"
        style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}
      >
        {user.name?.charAt(0)?.toUpperCase() ?? "U"}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[198]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-3 w-52 z-[199] rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a0a0b, #111)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <div className="px-4 py-3 border-b border-gold-400/10">
                <p className="font-royal text-xs text-ivory truncate">{user.name ?? "Guest"}</p>
                <p className="font-cormo text-xs text-ivory/40 truncate mt-0.5">{user.phone ?? user.email ?? ""}</p>
              </div>
              {[
                { href: "/profile",      icon: <User className="w-3.5 h-3.5" />,         label: "My Profile" },
                { href: "/orders",       icon: <ClipboardList className="w-3.5 h-3.5" />, label: "My Orders" },
                { href: "/reservations", icon: <CalendarCheck className="w-3.5 h-3.5" />, label: "Reservations" },
              ].map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 font-royal text-[11px] tracking-[0.15em] uppercase text-ivory/60 hover:text-gold-400 hover:bg-gold-400/5 transition-colors"
                >
                  {icon} {label}
                </Link>
              ))}
              <div className="border-t border-gold-400/10">
                <button
                  onClick={async () => { setOpen(false); await logout(); router.push("/"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-royal text-[11px] tracking-[0.15em] uppercase text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname  = usePathname();
  const { data: cart } = useCart();
  const { user }       = useAuthStore();
  const cartCount = cart?.itemCount ?? 0;

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const topBarH    = useTransform(scrollY, [0, 60], ["2.5rem", "0rem"]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else         document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[200]">
      {/* Top announcement bar */}
      <motion.div
        style={{ height: topBarH, overflow: "hidden" }}
        className="bg-maroon-800 text-ivory/80 text-xs"
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <span className="font-cormo tracking-wide">
            📍 123, MG Road, Bangalore &nbsp;|&nbsp; ⏰ 11 AM – 11 PM Daily
          </span>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors font-royal text-[10px] tracking-widest"
          >
            <Phone className="w-3 h-3" />
            +91 98765 43210
          </a>
        </div>
      </motion.div>

      {/* Main nav */}
      <motion.nav
        style={{ backgroundColor: scrolled ? undefined : "transparent" }}
        className={cn(
          "relative transition-all duration-500",
          scrolled && "glass border-b border-gold-400/10"
        )}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <MughalLogo />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href={user ? "/cart" : "/auth/login?returnUrl=/cart"}
              className="relative p-2 text-ivory/70 hover:text-gold-400 transition-colors magnetic"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-obsidian"
                    style={{ background: "#D4AF37" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden p-2 text-ivory/70 hover:text-gold-400 transition-colors magnetic"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-[-1]"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-[300] flex flex-col"
              style={{
                background: "linear-gradient(135deg, #1a0a0b, #111111)",
                borderLeft: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              {/* Close */}
              <div className="flex items-center justify-between p-6 border-b border-gold-400/10">
                <span className="font-royal text-xs tracking-widest uppercase text-gold-400">Menu</span>
                <button onClick={() => setIsOpen(false)} className="text-ivory/50 hover:text-gold-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block py-3 font-royal text-[13px] tracking-[0.2em] uppercase border-b border-gold-400/8 transition-colors",
                        pathname === link.href
                          ? "text-gold-400"
                          : "text-ivory/60 hover:text-ivory"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom */}
              <div className="p-6 border-t border-gold-400/10">
                <Link
                  href="/reservations"
                  onClick={() => setIsOpen(false)}
                  className="btn-gold w-full justify-center"
                >
                  <span>Book a Table</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
