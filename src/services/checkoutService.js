import api from "./api";

export const checkoutApi = {
    create: (params) => api.post("/checkout"),
};
