import api from "./api";

export const searchService = {
  // GET /api/v1/search
  search: (params) => api.get("/search", { params }),

  // GET /api/v1/search/suggestions?q=
  suggestions: (q) => api.get("/search/suggestions", { params: { q } }),

  // GET /api/v1/search/price-range
  priceRange: () => api.get("/search/price-range"),

  // GET /api/v1/search/facets?q=
  facets: (q = "") => api.get("/search/facets", { params: { q } }),
};
