"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Clock, CheckCircle, XCircle, Truck, ChefHat, Package } from "lucide-react";
import { useOrders, useCancelOrder } from "../lib/api/hooks";
import { Navbar } from "../components/layout/Navbar";
import { useRequireAuth } from "../hooks/useRequireAuth";
import type { OrderStatus } from "../lib/api/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:          { label: "Pending",          color: "text-yellow-400",  icon: <Clock className="w-4 h-4" /> },
  CONFIRMED:        { label: "Confirmed",         color: "text-blue-400",    icon: <CheckCircle className="w-4 h-4" /> },
  PREPARING:        { label: "Preparing",         color: "text-orange-400",  icon: <ChefHat className="w-4 h-4" /> },
  READY:            { label: "Ready",             color: "text-green-400",   icon: <Package className="w-4 h-4" /> },
  OUT_FOR_DELIVERY: { label: "Out for Delivery",  color: "text-purple-400",  icon: <Truck className="w-4 h-4" /> },
  DELIVERED:        { label: "Delivered",         color: "text-green-500",   icon: <CheckCircle className="w-4 h-4" /> },
  CANCELLED:        { label: "Cancelled",         color: "text-red-400",     icon: <XCircle className="w-4 h-4" /> },
};

function OrdersInner() {
  const { isAuthenticated } = useRequireAuth();
  const searchParams = useSearchParams();
  const highlight    = searchParams.get("highlight");
  const [page, setPage] = useState(0);
  const { data: paged, isLoading } = useOrders(page);
  const cancelOrder = useCancelOrder();

  const orders     = paged?.content ?? [];
  const totalPages = paged?.totalPages ?? 1;

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-eyebrow mb-2">Royal History</p>
            <h1 className="section-title mb-10">
              My <span className="text-gold-shimmer">Orders</span>
            </h1>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-luxury rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-white/5 rounded w-full mb-2" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-5xl mb-4">📜</p>
              <p className="font-royal text-ivory/40 text-sm tracking-widest uppercase">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const statusCfg = STATUS_CONFIG[order.status];
                const isHighlighted = order.id === highlight;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`card-luxury rounded-2xl p-6 transition-all ${isHighlighted ? "ring-1 ring-gold-400/50" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-royal text-xs text-gold-400/60 tracking-widest uppercase mb-1">
                          #{order.orderNumber}
                        </p>
                        <p className="font-royal text-ivory text-base">{order.orderType.replace("_", " ")}</p>
                        <p className="font-cormo text-xs text-ivory/30 mt-0.5">
                          {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 ${statusCfg.color}`}>
                        {statusCfg.icon}
                        <span className="font-royal text-xs tracking-wider uppercase">{statusCfg.label}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="font-cormo text-sm text-ivory/60">{item.name} × {item.quantity}</span>
                          <span className="font-royal text-xs text-ivory/50">₹{item.totalPrice.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-gold-400/10 mb-4" />

                    <div className="flex items-center justify-between">
                      <span className="font-royal text-gold-400">₹{order.totalAmount.toFixed(2)}</span>
                      {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                        <button
                          onClick={() => cancelOrder.mutate(order.id)}
                          disabled={cancelOrder.isPending}
                          className="font-royal text-[10px] tracking-widest text-red-400/60 hover:text-red-400 transition-colors uppercase disabled:opacity-40"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.estimatedMinutes && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <span className="font-cormo text-xs text-ivory/30">
                          ~{order.estimatedMinutes} min remaining
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-outline-gold py-2 px-5 text-sm disabled:opacity-30">Previous</button>
              <span className="font-royal text-xs tracking-widest text-ivory/50 uppercase">Page {page + 1}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-gold py-2 px-5 text-sm disabled:opacity-30">Next</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersInner />
    </Suspense>
  );
}
