import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach stored token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kila-darbar-auth");
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const stored = localStorage.getItem("kila-darbar-auth");
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.refreshToken) {
            const { data } = await axios.post(
              `${api.defaults.baseURL}/auth/refresh`,
              { refreshToken: state.refreshToken }
            );

            const newToken = data.data.accessToken;
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            original.headers.Authorization = `Bearer ${newToken}`;

            // Update persisted state
            const parsed = JSON.parse(stored);
            parsed.state.accessToken = newToken;
            localStorage.setItem("kila-darbar-auth", JSON.stringify(parsed));

            return api(original);
          }
        }
      } catch {
        // Clear auth on refresh failure
        localStorage.removeItem("kila-darbar-auth");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
