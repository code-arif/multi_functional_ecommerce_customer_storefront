import { v4 as uuidv4 } from "uuid";

/** Debounce a function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Truncate string */
export function truncate(str, max = 80) {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

/** Generate/retrieve guest session ID (maps to X-Session-ID header) */
export function getSessionId() {
  let sid = localStorage.getItem("cart_session_id");
  if (!sid) {
    sid = "guest_" + uuidv4().replace(/-/g, "");
    localStorage.setItem("cart_session_id", sid);
  }
  return sid;
}

/** Parse backend validation errors into flat object */
export function parseErrors(err) {
  return err?.response?.data?.errors ?? {};
}

/** Format date as readable string */
export function formatDate(d, opts = {}) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

/** Storage image URL */
export function storageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${base}/storage/${path}`;
}

/** Order status badge class */
export function orderStatusClass(status) {
  const map = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    processing: "status-processing",
    shipped: "status-shipped",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
  };
  return map[status] ?? "badge-gray";
}
