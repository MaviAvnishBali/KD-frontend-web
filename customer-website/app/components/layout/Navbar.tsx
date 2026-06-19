"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X, Sun, Moon, Search, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { useCartStore } from "../../hooks/useCartStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { cn } from "../../lib/utils";

const navLinks = [
  { href: "/",            label: "Home" },
  { href: "/menu",        label: "Menu" },
  { href: "/reservations",label: "Reserve Table" },
  { href: "/offers",      label: "Offers" },
  { href: "/catering",    label: "Catering" },
  { href: "/about",       label: "About" },
  { href: "/contact",     label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totalItems);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 dark:bg-royal-dark/95 backdrop-blur-md shadow-royal border-b border-border"
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="hidden md:flex items-center justify-between bg-royal-maroon text-royal-cream px-6 py-1.5 text-sm">
        <span>📍 123, MG Road, Bangalore | ⏰ 11 AM – 11 PM Daily</span>
        <div className="flex items-center gap-4">
          <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-brand-gold-300 transition-colors">
            <Phone className="w-3 h-3" />
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-royal-maroon rounded-full flex items-center justify-center">
            <span className="text-brand-gold-400 font-mughal text-lg font-bold">K</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-mughal text-royal-maroon dark:text-brand-gold-400 text-lg leading-none font-bold">
              Kila Darbar
            </p>
            <p className="text-xs text-muted-foreground">Royal Mughal Cuisine</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-brand-maroon-800 text-royal-cream"
                  : "text-foreground hover:bg-muted hover:text-royal-maroon"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <Link href="/search" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Search className="w-5 h-5" />
          </Link>

          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-maroon-800 text-royal-cream text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link href="/profile" className="btn-royal py-2 px-4 text-sm hidden sm:flex">
              <User className="w-4 h-4" />
              {user.name?.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-royal py-2 px-4 text-sm hidden sm:flex">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white dark:bg-royal-dark border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-all",
                    pathname === link.href
                      ? "bg-brand-maroon-800 text-royal-cream"
                      : "hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex gap-3">
                {user ? (
                  <Link href="/profile" className="btn-royal flex-1 py-2 text-sm justify-center">
                    My Account
                  </Link>
                ) : (
                  <Link href="/auth/login" className="btn-royal flex-1 py-2 text-sm justify-center">
                    Sign In
                  </Link>
                )}
                <Link href="/cart" className="btn-outline-royal flex-1 py-2 text-sm justify-center">
                  Cart ({cartCount})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
