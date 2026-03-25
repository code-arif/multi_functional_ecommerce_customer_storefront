import client from "./client";

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (data) => client.post("/auth/register", data),
  login: (data) => client.post("/auth/login", data),
  logout: () => client.post("/auth/logout"),
  logoutAll: () => client.post("/auth/logout-all"),
  me: () => client.get("/auth/me"),
  updateProfile: (data) => client.put("/auth/profile", data),
  updateAvatar: (form) =>
    client.post("/auth/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Addresses ────────────────────────────────────────────────
export const addressApi = {
  list: () => client.get("/addresses"),
  store: (data) => client.post("/addresses", data),
  update: (id, d) => client.put(`/addresses/${id}`, d),
  delete: (id) => client.delete(`/addresses/${id}`),
};

// ─── Products ─────────────────────────────────────────────────
export const productApi = {
  list: (params) => client.get("/products", { params }),
  show: (slug) => client.get(`/products/${slug}`),
  related: (slug) => client.get(`/products/${slug}/related`),
  featured: (limit) => client.get("/products/featured", { params: { limit } }),
  newArrivals: (limit) =>
    client.get("/products/new-arrivals", { params: { limit } }),
  bestsellers: (limit) =>
    client.get("/products/bestsellers", { params: { limit } }),
  reviews: (slug, p) => client.get(`/products/${slug}/reviews`, { params: p }),
};

// ─── Categories ───────────────────────────────────────────────
export const categoryApi = {
  tree: () => client.get("/categories"),
  show: (slug) => client.get(`/categories/${slug}`),
};

// ─── Search ───────────────────────────────────────────────────
export const searchApi = {
  search: (params) => client.get("/search", { params }),
  suggestions: (q) => client.get("/search/suggestions", { params: { q } }),
  priceRange: () => client.get("/search/price-range"),
  facets: (q) => client.get("/search/facets", { params: { q } }),
};

// ─── Cart ─────────────────────────────────────────────────────
export const cartApi = {
  get: () => client.get("/cart"),
  addItem: (data) => client.post("/cart/items", data),
  updateItem: (itemId, qty) =>
    client.put(`/cart/items/${itemId}`, { quantity: qty }),
  removeItem: (itemId) => client.delete(`/cart/items/${itemId}`),
  clear: () => client.delete("/cart"),
  applyCoupon: (code) => client.post("/cart/coupon", { code }),
  removeCoupon: () => client.delete("/cart/coupon"),
};

// ─── Checkout ─────────────────────────────────────────────────
export const checkoutApi = {
  process: (data) => client.post("/checkout", data),
  shippingCost: (subtotal) =>
    client.get("/checkout/shipping-cost", { params: { subtotal } }),
};

// ─── Orders ───────────────────────────────────────────────────
export const orderApi = {
  list: (params) => client.get("/orders", { params }),
  show: (number) => client.get(`/orders/${number}`),
  cancel: (number) => client.post(`/orders/${number}/cancel`),
  trackGuest: (token) => client.get(`/orders/track/${token}`),
};

// ─── Wishlist ─────────────────────────────────────────────────
export const wishlistApi = {
  list: () => client.get("/wishlist"),
  toggle: (id) => client.post("/wishlist", { product_id: id }),
  moveToCart: (id) => client.post("/wishlist/move-to-cart", { product_id: id }),
};

// ─── Reviews ──────────────────────────────────────────────────
export const reviewApi = {
  store: (data) =>
    client.post("/reviews", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── CMS / Content ────────────────────────────────────────────
export const cmsApi = {
  homepage: () => client.get("/cms/homepage"),
  settings: () => client.get("/cms/settings"),
  pages: () => client.get("/cms/pages"),
  page: (slug) => client.get(`/cms/pages/${slug}`),
  banners: (pos) => client.get(`/cms/banners/${pos}`),
};

// ─── SEO ──────────────────────────────────────────────────────
export const seoApi = {
  homepage: () => client.get("/seo/homepage"),
  product: (slug) => client.get(`/seo/product/${slug}`),
  category: (slug) => client.get(`/seo/category/${slug}`),
  page: (slug) => client.get(`/seo/page/${slug}`),
};

// ─── Affiliate ────────────────────────────────────────────────
export const affiliateApi = {
  list: (params) => client.get("/affiliate", { params }),
  show: (slug) => client.get(`/affiliate/${slug}`),
  click: (slug) => client.post(`/affiliate/${slug}/click`),
};

// ─── Notifications ────────────────────────────────────────────
export const notificationApi = {
  list: () => client.get("/notifications"),
  read: (id) => client.post(`/notifications/${id}/read`),
  readAll: () => client.post("/notifications/read-all"),
};

// ─── Chat ─────────────────────────────────────────────────────
export const chatApi = {
  myRoom: () => client.get("/chat/room"),
  messages: (roomId, p) =>
    client.get(`/chat/room/${roomId}/messages`, { params: p }),
  sendMessage: (roomId, d) => client.post(`/chat/room/${roomId}/messages`, d),
};
