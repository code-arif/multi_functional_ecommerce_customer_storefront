<template>
  <DefaultLayout>
    <div class="container-app mx-auto px-4 py-10 max-w-7xl">
      <h1 class="text-2xl font-black text-gray-900 mb-8">Checkout</h1>

      <!-- Empty Cart -->
      <div v-if="cart.isEmpty" class="text-center py-16">
        <p class="text-gray-500 mb-4">Your cart is empty.</p>
        <router-link to="/shop" class="btn-primary">Shop Now</router-link>
      </div>

      <!-- Checkout Form -->
      <form v-else @submit.prevent="placeOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- LEFT SIDE -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Saved Addresses -->
          <div v-if="auth.isLoggedIn && savedAddresses.length"
               class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-gray-900 mb-4">Saved Addresses</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="addr in savedAddresses" :key="addr.id"
                   @click="fillFromAddress(addr)"
                   class="border-2 rounded-xl p-3 cursor-pointer transition-all text-sm"
                   :class="selectedAddressId === addr.id
                                    ? 'border-[#2E7D32] bg-green-50'
                                    : 'border-gray-200 hover:border-gray-400'">

                <p class="font-semibold text-gray-800">{{ addr.recipient_name }}</p>
                <p class="text-gray-500 text-xs mt-0.5">
                  {{ addr.address_line1 }}, {{ addr.city }}
                </p>
                <p class="text-gray-500 text-xs">{{ addr.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-gray-900 mb-4">Shipping Information</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div class="sm:col-span-2">
                <label class="label">Full Name *</label>
                <input v-model="form.shipping_name" required class="input"
                       placeholder="Recipient full name"/>
                <p v-if="errors.shipping_name" class="error">{{ errors.shipping_name[0] }}</p>
              </div>

              <div>
                <label class="label">Phone *</label>
                <input v-model="form.shipping_phone" required class="input"
                       placeholder="+8801XXXXXXXXX"/>
                <p v-if="errors.shipping_phone" class="error">{{ errors.shipping_phone[0] }}</p>
              </div>

              <div>
                <label class="label">Email</label>
                <input v-model="form.shipping_email" type="email" class="input"
                       placeholder="Optional"/>
              </div>

              <div class="sm:col-span-2">
                <label class="label">Address *</label>
                <input v-model="form.shipping_address_line1" required class="input"
                       placeholder="Street address, house number"/>
                <p v-if="errors.shipping_address_line1" class="error">
                  {{ errors.shipping_address_line1[0] }}
                </p>
              </div>

              <div class="sm:col-span-2">
                <input v-model="form.shipping_address_line2" class="input"
                       placeholder="Apartment, floor, landmark (optional)"/>
              </div>

              <div>
                <label class="label">City *</label>
                <input v-model="form.shipping_city" required class="input" placeholder="City"/>
                <p v-if="errors.shipping_city" class="error">{{ errors.shipping_city[0] }}</p>
              </div>

              <div>
                <label class="label">District</label>
                <input v-model="form.shipping_state" class="input"
                       placeholder="District / State"/>
              </div>

              <div class="sm:col-span-2">
                <label class="label">Order Notes</label>
                <textarea v-model="form.customer_note" rows="2" class="input"
                          placeholder="Special instructions for your order..."/>
              </div>

            </div>
          </div>

          <!-- Payment -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="font-bold text-gray-900 mb-4">Payment Method</h3>

            <div class="space-y-3">
              <label v-for="method in paymentMethods" :key="method.value"
                     class="flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition"
                     :class="form.payment_method === method.value
                                    ? 'border-[#2E7D32] bg-green-50'
                                    : 'border-gray-200 hover:border-gray-400'">

                <input type="radio" :value="method.value" v-model="form.payment_method"
                       class="accent-[#2E7D32]"/>

                <component :is="method.icon" class="w-5 h-5 text-[#2E7D32]"/>

                <div>
                  <p class="font-semibold text-gray-800 text-sm">{{ method.label }}</p>
                  <p class="text-xs text-gray-500">{{ method.desc }}</p>
                </div>
              </label>
            </div>
          </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24 space-y-4">

            <h3 class="font-bold text-gray-900">Order Summary</h3>

            <div class="space-y-3 max-h-56 overflow-y-auto">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                <img :src="item.product?.thumbnail_url || ''"
                     class="w-14 h-14 rounded-lg object-cover bg-gray-100"/>

                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-800 line-clamp-1">
                    {{ item.product?.name }}
                  </p>
                  <p class="text-xs text-gray-400">Qty: {{ item.quantity }}</p>
                </div>

                <span class="text-sm font-bold text-gray-900">
                                    {{ settings.formatPrice(item.line_total) }}
                                </span>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{{ settings.formatPrice(cart.subtotal) }}</span>
              </div>

              <div v-if="cart.discount > 0" class="flex justify-between text-green-700">
                <span>Discount</span>
                <span>−{{ settings.formatPrice(cart.discount) }}</span>
              </div>

              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span :class="shippingFree ? 'text-green-700 font-semibold' : ''">
                                    {{ shippingFree ? 'FREE' : settings.formatPrice(settings.shippingCharge) }}
                                </span>
              </div>

              <div class="border-t pt-3 flex justify-between font-black text-base">
                <span>Total</span>
                <span class="text-[#2E7D32]">
                                    {{ settings.formatPrice(orderTotal) }}
                                </span>
              </div>
            </div>

            <button type="submit" :disabled="placing"
                    class="w-full bg-[#2E7D32] hover:bg-[#256428] text-white py-3 rounded-xl font-semibold transition flex justify-center items-center gap-2">
              <span v-if="placing">Placing Order...</span>
              <span v-else>Place Order</span>
            </button>

            <p class="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
              <Lock class="w-4 h-4"/>
              Secure & encrypted checkout
            </p>

          </div>
        </div>

      </form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import {useCartStore} from '@/stores/cartStore'
import {useAuthStore} from '@/stores/authStore'
import {useSettingsStore} from '@/stores/settings'
import {useOrderStore} from "@/stores/orderStore.js";
import {useToast} from 'vue-toastification'
import {Banknote, Smartphone, CreditCard, Lock} from 'lucide-vue-next'

const cart = useCartStore(), auth = useAuthStore(), settings = useSettingsStore()
const router = useRouter(), toast = useToast()

const placing = ref(false), errors = ref({})
const savedAddresses = ref([]), selectedAddressId = ref(null)

const orderStore = useOrderStore()

const form = reactive({
  shipping_name: '', shipping_phone: '', shipping_email: '', shipping_address_line1: '',
  shipping_address_line2: '', shipping_city: '', shipping_state: '', shipping_postal_code: '',
  shipping_country: 'Bangladesh', payment_method: 'cod', customer_note: '',
})

const shippingFree = computed(() => cart.subtotal >= settings.freeShippingOver)
const shippingCost = computed(() => shippingFree.value ? 0 : settings.shippingCharge)
const orderTotal = computed(() => Math.max(0, cart.total + shippingCost.value))

const paymentMethods = [
  {value: 'cod', icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when your order arrives'},
  {value: 'bkash', icon: Smartphone, label: 'bKash', desc: 'Mobile banking payment'},
  {value: 'nagad', icon: CreditCard, label: 'Nagad', desc: 'Mobile financial service'},
]

function fillFromAddress(addr) {
  selectedAddressId.value = addr.id
  Object.assign(form, {
    shipping_name: addr.recipient_name,
    shipping_phone: addr.phone,
    shipping_email: addr.email || '',
    shipping_address_line1: addr.address_line1,
    shipping_address_line2: addr.address_line2 || '',
    shipping_city: addr.city,
    shipping_state: addr.state || '',
    shipping_postal_code: addr.postal_code || '',
  })
}

async function placeOrder() {
  placing.value = true
  errors.value = {}

  try {
    const order = await orderStore.placeOrder(form)
    await cart.fetchCart()
    router.push({
      name: 'order-success',
      params: {number: order.order_number}
    })
  } catch (e) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors || {}
      toast.error('Please fix the errors below.')
    } else {
      toast.error(e.response?.data?.message || 'Failed to place order.')
    }
  } finally {
    placing.value = false
  }
}

onMounted(async () => {
  if (auth.isLoggedIn) {
    try {
      const res = await addressApi.list()
      savedAddresses.value = res.data.data || []
      const def = savedAddresses.value.find(a => a.is_default)
      if (def) fillFromAddress(def)
    } catch {
    }

    form.shipping_name = auth.user?.name || ''
    form.shipping_email = auth.user?.email || ''
  }
})
</script>

<style scoped>
.label {
  @apply block text-sm font-semibold text-gray-700 mb-1.5;
}

.input {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]
  outline-none text-sm transition;
}

.error {
  @apply text-red-500 text-xs mt-1;
}
</style>