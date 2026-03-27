import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast, { POSITION } from "vue-toastification";
import App from "./App.vue";
import router from "./router";
import "vue-toastification/dist/index.css";
import "./assets/css/main.css";

// v2.x
import { createHead } from "@unhead/vue";

const app = createApp(App);
const pinia = createPinia();
const head = createHead(); // <- use it like this

app.use(pinia);
app.use(router);
app.use(head);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  maxToasts: 4,
  newestOnTop: true,
});

// ─── Bootstrap your stores
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import { useSettingsStore } from "./stores/settings";

const auth = useAuthStore(pinia);
const cart = useCartStore(pinia);
const settings = useSettingsStore(pinia);

Promise.all([auth.fetchMe(), cart.fetchCart(), settings.fetchSettings()]).then(
  () => {
    app.mount("#app");
  },
);
