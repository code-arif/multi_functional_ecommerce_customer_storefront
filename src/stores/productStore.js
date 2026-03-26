import { defineStore } from "pinia";
import { ref } from "vue";
import { productService } from "@/services/productService";

export const useProductStore = defineStore("product", () => {
  const featured = ref([]);
  const newArrivals = ref([]);
  const bestsellers = ref([]);
  const loading = ref(false);

  async function loadHomepageProducts() {
    loading.value = true;
    try {
      const [featRes, newRes, bestRes] = await Promise.allSettled([
        productService.featured(8),
        productService.newArrivals(8),
        productService.bestsellers(8),
      ]);
      if (featRes.status === "fulfilled")
        featured.value = featRes.value.data.data || [];
      if (newRes.status === "fulfilled")
        newArrivals.value = newRes.value.data.data || [];
      if (bestRes.status === "fulfilled")
        bestsellers.value = bestRes.value.data.data || [];
    } finally {
      loading.value = false;
    }
  }

  return { featured, newArrivals, bestsellers, loading, loadHomepageProducts };
});
