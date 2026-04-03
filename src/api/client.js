import axios from 'axios'
import { useToast } from 'vue-toastification'


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
})

// ─── Request Interceptor ──────────────────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  // Guest cart session ID
  const sessionId = localStorage.getItem('cart_session_id')
  if (sessionId) config.headers['X-Session-ID'] = sessionId

  return config
})

// ─── Response Interceptor ─────────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong.'

    if (status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }

    if (status === 429) {
      const toast = useToast()
      toast.warning('Too many requests. Please slow down.')
    }

    if (status === 503) {
      const toast = useToast()
      toast.info('Store is under maintenance. Please check back soon.')
    }

    return Promise.reject(error)
  }
)

export default client