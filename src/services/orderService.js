import api from "./api";

export const orderApi = {
    list: (params) => api.get("/orders", {params}),
    show: (number) => api.get(`/orders/${number}`),
    cancel: (number) => api.post(`/orders/${number}/cancel`),
    trackGuest: (token) => api.get(`/orders/track/${token}`),
    checkout: (data) => api.post("/checkout", data),
    shippingCost: (subtotal) => api.get("/checkout/shipping-cost", {params: {subtotal}}),
};
