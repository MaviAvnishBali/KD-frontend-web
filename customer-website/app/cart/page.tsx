"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, Tag, ShoppingBag } from "lucide-react";
import {
  useCart, useUpdateCartItem, useRemoveCartItem,
  useClearCart, useApplyCoupon, usePlaceOrder,
} from "../lib/api/hooks";
import { Navbar } from "../components/layout/Navbar";
import { useRequireAuth } from "../hooks/useRequireAuth";
import toast from "react-hot-toast";

const ORDER_TYPES = ["DELIVERY", "DINE_IN", "TAKEAWAY"] as const;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();
  const { data: cart, isLoading } = useCart();
  const updateItem  = useUpdateCartItem();
  const removeItem  = useRemoveCartItem();
  const clearCart   = useClearCart();
  const applyCoupon = useApplyCoupon();
  const placeOrder  = usePlaceOrder();

  const [couponInput, setCouponInput] = useState("");
  const [orderType,   setOrderType]   = useState<typeof ORDER_TYPES[number]>("DELIVERY");
  const [branchId]                    = useState("1");

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyCoupon.mutate(couponInput.trim());
  };

  const handlePlaceOrder = () => {
    if (!cart?.items.length) return;
    placeOrder.mutate(
      {
        branchId,
        orderType,
        items: cart.items.map((ci) => ({ menuItemId: ci.menuItemId, quantity: ci.quantity })),
        couponCode: cart.appliedCoupon ?? undefined,
      },
      {
        onSuccess: (res) => {
          const orderId = res.data.data?.id;
          router.push(orderId ? `/orders?highlight=${orderId}` : "/orders");
        },
      }
    );
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-eyebrow mb-2">Your Selection</p>
            <h1 className="section-title mb-10">
              Your <span className="text-gold-shimmer">Cart</span>
            </h1>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-luxury rounded-2xl p-5 animate-pulse flex gap-4">
                  <div className="w-20 h-20 bg-white/5 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart?.items.length ? (
            <div className="text-center py-32">
              <ShoppingBag className="w-16 h-16 text-ivory/10 mx-auto mb-6" />
              <p className="font-royal text-ivory/40 text-sm tracking-widest uppercase mb-6">Your cart is empty</p>
              <Link href="/menu" className="btn-gold magnetic">
                <span>Explore Menu</span>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-royal text-xs tracking-widest text-ivory/50 uppercase">{cart.itemCount} items</p>
                  <button
                    onClick={() => clearCart.mutate()}
                    className="font-royal text-[10px] tracking-widest text-ivory/30 hover:text-red-400 transition-colors uppercase"
                  >
                    Clear all
                  </button>
                </div>

                <AnimatePresence>
                  {cart.items.map((ci) => (
                    <motion.div
                      key={ci.menuItemId}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                      className="card-luxury rounded-2xl p-5 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl"
                        style={{ background: "radial-gradient(ellipse, rgba(107,15,26,0.4), #111)" }}>
                        🍽️
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-royal text-sm text-ivory leading-tight mb-1">{ci.name}</h3>
                        <p className="font-royal text-gold-400 text-base">₹{ci.unitPrice}</p>
                        {ci.specialInstruction && (
                          <p className="font-cormo text-xs text-ivory/30 mt-1 italic">{ci.specialInstruction}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => removeItem.mutate(ci.menuItemId)}
                          className="text-ivory/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 rounded-full px-1 py-1" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                          <button
                            onClick={() => {
                              if (ci.quantity > 1) updateItem.mutate({ itemId: ci.menuItemId, qty: ci.quantity - 1 });
                              else removeItem.mutate(ci.menuItemId);
                            }}
                            className="w-7 h-7 rounded-full bg-white/10 text-ivory flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-royal text-ivory w-5 text-center text-sm">{ci.quantity}</span>
                          <button
                            onClick={() => updateItem.mutate({ itemId: ci.menuItemId, qty: ci.quantity + 1 })}
                            className="w-7 h-7 rounded-full bg-white/10 text-ivory flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-royal text-xs text-ivory/60">₹{ci.totalPrice.toFixed(0)}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Coupon */}
                <div className="card-luxury rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gold-400/60" />
                    <span className="font-royal text-xs tracking-widest text-ivory/60 uppercase">Apply Coupon</span>
                  </div>
                  {cart.appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gold-400 bg-gold-400/10 px-3 py-1 rounded-lg border border-gold-400/20">
                        {cart.appliedCoupon}
                      </span>
                      <span className="font-royal text-xs text-green-400">Applied ✓</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="flex-1 bg-transparent text-ivory placeholder:text-ivory/25 font-royal text-sm tracking-widest uppercase outline-none border-b border-gold-400/20 pb-1 focus:border-gold-400/60 transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyCoupon.isPending}
                        className="btn-gold text-xs py-1.5 px-4 disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="space-y-4">
                {/* Order type */}
                <div className="card-luxury rounded-2xl p-5">
                  <p className="font-royal text-xs tracking-widest text-ivory/60 uppercase mb-3">Order Type</p>
                  <div className="flex flex-col gap-2">
                    {ORDER_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-3 rounded-xl border font-royal text-xs tracking-widest uppercase transition-all text-left ${
                          orderType === type
                            ? "bg-gold-400/10 border-gold-400/40 text-gold-400"
                            : "border-gold-400/10 text-ivory/40 hover:text-ivory"
                        }`}
                      >
                        {type.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill */}
                <div className="card-luxury rounded-2xl p-5 space-y-3">
                  <p className="font-royal text-xs tracking-widest text-ivory/60 uppercase mb-4">Bill Summary</p>
                  {[
                    { label: "Subtotal",   value: `₹${cart.subtotal.toFixed(2)}` },
                    { label: "GST (5%)",   value: `₹${cart.gstAmount.toFixed(2)}` },
                    { label: "Delivery",   value: cart.deliveryCharge === 0 ? "Free" : `₹${cart.deliveryCharge}` },
                    ...(cart.discountAmount > 0 ? [{ label: "Discount", value: `-₹${cart.discountAmount.toFixed(2)}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="font-cormo text-sm text-ivory/50">{label}</span>
                      <span className={`font-royal text-sm ${label === "Discount" ? "text-green-400" : "text-ivory/80"}`}>{value}</span>
                    </div>
                  ))}
                  <div className="h-px bg-gold-400/15 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-royal text-sm text-ivory uppercase tracking-wider">Total</span>
                    <span className="font-royal text-xl text-gold-400">₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                  {cart.subtotal < cart.freeDeliveryAbove && (
                    <p className="font-cormo text-xs text-ivory/30 text-center mt-1">
                      Add ₹{(cart.freeDeliveryAbove - cart.subtotal).toFixed(0)} more for free delivery
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending || !cart.items.length}
                  className="btn-gold w-full py-4 text-sm disabled:opacity-50 justify-center"
                >
                  {placeOrder.isPending ? (
                    <span className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                  ) : (
                    <span>Place Order · ₹{cart.totalAmount.toFixed(0)}</span>
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
