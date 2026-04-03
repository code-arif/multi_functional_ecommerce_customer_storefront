import { defineStore } from "pinia";
import { ref } from "vue";
import { orderApi } from "@/services/orderService";
import { useToast } from "vue-toastification";

export const useOrderStore = defineStore("order", () => {
  const orders = ref([]);
  const pagination = ref(null);
  const loading = ref(false);
  const placing = ref(false);

  async function fetchOrders(page = 1) {
    loading.value = true;
    try {
      const res = await orderApi.list({ page, per_page: 15 });
      orders.value = res.data.data || [];
      pagination.value = res.data.pagination;
    } finally {
      loading.value = false;
    }
  }

  async function placeOrder(data) {
    placing.value = true;
    try {
      const res = await orderApi.checkout(data);
      return res.data.data;
    } catch (e) {
      useToast().error(e.response?.data?.message || "Failed to place order.");
      throw e;
    } finally {
      placing.value = false;
    }
  }

  async function cancelOrder(orderNumber) {
    try {
      await orderApi.cancel(orderNumber);
      useToast().success("Order cancelled successfully.");
      await fetchOrders();
    } catch (e) {
      useToast().error(
        e.response?.data?.message || "Cannot cancel this order.",
      );
    }
  }

  return {
    orders,
    pagination,
    loading,
    placing,
    fetchOrders,
    placeOrder,
    cancelOrder,
  };
});
