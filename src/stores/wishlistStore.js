import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wishlistService } from "@/services/wishlistService";
import { useToast } from "vue-toastification";
import { useAuthStore } from "./authStore";

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref([]);
  const loading = ref(false);
  const ids = computed(() => new Set(items.value.map((p) => p.id)));

  async function fetchWishlist() {
    const auth = useAuthStore();
    if (!auth.isLoggedIn) return;
    loading.value = true;
    try {
      const res = await wishlistService.list();
      items.value = res.data.data || [];
    } finally {
      loading.value = false;
    }
  }

  async function toggle(productId) {
    const auth = useAuthStore();
    if (!auth.isLoggedIn) {
      useToast().warning("Please log in to use wishlist.");
      return null;
    }
    try {
      const res = await wishlistService.toggle(productId);
      const result = res.data.data;
      if (result.in_wishlist) {
        useToast().success("Added to wishlist ❤️");
      } else {
        items.value = items.value.filter((p) => p.id !== productId);
        useToast().info("Removed from wishlist");
      }
      return result;
    } catch {
      useToast().error("Could not update wishlist.");
      return null;
    }
  }

  async function moveToCart(productId) {
    try {
      await wishlistService.moveToCart(productId);
      items.value = items.value.filter((p) => p.id !== productId);
      useToast().success("Moved to cart!");
    } catch (e) {
      useToast().error(e.response?.data?.message || "Could not move item.");
    }
  }

  const isWishlisted = (id) => ids.value.has(id);

  function reset() {
    items.value = [];
  }

  return {
    items,
    loading,
    ids,
    fetchWishlist,
    toggle,
    moveToCart,
    isWishlisted,
    reset,
  };
});
