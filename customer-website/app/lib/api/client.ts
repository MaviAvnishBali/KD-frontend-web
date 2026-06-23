/**
 * Axios client with:
 *   - Automatic Bearer token injection
 *   - Silent JWT refresh on 401 (single-flight)
 *   - Standard error normalisation
 */
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1/";

// ── Token storage (browser only) ─────────────────────────────────────────────
const TOKEN_KEY   = "kd_access_token";
const REFRESH_KEY = "kd_refresh_token";

export const tokens = {
  get access()  { return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY)   : null; },
  get refresh() { return typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null; },
  save(access: string, refresh: string) {
    localStorage.setItem(TOKEN_KEY,   access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  saveAccess(access: string) { localStorage.setItem(TOKEN_KEY, access); },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Axios instance ────────────────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — attach token ───────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokens.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — refresh on 401 ────────────────────────────────────
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = (async () => {
          const rt = tokens.refresh;
          if (!rt) throw new Error("No refresh token");
          const { data } = await axios.post(`${BASE_URL}auth/refresh-token`, {
            refreshToken: rt,
          });
          const newToken: string = data.data.accessToken;
          tokens.saveAccess(newToken);
          return newToken;
        })().finally(() => { refreshing = null; });
      }

      try {
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokens.clear();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(normaliseError(error));
  }
);

// ── Error normalisation ───────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  code:    number;
  errors?: string[];
}

function normaliseError(error: AxiosError): ApiError {
  const data = error.response?.data as any;
  return {
    message: data?.message ?? error.message ?? "An error occurred",
    code:    error.response?.status ?? 0,
    errors:  data?.errors ?? [],
  };
}
