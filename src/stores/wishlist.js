import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { wishlistApi } from "@/api";
import { useToast } from "vue-toastification";

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref([]);
  const loading = ref(false);
  const ids = computed(() => items.value.map((p) => p.id));

  async function fetchWishlist() {
    loading.value = true;
    try {
      const res = await wishlistApi.list();
      items.value = res.data.data || [];
    } finally {
      loading.value = false;
    }
  }

  async function toggle(productId) {
    try {
      const res = await wishlistApi.toggle(productId);
      if (res.data.data.in_wishlist) {
        useToast().success("Added to wishlist ❤️");
      } else {
        useToast().info("Removed from wishlist");
        items.value = items.value.filter((p) => p.id !== productId);
      }
      return res.data.data;
    } catch {
      useToast().error("Please log in to use wishlist.");
    }
  }

  async function moveToCart(productId) {
    await wishlistApi.moveToCart(productId);
    items.value = items.value.filter((p) => p.id !== productId);
    useToast().success("Moved to cart!");
  }

  const isWishlisted = (id) => ids.value.includes(id);

  return {
    items,
    loading,
    ids,
    fetchWishlist,
    toggle,
    moveToCart,
    isWishlisted,
  };
});
