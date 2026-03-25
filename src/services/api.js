import axios from "axios";
import { getSessionId } from "@/utils/helpers";

const API_BASE =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 20000,
});

// ── Request interceptor ───────────────────────────────────────
api.interceptors.request.use((config) => {
  // Sanctum Bearer token
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Guest cart session (matches X-Session-ID on backend)
  const sid = getSessionId();
  if (sid) config.headers["X-Session-ID"] = sid;

  return config;
});

// ── Response interceptor ──────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong.";

    if (status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // Redirect handled in router guard, not here
    }

    return Promise.reject(error);
  },
);

export default api;
