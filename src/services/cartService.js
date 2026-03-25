import api from "./api";

export const cartService = {
  // GET /api/v1/cart
  get: () => api.get("/cart"),

  // POST /api/v1/cart/items
  addItem: (data) => api.post("/cart/items", data),

  // PUT /api/v1/cart/items/{item}
  updateItem: (itemId, qty) =>
    api.put(`/cart/items/${itemId}`, { quantity: qty }),

  // DELETE /api/v1/cart/items/{item}
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),

  // DELETE /api/v1/cart
  clear: () => api.delete("/cart"),

  // POST /api/v1/cart/coupon
  applyCoupon: (code) => api.post("/cart/coupon", { code }),

  // DELETE /api/v1/cart/coupon
  removeCoupon: () => api.delete("/cart/coupon"),
};
