"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCategories, useMenuItems } from "../lib/api/hooks";
import { MenuItemCard } from "../components/menu/MenuItemCard";
import { Navbar } from "../components/layout/Navbar";

function MenuPageInner() {
  const searchParams  = useSearchParams();
  const initialCat    = searchParams.get("category") ? Number(searchParams.get("category")) : null;

  const [search,     setSearch]     = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(initialCat);
  const [page,       setPage]       = useState(0);
  const [view,       setView]       = useState<"grid" | "list">("grid");

  const { data: categories } = useCategories();
  const { data: paged, isLoading } = useMenuItems({
    categoryId: categoryId ?? undefined,
    search:     search.trim() || undefined,
    page,
  });

  const items      = paged?.content ?? [];
  const totalPages = paged?.totalPages ?? 1;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="container mx-auto px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <p className="section-eyebrow mb-2">The Royal Spread</p>
            <h1 className="section-title">
              Our <span className="text-gold-shimmer">Menu</span>
            </h1>
            <p className="font-cormo text-ivory/50 mt-3 max-w-lg mx-auto text-lg">
              Every dish a legacy — crafted with heritage and served with grace.
            </p>
          </motion.div>

          {/* Search bar */}
          <div
            className="flex items-center gap-3 mb-8 max-w-xl mx-auto px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <Search className="w-5 h-5 text-gold-400/60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search dishes…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="flex-1 bg-transparent text-ivory placeholder:text-ivory/30 font-cormo text-base outline-none"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(0); }}>
                <X className="w-4 h-4 text-ivory/40 hover:text-ivory transition-colors" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-none">
            <button
              onClick={() => { setCategoryId(null); setPage(0); }}
              className={`flex-none font-royal text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all ${
                categoryId === null
                  ? "bg-gold-400/15 border-gold-400/50 text-gold-400"
                  : "border-gold-400/15 text-ivory/50 hover:text-ivory hover:border-gold-400/30"
              }`}
            >
              All
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoryId(cat.id); setPage(0); }}
                className={`flex-none font-royal text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all ${
                  categoryId === cat.id
                    ? "bg-gold-400/15 border-gold-400/50 text-gold-400"
                    : "border-gold-400/15 text-ivory/50 hover:text-ivory hover:border-gold-400/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* View toggle + count */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-cormo text-ivory/40 text-sm">
              {isLoading ? "Loading…" : `${paged?.totalElements ?? 0} dishes`}
            </p>
            <div className="flex gap-2">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 rounded-lg border transition-all ${
                    view === v ? "border-gold-400/50 text-gold-400" : "border-gold-400/15 text-ivory/40 hover:text-ivory"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          {isLoading ? (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-luxury rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🍽️</p>
              <p className="font-royal text-ivory/40 text-sm tracking-widest uppercase">No dishes found</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${categoryId}-${search}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}
              >
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item as any} variant={view} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-outline-gold py-2 px-5 text-sm disabled:opacity-30"
              >
                Previous
              </button>
              <span className="font-royal text-xs tracking-widest text-ivory/50 uppercase">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-gold py-2 px-5 text-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense>
      <MenuPageInner />
    </Suspense>
  );
}
