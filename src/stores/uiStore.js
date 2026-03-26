import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cmsService } from "@/services/cmsService";

export const useUiStore = defineStore("ui", () => {
  // ── Sidebar / Mobile menu ────────────────────────────────────
  const mobileMenuOpen = ref(false);
  const miniCartOpen = ref(false);
  const searchOpen = ref(false);

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  }
  function closeMobileMenu() {
    mobileMenuOpen.value = false;
  }
  function toggleMiniCart() {
    miniCartOpen.value = !miniCartOpen.value;
  }
  function closeMiniCart() {
    miniCartOpen.value = false;
  }
  function toggleSearch() {
    searchOpen.value = !searchOpen.value;
  }
  function closeSearch() {
    searchOpen.value = false;
  }

  // ── Site Settings (from /api/v1/cms/settings) ────────────────
  const settings = ref({});
  const settingsLoaded = ref(false);

  async function fetchSettings() {
    if (settingsLoaded.value) return;
    try {
      const res = await cmsService.settings();
      settings.value = res.data.data || {};
      settingsLoaded.value = true;
    } catch {}
  }

  const storeName = computed(() => settings.value.store_name || "EcoShop");
  const currencySymbol = computed(() => settings.value.currency_symbol || "৳");
  const storePhone = computed(() => settings.value.store_phone || "");
  const storeEmail = computed(() => settings.value.store_email || "");
  const freeShippingOver = computed(
    () => Number(settings.value.free_shipping_over) || 1000,
  );
  const shippingCharge = computed(
    () => Number(settings.value.shipping_charge) || 60,
  );
  const socialLinks = computed(() => ({
    facebook: settings.value.facebook_url,
    instagram: settings.value.instagram_url,
    twitter: settings.value.twitter_url,
    youtube: settings.value.youtube_url,
  }));

  function formatPrice(amount) {
    if (amount == null) return `${currencySymbol.value}0`;
    return `${currencySymbol.value}${Number(amount).toLocaleString("en-BD")}`;
  }

  // ── Page loading ─────────────────────────────────────────────
  const pageLoading = ref(false);

  return {
    mobileMenuOpen,
    miniCartOpen,
    searchOpen,
    toggleMobileMenu,
    closeMobileMenu,
    toggleMiniCart,
    closeMiniCart,
    toggleSearch,
    closeSearch,
    settings,
    settingsLoaded,
    fetchSettings,
    storeName,
    currencySymbol,
    storePhone,
    storeEmail,
    freeShippingOver,
    shippingCharge,
    socialLinks,
    formatPrice,
    pageLoading,
  };
});
