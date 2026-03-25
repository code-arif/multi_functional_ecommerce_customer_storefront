import axios from 'axios'
import { useToast } from 'vue-toastification'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const client = axios.create({ baseURL: BASE, headers: { Accept: 'application/json' }, timeout: 20000 })

client.interceptors.request.use(cfg => {
  const t = localStorage.getItem('admin_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

client.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/login' }
  if (err.response?.status === 403)  useToast().error('Access denied.')
  if (err.response?.status === 500)  useToast().error('Server error. Please try again.')
  return Promise.reject(err)
})

// Auth
export const authApi = {
  login:  d => client.post('/auth/admin/login', d),
  logout: () => client.post('/auth/logout'),
  me:     () => client.get('/auth/me'),
}

// Dashboard
export const dashboardApi = { stats: () => client.get('/admin/dashboard') }

// Products
export const productApi = {
  list:        p => client.get('/admin/products', { params: p }),
  show:        id => client.get(`/admin/products/${id}`),
  store:       d => client.post('/admin/products', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id,d) => client.post(`/admin/products/${id}?_method=PUT`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  destroy:     id => client.delete(`/admin/products/${id}`),
  uploadImage: f => client.post('/admin/products/upload-image', f, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// Categories
export const categoryApi = {
  list:    p  => client.get('/admin/categories', { params: p }),
  store:   d  => client.post('/admin/categories', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id,d) => client.post(`/admin/categories/${id}?_method=PUT`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  destroy: id => client.delete(`/admin/categories/${id}`),
}

// Brands
export const brandApi = {
  list:    p  => client.get('/admin/brands', { params: p }),
  store:   d  => client.post('/admin/brands', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id,d) => client.post(`/admin/brands/${id}?_method=PUT`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  destroy: id => client.delete(`/admin/brands/${id}`),
}

// Orders
export const orderApi = {
  list:         p        => client.get('/admin/orders', { params: p }),
  show:         id       => client.get(`/admin/orders/${id}`),
  updateStatus: (id,d)   => client.patch(`/admin/orders/${id}/status`, d),
  updateNote:   (id,d)   => client.patch(`/admin/orders/${id}/note`, d),
}

// Coupons
export const couponApi = {
  list:    p      => client.get('/admin/coupons', { params: p }),
  store:   d      => client.post('/admin/coupons', d),
  update:  (id,d) => client.put(`/admin/coupons/${id}`, d),
  destroy: id     => client.delete(`/admin/coupons/${id}`),
}

// Reviews
export const reviewApi = {
  list:    p  => client.get('/admin/reviews', { params: p }),
  approve: id => client.post(`/admin/reviews/${id}/approve`),
  reject:  id => client.post(`/admin/reviews/${id}/reject`),
  destroy: id => client.delete(`/admin/reviews/${id}`),
}

// Banners
export const bannerApi = {
  list:    () => client.get('/admin/banners'),
  store:   d  => client.post('/admin/banners', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id,d) => client.post(`/admin/banners/${id}?_method=PUT`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  destroy: id => client.delete(`/admin/banners/${id}`),
}

// Affiliate
export const affiliateApi = {
  list:    p      => client.get('/admin/affiliate-products', { params: p }),
  store:   d      => client.post('/admin/affiliate-products', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id,d) => client.post(`/admin/affiliate-products/${id}?_method=PUT`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  destroy: id     => client.delete(`/admin/affiliate-products/${id}`),
}

// CMS Pages
export const cmsApi = {
  list:    () => client.get('/admin/pages'),
  store:   d  => client.post('/admin/pages', d),
  update:  (id,d) => client.put(`/admin/pages/${id}`, d),
  destroy: id => client.delete(`/admin/pages/${id}`),
}

// Settings
export const settingsApi = {
  list:   ()    => client.get('/admin/settings'),
  update: d     => client.post('/admin/settings', d),
  upload: (k,f) => { const fd=new FormData(); fd.append('key',k); fd.append('file',f); return client.post('/admin/settings/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }) },
}

// Users
export const userApi = {
  list:         p      => client.get('/admin/users', { params: p }),
  show:         id     => client.get(`/admin/users/${id}`),
  updateStatus: (id,s) => client.patch(`/admin/users/${id}/status`, { status: s }),
}

// Reports
export const reportApi = {
  sales:          p => client.get('/admin/reports/sales', { params: p }),
  topProducts:    p => client.get('/admin/reports/top-products', { params: p }),
  ordersByStatus: () => client.get('/admin/reports/orders-by-status'),
  customerGrowth: p => client.get('/admin/reports/customer-growth', { params: p }),
}

// Chat
export const chatApi = {
  rooms:       p       => client.get('/admin/chat/rooms', { params: p }),
  messages:    (id,p)  => client.get(`/admin/chat/room/${id}/messages`, { params: p }),
  send:        (id,d)  => client.post(`/admin/chat/room/${id}/messages`, d),
  close:       id      => client.post(`/admin/chat/room/${id}/close`),
}