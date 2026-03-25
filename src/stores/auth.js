import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api";
import { useToast } from "vue-toastification";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("admin_user") || "null"));
  const token = ref(localStorage.getItem("admin_token") || null);
  const permissions = ref(
    JSON.parse(localStorage.getItem("admin_permissions") || "[]"),
  );

  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => user.value?.name || "Admin");
  const userEmail = computed(() => user.value?.email || "");
  const isAdmin = computed(() => user.value?.roles?.includes("admin"));

  function can(permission) {
    return isAdmin.value || permissions.value.includes(permission);
  }

  async function login(credentials) {
    const res = await authApi.login(credentials);
    const { user: u, token: t, permissions: p } = res.data.data;
    user.value = u;
    token.value = t;
    permissions.value = p || [];
    localStorage.setItem("admin_user", JSON.stringify(u));
    localStorage.setItem("admin_token", t);
    localStorage.setItem("admin_permissions", JSON.stringify(p || []));
    useToast().success(`Welcome back, ${u.name}!`);
    router.push("/");
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {}
    user.value = null;
    token.value = null;
    permissions.value = [];
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_permissions");
    router.push("/login");
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const res = await authApi.me();
      user.value = res.data.data;
      localStorage.setItem("admin_user", JSON.stringify(user.value));
    } catch {
      logout();
    }
  }

  return {
    user,
    token,
    permissions,
    isLoggedIn,
    userName,
    userEmail,
    isAdmin,
    can,
    login,
    logout,
    fetchMe,
  };
});
