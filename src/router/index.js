import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  // ─── Public ───────────────────────────────────────────────
  { path: "/", name: "home", component: () => import("@/pages/HomePage.vue") },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/pages/shop/ShopPage.vue"),
  },
  {
    path: "/product/:slug",
    name: "product",
    component: () => import("@/pages/shop/ProductPage.vue"),
  },
  {
    path: "/category/:slug",
    name: "category",
    component: () => import("@/pages/shop/CategoryPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/pages/shop/SearchPage.vue"),
  },
  {
    path: "/affiliate",
    name: "affiliate",
    component: () => import("@/pages/shop/AffiliatePage.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/pages/CartPage.vue"),
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/pages/CheckoutPage.vue"),
  },
  {
    path: "/order-success/:number",
    name: "order-success",
    component: () => import("@/pages/OrderSuccessPage.vue"),
  },
  {
    path: "/track-order",
    name: "track-order",
    component: () => import("@/pages/TrackOrderPage.vue"),
  },

  // ─── Auth ─────────────────────────────────────────────────
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/LoginPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/auth/RegisterPage.vue"),
    meta: { guest: true },
  },

  // ─── CMS Pages ────────────────────────────────────────────
  {
    path: "/page/:slug",
    name: "cms-page",
    component: () => import("@/pages/CmsPage.vue"),
  },

  // ─── Protected Account ────────────────────────────────────
  {
    path: "/account",
    component: () => import("@/pages/account/AccountLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "account",
        component: () => import("@/pages/account/ProfilePage.vue"),
      },
      {
        path: "orders",
        name: "account-orders",
        component: () => import("@/pages/account/OrdersPage.vue"),
      },
      {
        path: "orders/:number",
        name: "account-order-detail",
        component: () => import("@/pages/account/OrderDetailPage.vue"),
      },
      {
        path: "wishlist",
        name: "account-wishlist",
        component: () => import("@/pages/account/WishlistPage.vue"),
      },
      {
        path: "addresses",
        name: "account-addresses",
        component: () => import("@/pages/account/AddressesPage.vue"),
      },
    ],
  },

  // ─── 404 ──────────────────────────────────────────────────
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0, behavior: "smooth" };
  },
});

// ─── Navigation Guards ────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (to.meta.guest && auth.isLoggedIn) {
    return next({ name: "home" });
  }

  next();
});

export default router;
