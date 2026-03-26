import { ref, computed } from "vue";
import { productService } from "@/services/productService";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useToast } from "vue-toastification";

export function useProduct(initialSlug = null) {
  const product = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const cart = useCartStore();
  const wishlist = useWishlistStore();
  const toast = useToast();

  // Variant selection state
  const selectedAttributes = ref({});
  const quantity = ref(1);

  const activeVariant = computed(() => {
    if (!product.value?.variants?.length) return null;
    return (
      product.value.variants.find((v) =>
        Object.entries(selectedAttributes.value).every(
          ([k, val]) => v.attributes?.[k] === val,
        ),
      ) || null
    );
  });

  const displayPrice = computed(() => {
    if (activeVariant.value)
      return activeVariant.value.sale_price ?? activeVariant.value.price;
    return product.value?.sale_price ?? product.value?.price ?? 0;
  });

  const originalPrice = computed(() => {
    if (activeVariant.value) return activeVariant.value.price;
    return product.value?.price ?? 0;
  });

  const isOnSale = computed(() => {
    if (activeVariant.value) return !!activeVariant.value.sale_price;
    return !!product.value?.sale_price;
  });

  const inStock = computed(() => {
    if (activeVariant.value) return activeVariant.value.stock_quantity > 0;
    return product.value?.stock_status === "in_stock";
  });

  const stockQty = computed(() => {
    if (activeVariant.value) return activeVariant.value.stock_quantity;
    return product.value?.stock_quantity ?? 0;
  });

  const primaryImage = computed(() => {
    if (!product.value) return null;
    const images = product.value.images || [];
    const primary = images.find((i) => i.is_primary);
    return (
      primary?.url || images[0]?.url || product.value.thumbnail_url || null
    );
  });

  // ── Methods ──────────────────────────────────────────────────
  async function fetch(slug) {
    loading.value = true;
    error.value = null;
    try {
      const res = await productService.show(slug || initialSlug);
      product.value = res.data.data;
      // Pre-select first attribute value
      product.value.attributes?.forEach((attr) => {
        if (attr.values?.length) {
          selectedAttributes.value[attr.name] = attr.values[0].value;
        }
      });
    } catch (e) {
      error.value = e.response?.data?.message || "Product not found.";
    } finally {
      loading.value = false;
    }
  }

  function selectAttribute(name, value) {
    selectedAttributes.value = { ...selectedAttributes.value, [name]: value };
  }

  function incrementQty() {
    if (quantity.value < Math.min(stockQty.value, 10)) quantity.value++;
  }
  function decrementQty() {
    if (quantity.value > 1) quantity.value--;
  }

  async function addToCart() {
    if (!inStock.value) return;
    if (product.value?.type === "variable" && !activeVariant.value) {
      toast.warning("Please select product options.");
      return;
    }
    await cart.addItem(
      product.value.id,
      activeVariant.value?.id || null,
      quantity.value,
    );
  }

  async function toggleWishlist() {
    if (!product.value) return;
    await wishlist.toggle(product.value.id);
  }

  return {
    product,
    loading,
    error,
    selectedAttributes,
    quantity,
    activeVariant,
    displayPrice,
    originalPrice,
    isOnSale,
    inStock,
    stockQty,
    primaryImage,
    fetch,
    selectAttribute,
    incrementQty,
    decrementQty,
    addToCart,
    toggleWishlist,
  };
}
