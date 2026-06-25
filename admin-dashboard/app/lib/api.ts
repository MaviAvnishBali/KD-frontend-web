import axios from "axios";
import { getMockResponse } from "./mock";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/";
const DEV_TOKEN = "dev-bypass-token";

const api = axios.create({ baseURL: BASE, timeout: 30_000 });

api.interceptors.request.use((cfg) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("kd_admin_token") : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;

  if (process.env.NODE_ENV === "development" && token === DEV_TOKEN) {
    const mock = getMockResponse(cfg.url ?? "");
    if (mock !== null) {
      cfg.adapter = async () => ({
        data: { success: true, data: mock, message: null },
        status: 200,
        statusText: "OK",
        headers: {},
        config: cfg,
        request: {},
      });
    }
  }

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
