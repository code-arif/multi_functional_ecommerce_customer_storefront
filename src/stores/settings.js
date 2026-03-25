import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cmsApi } from "@/api";

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref({});
  const loaded = ref(false);

  async function fetchSettings() {
    if (loaded.value) return;
    try {
      const res = await cmsApi.settings();
      settings.value = res.data.data;
      loaded.value = true;
    } catch {}
  }

  const storeName = computed(() => settings.value.store_name || "EcoShop");
  const currencySymbol = computed(() => settings.value.currency_symbol || "৳");
  const storePhone = computed(() => settings.value.store_phone || "");
  const storeEmail = computed(() => settings.value.store_email || "");
  const logo = computed(() => settings.value.logo || null);
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
    return `${currencySymbol.value}${Number(amount).toLocaleString("en-BD")}`;
  }

  return {
    settings,
    loaded,
    storeName,
    currencySymbol,
    storePhone,
    storeEmail,
    logo,
    freeShippingOver,
    shippingCharge,
    socialLinks,
    fetchSettings,
    formatPrice,
  };
});
