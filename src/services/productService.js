import api from "./api";

export const productService = {
  // Public listing (GET /api/v1/products)
  list: (params) => api.get("/products", { params }),

  // Single product BY SLUG (GET /api/v1/products/{slug})
  show: (slug) => api.get(`/products/${slug}`),

  // Related products (GET /api/v1/products/{slug}/related)
  related: (slug) => api.get(`/products/${slug}/related`),

  // Featured (GET /api/v1/products/featured?limit=N)
  featured: (limit = 8) => api.get("/products/featured", { params: { limit } }),

  // New arrivals (GET /api/v1/products/new-arrivals)
  newArrivals: (limit = 8) =>
    api.get("/products/new-arrivals", { params: { limit } }),

  // Bestsellers (GET /api/v1/products/bestsellers)
  bestsellers: (limit = 8) =>
    api.get("/products/bestsellers", { params: { limit } }),

  // Product reviews (GET /api/v1/products/{slug}/reviews)
  reviews: (slug, params) => api.get(`/products/${slug}/reviews`, { params }),
};
