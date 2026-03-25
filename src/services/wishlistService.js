import api from "./api";

export const wishlistService = {
  // GET /api/v1/wishlist
  list: () => api.get("/wishlist"),

  // POST /api/v1/wishlist  { product_id }
  toggle: (productId) => api.post("/wishlist", { product_id: productId }),

  // POST /api/v1/wishlist/move-to-cart
  moveToCart: (productId) =>
    api.post("/wishlist/move-to-cart", { product_id: productId }),
};
