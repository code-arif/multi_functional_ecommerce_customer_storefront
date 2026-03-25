import api from "./api";

export const categoryService = {
  // Full tree (GET /api/v1/categories)
  tree: () => api.get("/categories"),

  // Single category BY SLUG (GET /api/v1/categories/{slug})
  show: (slug) => api.get(`/categories/${slug}`),
};
