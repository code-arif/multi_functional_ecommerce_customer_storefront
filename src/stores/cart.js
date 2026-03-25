import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api'
import { useToast } from 'vue-toastification'
import { v4 as uuidv4 } from 'uuid'

export const useCartStore = defineStore('cart', () => {
  const cart     = ref(null)
  const loading  = ref(false)
  const addingId = ref(null) // track which product is being added

  // Ensure guest session ID exists
  function ensureSessionId() {
    let sid = localStorage.getItem('cart_session_id')
    if (!sid) {
      sid = 'guest_' + uuidv4().replace(/-/g, '')
      localStorage.setItem('cart_session_id', sid)
    }
    return sid
  }

  ensureSessionId()

  // ─── Computed ───────────────────────────────────────────────
  const items       = computed(() => cart.value?.items || [])
  const totalItems  = computed(() => cart.value?.total_items || 0)
  const subtotal    = computed(() => cart.value?.subtotal || 0)
  const discount    = computed(() => cart.value?.discount_amount || 0)
  const total       = computed(() => cart.value?.total || 0)
  const coupon      = computed(() => cart.value?.coupon || null)
  const isEmpty     = computed(() => items.value.length === 0)

  const itemCount   = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  // ─── Actions ────────────────────────────────────────────────
  async function fetchCart() {
    try {
      const res = await cartApi.get()
      cart.value = res.data.data
    } catch { cart.value = null }
  }

  async function addItem(productId, variantId = null, quantity = 1) {
    addingId.value = variantId || productId
    try {
      const res = await cartApi.addItem({
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      })
      cart.value = res.data.data
      useToast().success('Added to cart!')
      return true
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to add item.'
      useToast().error(msg)
      return false
    } finally {
      addingId.value = null
    }
  }

  async function updateItem(itemId, quantity) {
    try {
      const res = await cartApi.updateItem(itemId, quantity)
      cart.value = res.data.data
    } catch (e) {
      useToast().error(e.response?.data?.message || 'Update failed.')
    }
  }

  async function removeItem(itemId) {
    try {
      const res = await cartApi.removeItem(itemId)
      cart.value = res.data.data
      useToast().info('Item removed from cart.')
    } catch {
      useToast().error('Failed to remove item.')
    }
  }

  async function clearCart() {
    try {
      await cartApi.clear()
      cart.value = null
    } catch {}
  }

  function clearLocalCart() {
    cart.value = null
  }

  async function applyCoupon(code) {
    try {
      const res = await cartApi.applyCoupon(code)
      cart.value = res.data.data.cart
      useToast().success(`Coupon "${code}" applied! You saved ৳${res.data.data.discount_amount}`)
      return true
    } catch (e) {
      useToast().error(e.response?.data?.message || 'Invalid coupon.')
      return false
    }
  }

  async function removeCoupon() {
    try {
      await cartApi.removeCoupon()
      if (cart.value) {
        cart.value.coupon = null
        cart.value.discount_amount = 0
      }
      useToast().info('Coupon removed.')
    } catch {}
  }

  function isInCart(productId, variantId = null) {
    return items.value.some(i =>
      i.product_id === productId &&
      (variantId ? i.variant_id === variantId : true)
    )
  }

  return {
    cart, loading, addingId,
    items, totalItems, subtotal, discount, total, coupon, isEmpty, itemCount,
    fetchCart, addItem, updateItem, removeItem, clearCart, clearLocalCart,
    applyCoupon, removeCoupon, isInCart, ensureSessionId,
  }
})