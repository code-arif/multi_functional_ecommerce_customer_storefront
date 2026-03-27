import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService } from "@/services/authService";
import { useToast } from "vue-toastification";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("auth_user") || "null"));
  const token = ref(localStorage.getItem("auth_token") || null);
  const loading = ref(false);

  // ── Computed ────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.roles?.includes("admin"));
  const userName = computed(() => user.value?.name || "");
  const userEmail = computed(() => user.value?.email || "");
  const userAvatar = computed(() => user.value?.avatar_url || null);
  const userInitial = computed(
    () => userName.value.charAt(0).toUpperCase() || "U",
  );

  // ── Helpers ─────────────────────────────────────────────────
  function persist(u, t) {
    user.value = u;
    token.value = t;
    localStorage.setItem("auth_user", JSON.stringify(u));
    localStorage.setItem("auth_token", t);
  }

  function clear() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }

  // ── Actions ─────────────────────────────────────────────────
  async function register(data) {
    loading.value = true;
    try {
      const res = await authService.register(data);
      const { user: u, token: t } = res.data.data;
      persist(u, t);
      useToast().success(`Welcome to EcoShop, ${u.name}!`);
      const redirect = router.currentRoute.value.query.redirect || "/";
      router.push(redirect);
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials) {
    loading.value = true;
    try {
      const res = await authService.login(credentials);
      const { user: u, token: t } = res.data.data;
      persist(u, t);
      useToast().success(`Welcome back, ${u.name}!`);
      const redirect = router.currentRoute.value.query.redirect || "/";
      router.push(redirect);
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {}
    clear();
    useToast().info("You have been logged out.");
    router.push("/");
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const res = await authService.me();
      user.value = res.data.data;
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    } catch {
      clear();
    }
  }

  async function updateProfile(data) {
    const res = await authService.updateProfile(data);
    user.value = res.data.data;
    localStorage.setItem("auth_user", JSON.stringify(user.value));
    useToast().success("Profile updated successfully.");
    return res.data.data;
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    isAdmin,
    userName,
    userEmail,
    userAvatar,
    userInitial,
    register,
    login,
    logout,
    fetchMe,
    updateProfile,
    persist,
    clear,
  };
});
