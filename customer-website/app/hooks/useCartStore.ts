import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "../types/menu";

interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations?: Record<string, string>;
  addons?: string[];
  specialInstruction?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  couponCode: string | null;
  discountAmount: number;
  tipAmount: number;
  deliveryInstructions: string;

  addItem: (item: MenuItem, customizations?: Record<string, string>, addons?: string[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setTip: (amount: number) => void;
  setDeliveryInstructions: (instructions: string) => void;

  deliveryCharge: number;
  gstAmount: number;
  totalAmount: number;
}

const calculateTotals = (items: CartItem[], discount: number, tip: number, delivery: number) => {
  const subtotal = items.reduce(
    (sum, ci) => sum + (ci.item.discountPrice ?? ci.item.price) * ci.quantity,
    0
  );
  const gst = (subtotal - discount) * 0.05;
  const total = subtotal - discount + gst + delivery + tip;
  return { subtotal, gst, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      couponCode: null,
      discountAmount: 0,
      tipAmount: 0,
      deliveryInstructions: "",
      deliveryCharge: 30,
      gstAmount: 0,
      totalAmount: 0,

      addItem: (item, customizations, addons) => {
        set((state) => {
          const existing = state.items.find((ci) => ci.item.id === item.id);
          let newItems: CartItem[];

          if (existing) {
            newItems = state.items.map((ci) =>
              ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
            );
          } else {
            newItems = [...state.items, { item, quantity: 1, customizations, addons }];
          }

          const { subtotal, gst, total } = calculateTotals(
            newItems, state.discountAmount, state.tipAmount, state.deliveryCharge
          );

          return {
            items: newItems,
            totalItems: newItems.reduce((s, ci) => s + ci.quantity, 0),
            subtotal,
            gstAmount: gst,
            totalAmount: total,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const existing = state.items.find((ci) => ci.item.id === itemId);
          let newItems: CartItem[];

          if (existing && existing.quantity > 1) {
            newItems = state.items.map((ci) =>
              ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
            );
          } else {
            newItems = state.items.filter((ci) => ci.item.id !== itemId);
          }

          const { subtotal, gst, total } = calculateTotals(
            newItems, state.discountAmount, state.tipAmount, state.deliveryCharge
          );

          return {
            items: newItems,
            totalItems: newItems.reduce((s, ci) => s + ci.quantity, 0),
            subtotal,
            gstAmount: gst,
            totalAmount: total,
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newItems = quantity === 0
            ? state.items.filter((ci) => ci.item.id !== itemId)
            : state.items.map((ci) => ci.item.id === itemId ? { ...ci, quantity } : ci);

          const { subtotal, gst, total } = calculateTotals(
            newItems, state.discountAmount, state.tipAmount, state.deliveryCharge
          );

          return {
            items: newItems,
            totalItems: newItems.reduce((s, ci) => s + ci.quantity, 0),
            subtotal,
            gstAmount: gst,
            totalAmount: total,
          };
        });
      },

      clearCart: () => set({
        items: [],
        totalItems: 0,
        subtotal: 0,
        couponCode: null,
        discountAmount: 0,
        tipAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
      }),

      getItemQuantity: (itemId) => {
        const item = get().items.find((ci) => ci.item.id === itemId);
        return item?.quantity ?? 0;
      },

      applyCoupon: (code, discount) => {
        set((state) => {
          const { gst, total } = calculateTotals(
            state.items, discount, state.tipAmount, state.deliveryCharge
          );
          return { couponCode: code, discountAmount: discount, gstAmount: gst, totalAmount: total };
        });
      },

      removeCoupon: () => {
        set((state) => {
          const { gst, total } = calculateTotals(
            state.items, 0, state.tipAmount, state.deliveryCharge
          );
          return { couponCode: null, discountAmount: 0, gstAmount: gst, totalAmount: total };
        });
      },

      setTip: (amount) => {
        set((state) => {
          const { gst, total } = calculateTotals(
            state.items, state.discountAmount, amount, state.deliveryCharge
          );
          return { tipAmount: amount, gstAmount: gst, totalAmount: total };
        });
      },

      setDeliveryInstructions: (instructions) => set({ deliveryInstructions: instructions }),
    }),
    { name: "kila-darbar-cart" }
  )
);
