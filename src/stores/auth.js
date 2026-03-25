import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import { useCartStore } from './cart'
import { useToast } from 'vue-toastification'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)

  const isLoggedIn  = computed(() => !!token.value)
  const isAdmin     = computed(() => user.value?.roles?.includes('admin'))
  const userName    = computed(() => user.value?.name || '')
  const userEmail   = computed(() => user.value?.email || '')
  const userAvatar  = computed(() => user.value?.avatar_url || null)

  function setAuth(userData, authToken) {
    user.value  = userData
    token.value = authToken
    localStorage.setItem('auth_user',  JSON.stringify(userData))
    localStorage.setItem('auth_token', authToken)
  }

  function clearAuth() {
    user.value  = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  async function register(data) {
    loading.value = true
    try {
      const res = await authApi.register(data)
      setAuth(res.data.data.user, res.data.data.token)
      // Merge guest cart after registration
      const cartStore = useCartStore()
      await cartStore.fetchCart()
      useToast().success('Welcome to EcoShop!')
      router.push('/')
    } finally {
      loading.value = false
    }
  }

  async function login(credentials) {
    loading.value = true
    try {
      const res = await authApi.login(credentials)
      setAuth(res.data.data.user, res.data.data.token)
      const cartStore = useCartStore()
      await cartStore.fetchCart()
      useToast().success(`Welcome back, ${res.data.data.user.name}!`)
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try { await authApi.logout() } catch {}
    clearAuth()
    useCartStore().clearLocalCart()
    useToast().info('You have been logged out.')
    router.push('/')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await authApi.me()
      user.value = res.data.data
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    } catch {
      clearAuth()
    }
  }

  async function updateProfile(data) {
    const res = await authApi.updateProfile(data)
    user.value = res.data.data
    localStorage.setItem('auth_user', JSON.stringify(user.value))
    useToast().success('Profile updated successfully.')
    return res.data.data
  }

  return {
    user, token, loading,
    isLoggedIn, isAdmin, userName, userEmail, userAvatar,
    register, login, logout, fetchMe, updateProfile, setAuth, clearAuth,
  }
})