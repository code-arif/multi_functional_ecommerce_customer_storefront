import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Layout
import AdminLayout from "@/components/layout/AdminLayout.vue";

// Auth
import LoginPage from "@/pages/LoginPage.vue";

// Dashboard
import DashboardPage from "@/pages/DashboardPage.vue";

// Products
import ProductsPage from "@/pages/products/ProductsPage.vue";
import ProductFormPage from "@/pages/products/ProductFormPage.vue";

// Orders
import OrdersPage from "@/pages/orders/OrdersPage.vue";
import OrderDetailPage from "@/pages/orders/OrderDetailPage.vue";

// Users
import UsersPage from "@/pages/users/UsersPage.vue";
import UserDetailPage from "@/pages/users/UserDetailPage.vue";

// Categories
import CategoriesPage from "@/pages/categories/CategoriesPage.vue";

// Brands
import BrandsPage from "@/pages/brands/BrandsPage.vue";

// Coupons
import CouponsPage from "@/pages/coupons/CouponsPage.vue";

// Reviews
import ReviewsPage from "@/pages/reviews/ReviewsPage.vue";

// Affiliate
import AffiliatePage from "@/pages/affiliate/AffiliatePage.vue";

// CMS
import CmsPage from "@/pages/cms/CmsPage.vue";

// Banners
import BannersPage from "@/pages/banners/BannersPage.vue";

// Reports
import ReportsPage from "@/pages/reports/ReportsPage.vue";

// Settings
import SettingsPage from "@/pages/settings/SettingsPage.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guest: true },
  },

  {
    path: "/",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardPage,
      },

      // Products
      {
        path: "products",
        name: "products",
        component: ProductsPage,
      },
      {
        path: "products/create",
        name: "products-create",
        component: ProductFormPage,
      },
      {
        path: "products/:id/edit",
        name: "products-edit",
        component: ProductFormPage,
      },

      // Orders
      {
        path: "orders",
        name: "orders",
        component: OrdersPage,
      },
      {
        path: "orders/:id",
        name: "orders-detail",
        component: OrderDetailPage,
      },

      // Users
      {
        path: "users",
        name: "users",
        component: UsersPage,
      },
      {
        path: "users/:id",
        name: "users-detail",
        component: UserDetailPage,
      },

      // Categories
      {
        path: "categories",
        name: "categories",
        component: CategoriesPage,
      },

      // Brands
      {
        path: "brands",
        name: "brands",
        component: BrandsPage,
      },

      // Coupons
      {
        path: "coupons",
        name: "coupons",
        component: CouponsPage,
      },

      // Reviews
      {
        path: "reviews",
        name: "reviews",
        component: ReviewsPage,
      },

      // Affiliate
      {
        path: "affiliate",
        name: "affiliate",
        component: AffiliatePage,
      },

      // CMS
      {
        path: "cms",
        name: "cms",
        component: CmsPage,
      },

      // Banners
      {
        path: "banners",
        name: "banners",
        component: BannersPage,
      },

      // Reports
      {
        path: "reports",
        name: "reports",
        component: ReportsPage,
      },

      // Settings
      {
        path: "settings",
        name: "settings",
        component: SettingsPage,
      },
    ],
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) return next("/login");
  if (to.meta.guest && auth.isLoggedIn) return next("/");

  next();
});

export default router;
