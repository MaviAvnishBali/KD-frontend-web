import { api, tokens } from "./client";
import type {
  ApiResponse, PagedResponse,
  AuthResponse, UserProfile, Address,
  Category, MenuItem, Cart, Order, Reservation, Loyalty,
  Banner, Offer,
} from "./types";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  sendOtp:   (phone: string) =>
    api.post<ApiResponse<null>>("auth/send-otp", { phone }),

  verifyOtp: async (phone: string, otp: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>("auth/verify-otp", { phone, otp });
    if (res.data.data) {
      tokens.save(res.data.data.accessToken, res.data.data.refreshToken);
    }
    return res;
  },

  googleLogin: async (idToken: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>("auth/google", { idToken });
    if (res.data.data) {
      tokens.save(res.data.data.accessToken, res.data.data.refreshToken);
    }
    return res;
  },

  guestLogin: async () => {
    const res = await api.post<ApiResponse<AuthResponse>>("auth/guest");
    if (res.data.data) {
      tokens.save(res.data.data.accessToken, res.data.data.refreshToken);
    }
    return res;
  },

  logout: async () => {
    await api.post("auth/logout");
    tokens.clear();
  },
};

// ── User ─────────────────────────────────────────────────────────────────────
export const userApi = {
  getProfile:        () => api.get<ApiResponse<UserProfile>>("users/me"),
  updateProfile:     (data: Partial<UserProfile>) => api.put<ApiResponse<UserProfile>>("users/me", data),
  deleteAccount:     () => api.delete<ApiResponse<null>>("users/me"),
  getAddresses:      () => api.get<ApiResponse<Address[]>>("users/me/addresses"),
  addAddress:        (a: Omit<Address, "id">) => api.post<ApiResponse<Address>>("users/me/addresses", a),
  updateAddress:     (id: string, a: Partial<Address>) => api.put<ApiResponse<Address>>(`users/me/addresses/${id}`, a),
  deleteAddress:     (id: string) => api.delete<ApiResponse<null>>(`users/me/addresses/${id}`),
  setDefaultAddress: (id: string) => api.put<ApiResponse<null>>(`users/me/addresses/${id}/default`),
  updateFcmToken:    (token: string) => api.put<ApiResponse<null>>(`users/me/fcm-token?token=${token}`),
};

// ── Menu ─────────────────────────────────────────────────────────────────────
export const menuApi = {
  getCategories: () => api.get<ApiResponse<Category[]>>("categories"),

  getItems: (params?: {
    categoryId?: number;
    search?:     string;
    page?:       number;
    size?:       number;
  }) => api.get<ApiResponse<PagedResponse<MenuItem>>>("products", { params }),

  getBestSellers: () => api.get<ApiResponse<MenuItem[]>>("products/best-sellers"),
  getRecommended: () => api.get<ApiResponse<MenuItem[]>>("products/recommended"),
  getItem:        (id: string) => api.get<ApiResponse<MenuItem>>(`products/${id}`),
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get:          () => api.get<ApiResponse<Cart>>("cart"),
  addItem:      (menuItemId: string, quantity = 1, note?: string) =>
                  api.post<ApiResponse<Cart>>("cart/items", { menuItemId, quantity, specialInstruction: note }),
  updateItem:   (itemId: string, quantity: number) =>
                  api.put<ApiResponse<Cart>>(`cart/items/${itemId}`, { quantity }),
  removeItem:   (itemId: string) => api.delete<ApiResponse<Cart>>(`cart/items/${itemId}`),
  clear:        () => api.delete<ApiResponse<null>>("cart"),
  applyCoupon:  (code: string) => api.post<ApiResponse<Cart>>(`cart/coupon?code=${code}`),
  removeCoupon: () => api.delete<ApiResponse<Cart>>("cart/coupon"),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const orderApi = {
  list:   (page = 0) => api.get<ApiResponse<PagedResponse<Order>>>("orders/me", { params: { page, size: 10 } }),
  get:    (id: string) => api.get<ApiResponse<Order>>(`orders/${id}`),
  place:  (payload: {
    branchId:     string;
    orderType:    string;
    items:        { menuItemId: string; quantity: number; specialInstruction?: string }[];
    addressId?:   string;
    couponCode?:  string;
    redeemPoints?: number;
    instructions?: string;
  }) => api.post<ApiResponse<Order>>("orders", payload),
  cancel: (id: string) => api.post<ApiResponse<null>>(`orders/${id}/cancel`),
  rate:   (id: string, payload: {
    foodRating:       number;
    restaurantRating: number;
    deliveryRating?:  number;
    comment?:         string;
  }) => api.post<ApiResponse<null>>(`orders/${id}/rate`, payload),
};

// ── Payments ─────────────────────────────────────────────────────────────────
export const paymentApi = {
  createOrder: (orderId: string, method: string) =>
    api.post<ApiResponse<{ gatewayOrderId: string; amount: number; currency: string; keyId: string }>>(
      "payments/create-order", { orderId, method }),
  verify: (payload: {
    orderId:           string;
    gatewayOrderId:    string;
    gatewayPaymentId:  string;
    gatewaySignature:  string;
  }) => api.post<ApiResponse<null>>("payments/verify", payload),
};

// ── Reservations ─────────────────────────────────────────────────────────────
export const reservationApi = {
  create: (payload: {
    branchId:       string;
    customerName:   string;
    customerPhone:  string;
    partySize:      number;
    reservedDate:   string;
    reservedTime:   string;
    occasion?:      string;
    specialRequest?: string;
  }) => api.post<ApiResponse<Reservation>>("reservations", payload),

  list:       () => api.get<ApiResponse<Reservation[]>>("reservations"),
  get:        (id: string) => api.get<ApiResponse<Reservation>>(`reservations/${id}`),
  cancel:     (id: string) => api.delete<ApiResponse<null>>(`reservations/${id}`),
  availability: (branchId: string, date: string, partySize: number) =>
    api.get<ApiResponse<string[]>>("reservations/availability", {
      params: { branchId, date, partySize },
    }),
};

// ── Loyalty ───────────────────────────────────────────────────────────────────
export const loyaltyApi = {
  get: () => api.get<ApiResponse<Loyalty>>("loyalty"),
};

// ── Banners & Offers ──────────────────────────────────────────────────────────
export const bannerApi = {
  list: () => api.get<ApiResponse<Banner[]>>("banners"),
};

export const offerApi = {
  list: () => api.get<ApiResponse<Offer[]>>("offers"),
};
