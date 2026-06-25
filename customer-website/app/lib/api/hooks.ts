"use client";
/**
 * React Query hooks for all API endpoints.
 * Import these directly into components — they handle caching, loading, error states.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  authApi, userApi, menuApi,
  cartApi, orderApi, reservationApi, loyaltyApi,
  bannerApi, offerApi, partyHallApi,
} from "./endpoints";
import type { CreatePartyHallBookingRequest } from "./types";

// ── Query keys ────────────────────────────────────────────────────────────────
export const QK = {
  profile:      ["profile"]               as const,
  addresses:    ["addresses"]             as const,
  categories:   ["categories"]            as const,
  menuItems:    (p?: object) => ["menu-items", p],
  bestSellers:  ["best-sellers"]          as const,
  recommended:  ["recommended"]           as const,
  menuItem:     (id: string) => ["menu-item", id],
  cart:         ["cart"]                  as const,
  orders:       (page = 0) => ["orders", page],
  order:        (id: string) => ["order", id],
  reservations: ["reservations"]          as const,
  reservation:  (id: string) => ["reservation", id],
  availability: (b: string, d: string, n: number) => ["availability", b, d, n],
  loyalty:      ["loyalty"]              as const,
} as const;

// ── Auth ──────────────────────────────────────────────────────────────────────
export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authApi.sendOtp(phone),
    onError: (e: any) => toast.error(e.message ?? "Failed to send OTP"),
  });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authApi.verifyOtp(phone, otp),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.profile });
      toast.success("Welcome to Kila Darbar!");
    },
    onError: (e: any) => toast.error(e.message ?? "Invalid OTP"),
  });
}

export function useGuestLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.guestLogin(),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.profile }),
  });
}

// ── User ─────────────────────────────────────────────────────────────────────
export function useProfile() {
  return useQuery({
    queryKey: QK.profile,
    queryFn:  () => userApi.getProfile().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.profile });
      toast.success("Profile updated");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: QK.addresses,
    queryFn:  () => userApi.getAddresses().then((r) => r.data.data ?? []),
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.addresses });
      toast.success("Address saved");
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.addresses }),
  });
}

// ── Menu ─────────────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: QK.categories,
    queryFn:  () => menuApi.getCategories().then((r) => r.data.data ?? []),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMenuItems(params?: { categoryId?: number; search?: string; page?: number }) {
  return useQuery({
    queryKey: QK.menuItems(params),
    queryFn:  () => menuApi.getItems(params).then((r) => r.data.data),
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: QK.bestSellers,
    queryFn:  () => menuApi.getBestSellers().then((r) => r.data.data ?? []),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: QK.menuItem(id),
    queryFn:  () => menuApi.getItem(id).then((r) => r.data.data),
    enabled:  !!id,
  });
}

// ── Cart ─────────────────────────────────────────────────────────────────────
export function useCart() {
  return useQuery({
    queryKey: QK.cart,
    queryFn:  () => cartApi.get().then((r) => r.data.data),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuItemId, qty, note }: { menuItemId: string; qty?: number; note?: string }) =>
      cartApi.addItem(menuItemId, qty, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.cart });
      toast.success("Added to cart");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) =>
      cartApi.updateItem(itemId, qty),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.cart }),
  });
}

export function useApplyCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.cart });
      toast.success("Coupon applied!");
    },
    onError: (e: any) => toast.error(e.message ?? "Invalid coupon"),
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────
export function useOrders(page = 0) {
  return useQuery({
    queryKey: QK.orders(page),
    queryFn:  () => orderApi.list(page).then((r) => r.data.data),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QK.order(id),
    queryFn:  () => orderApi.get(id).then((r) => r.data.data),
    enabled:  !!id,
    refetchInterval: 15_000,  // Poll every 15s for live tracking
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.place,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.cart });
      qc.invalidateQueries({ queryKey: QK.orders() });
      toast.success("Order placed! We're preparing your royal meal 👑");
      return res.data.data;
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to place order"),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: QK.order(id) });
      qc.invalidateQueries({ queryKey: QK.orders() });
      toast.success("Order cancelled");
    },
  });
}

// ── Reservations ─────────────────────────────────────────────────────────────
export function useReservations() {
  return useQuery({
    queryKey: QK.reservations,
    queryFn:  () => reservationApi.list().then((r) => r.data.data ?? []),
  });
}

export function useAvailableSlots(branchId: string, date: string, partySize: number) {
  return useQuery({
    queryKey: QK.availability(branchId, date, partySize),
    queryFn:  () => reservationApi.availability(branchId, date, partySize).then((r) => r.data.data ?? []),
    enabled:  !!(branchId && date && partySize),
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.reservations });
      toast.success("Table reserved! See you soon 🎉");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.reservations }),
  });
}

// ── Loyalty ───────────────────────────────────────────────────────────────────
export function useLoyalty() {
  return useQuery({
    queryKey: QK.loyalty,
    queryFn:  () => loyaltyApi.get().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

// ── Party Hall ────────────────────────────────────────────────────────────────
export function useMyPartyHallBookings() {
  return useQuery({
    queryKey: ["party-hall-bookings"],
    queryFn:  () => partyHallApi.myBookings().then((r) => r.data.data ?? []),
  });
}

export function useBookPartyHall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePartyHallBookingRequest) => partyHallApi.book(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["party-hall-bookings"] });
      toast.success("Party hall booked! We'll confirm shortly 🎉");
    },
    onError: (e: any) => toast.error(e.message ?? "Booking failed"),
  });
}

export function useCancelPartyHallBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partyHallApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["party-hall-bookings"] }),
  });
}

// ── Banners & Offers ──────────────────────────────────────────────────────────
export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn:  () => bannerApi.list().then((r) => r.data.data ?? []),
    staleTime: 10 * 60 * 1000,
  });
}

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn:  () => offerApi.list().then((r) => r.data.data ?? []),
    staleTime: 5 * 60 * 1000,
  });
}
