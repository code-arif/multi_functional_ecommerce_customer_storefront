import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// Public
import HomePage from "@/pages/HomePage.vue"; // done
import ShopPage from "@/pages/shop/ShopPage.vue"; // done
import ProductPage from "@/pages/shop/ProductPage.vue"; // done
import CategoryPage from "@/pages/shop/CategoryPage.vue";
import SearchPage from "@/pages/shop/SearchPage.vue";
import AffiliatePage from "@/pages/shop/AffiliatePage.vue";
import CartPage from "@/pages/CartPage.vue"; // done
import CheckoutPage from "@/pages/CheckoutPage.vue"; // done
import OrderSuccessPage from "@/pages/OrderSuccessPage.vue"; // done
import TrackOrderPage from "@/pages/TrackOrderPage.vue";

// Auth
import LoginPage from "@/pages/auth/LoginPage.vue"; // done
import RegisterPage from "@/pages/auth/RegisterPage.vue"; // done

// CMS
import CmsPage from "@/pages/CmsPage.vue";

// Account
import AccountLayout from "@/pages/account/AccountLayout.vue"; // done
import ProfilePage from "@/pages/account/ProfilePage.vue"; // done
import OrdersPage from "@/pages/account/OrdersPage.vue"; // done
import OrderDetailPage from "@/pages/account/OrderDetailPage.vue"; // done
import WishlistPage from "@/pages/account/WishlistPage.vue"; // done
import AddressesPage from "@/pages/account/AddressesPage.vue"; // done

// 404
import NotFoundPage from "@/pages/NotFoundPage.vue"; // done

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/shop", name: "shop", component: ShopPage },
  { path: "/product/:slug", name: "product", component: ProductPage },
  { path: "/category/:slug", name: "category", component: CategoryPage },
  { path: "/search", name: "search", component: SearchPage },
  { path: "/affiliate", name: "affiliate", component: AffiliatePage },
  { path: "/cart", name: "cart", component: CartPage },
  { path: "/checkout", name: "checkout", component: CheckoutPage },
  {
    path: "/order-success/:number",
    name: "order-success",
    component: OrderSuccessPage,
  },
  { path: "/track-order", name: "track-order", component: TrackOrderPage },

  // Auth
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: { guest: true },
  },

  // CMS
  { path: "/page/:slug", name: "cms-page", component: CmsPage },

  // Account
  {
    path: "/account",
    component: AccountLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "account", component: ProfilePage },
      { path: "orders", name: "account-orders", component: OrdersPage },
      {
        path: "orders/:number",
        name: "account-order-detail",
        component: OrderDetailPage,
      },
      { path: "wishlist", name: "account-wishlist", component: WishlistPage },
      {
        path: "addresses",
        name: "account-addresses",
        component: AddressesPage,
      },
    ],
  },

  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage },
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
