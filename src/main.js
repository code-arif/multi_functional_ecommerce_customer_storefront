import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import App from './App.vue'
import router from './router'
import 'vue-toastification/dist/index.css'
import './assets/css/main.css'

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router)
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 3000, maxToasts: 3 })

import { useAuthStore } from './stores/auth'
useAuthStore(pinia).fetchMe().then(() => app.mount('#app'))