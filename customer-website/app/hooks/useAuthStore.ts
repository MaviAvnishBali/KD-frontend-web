import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: string;
  loyaltyPoints: number;
  verified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      sendOtp: async (phone) => {
        set({ isLoading: true });
        try {
          await api.post("/auth/otp/send", { phone });
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (phone, otp) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/otp/verify", { phone, otp });
          const { accessToken, refreshToken, user } = data.data;
          set({ user, accessToken, refreshToken });
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } finally {
          set({ isLoading: false });
        }
      },

      googleLogin: async (idToken) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/google", { idToken });
          const { accessToken, refreshToken, user } = data.data;
          set({ user, accessToken, refreshToken });
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {}
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        const { data } = await api.post("/auth/refresh", { refreshToken });
        set({ accessToken: data.data.accessToken });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.data.accessToken}`;
      },
    }),
    {
      name: "kila-darbar-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
