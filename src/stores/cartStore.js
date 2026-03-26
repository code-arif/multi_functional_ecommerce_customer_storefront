import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cartService } from "@/services/cartService";
import { useToast } from "vue-toastification";

export const useCartStore = defineStore("cart", () => {
  const cart = ref(null);
  const loading = ref(false);
  const addingId = ref(null); // tracks which product is currently being added

  // ── Computed ────────────────────────────────────────────────
  const items = computed(() => cart.value?.items || []);
  const itemCount = computed(() =>
    items.value.reduce((s, i) => s + i.quantity, 0),
  );
  const subtotal = computed(() => cart.value?.subtotal || 0);
  const discount = computed(() => cart.value?.discount_amount || 0);
  const total = computed(() => cart.value?.total || 0);
  const coupon = computed(() => cart.value?.coupon || null);
  const isEmpty = computed(() => items.value.length === 0);

  // ── Actions ─────────────────────────────────────────────────
  async function fetchCart() {
    try {
      const res = await cartService.get();
      cart.value = res.data.data;
    } catch {
      cart.value = null;
    }
  }

  async function addItem(productId, variantId = null, quantity = 1) {
    addingId.value = variantId ?? productId;
    try {
      const res = await cartService.addItem({
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      });
      cart.value = res.data.data;
      useToast().success("Added to cart!");
      return true;
    } catch (e) {
      useToast().error(e.response?.data?.message || "Could not add item.");
      return false;
    } finally {
      addingId.value = null;
    }
  }

  async function updateItem(itemId, quantity) {
    try {
      const res = await cartService.updateItem(itemId, quantity);
      cart.value = res.data.data;
    } catch (e) {
      useToast().error(e.response?.data?.message || "Update failed.");
    }
  }

  async function removeItem(itemId) {
    try {
      const res = await cartService.removeItem(itemId);
      cart.value = res.data.data;
      useToast().info("Item removed.");
    } catch {
      useToast().error("Could not remove item.");
    }
  }

  async function clearCart() {
    try {
      await cartService.clear();
      cart.value = null;
    } catch {}
  }

  async function applyCoupon(code) {
    try {
      const res = await cartService.applyCoupon(code);
      cart.value = res.data.data.cart;
      useToast().success(
        `Coupon applied! You saved ৳${res.data.data.discount_amount}`,
      );
      return true;
    } catch (e) {
      useToast().error(e.response?.data?.message || "Invalid coupon code.");
      return false;
    }
  }

  async function removeCoupon() {
    try {
      await cartService.removeCoupon();
      if (cart.value) {
        cart.value.coupon = null;
        cart.value.discount_amount = 0;
      }
    } catch {}
  }

  function isAdding(id) {
    return addingId.value === id;
  }

  function resetCart() {
    cart.value = null;
  }

  return {
    cart,
    loading,
    addingId,
    items,
    itemCount,
    subtotal,
    discount,
    total,
    coupon,
    isEmpty,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    isAdding,
    resetCart,
  };
});
