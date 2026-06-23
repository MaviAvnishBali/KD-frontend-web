import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.68.140:8080/api/v1/";

const api = axios.create({ baseURL: BASE, timeout: 30_000 });

api.interceptors.request.use((cfg) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("kd_admin_token") : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("kd_admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(err?.response?.data?.message ?? err.message ?? "Error");
  }
);

export default api;
