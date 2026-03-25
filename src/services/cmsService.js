import api from "./api";

export const cmsService = {
  homepage: () => api.get("/cms/homepage"),
  settings: () => api.get("/cms/settings"),
  pages: () => api.get("/cms/pages"),
  page: (slug) => api.get(`/cms/pages/${slug}`),
  banners: (pos) => api.get(`/cms/banners/${pos}`),
};
