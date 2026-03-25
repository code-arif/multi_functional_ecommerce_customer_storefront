<template>
    <DefaultLayout>
        <div class="container-app py-8 max-w-5xl">
            <h1 class="text-2xl font-black text-gray-900 mb-8">Checkout</h1>

            <div v-if="cart.isEmpty" class="text-center py-16">
                <p class="text-gray-500 mb-4">Your cart is empty.</p>
                <router-link to="/shop" class="btn-primary">Shop Now</router-link>
            </div>

            <form v-else @submit.prevent="placeOrder" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left: Shipping & Payment -->
                <div class="lg:col-span-2 space-y-6">

                    <!-- Saved addresses (for logged-in users) -->
                    <div v-if="auth.isLoggedIn && savedAddresses.length" class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-4">Saved Addresses</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div v-for="addr in savedAddresses" :key="addr.id" @click="fillFromAddress(addr)"
                                class="border-2 rounded-xl p-3 cursor-pointer transition-all text-sm"
                                :class="selectedAddressId === addr.id ? 'border-[#2E7D32] bg-green-pale' : 'border-gray-200 hover:border-gray-400'">
                                <p class="font-semibold text-gray-800">{{ addr.recipient_name }}</p>
                                <p class="text-gray-500 text-xs mt-0.5">{{ addr.address_line1 }}, {{ addr.city }}</p>
                                <p class="text-gray-500 text-xs">{{ addr.phone }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Info -->
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-4">Shipping Information</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                <input v-model="form.shipping_name" required class="input"
                                    placeholder="Recipient full name" />
                                <p v-if="errors.shipping_name" class="text-red-500 text-xs mt-1">{{
                                    errors.shipping_name[0] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                                <input v-model="form.shipping_phone" required class="input"
                                    placeholder="+8801XXXXXXXXX" />
                                <p v-if="errors.shipping_phone" class="text-red-500 text-xs mt-1">{{
                                    errors.shipping_phone[0] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                <input v-model="form.shipping_email" type="email" class="input"
                                    placeholder="Optional" />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
                                <input v-model="form.shipping_address_line1" required class="input"
                                    placeholder="Street address, house number" />
                                <p v-if="errors.shipping_address_line1" class="text-red-500 text-xs mt-1">{{
                                    errors.shipping_address_line1[0] }}</p>
                            </div>
                            <div class="sm:col-span-2">
                                <input v-model="form.shipping_address_line2" class="input"
                                    placeholder="Apartment, floor, landmark (optional)" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                                <input v-model="form.shipping_city" required class="input" placeholder="City" />
                                <p v-if="errors.shipping_city" class="text-red-500 text-xs mt-1">{{
                                    errors.shipping_city[0] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">District</label>
                                <input v-model="form.shipping_state" class="input" placeholder="District / State" />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes</label>
                                <textarea v-model="form.customer_note" rows="2" class="input"
                                    placeholder="Special instructions for your order..." />
                            </div>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-4">Payment Method</h3>
                        <div class="space-y-3">
                            <label v-for="method in paymentMethods" :key="method.value"
                                class="flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all"
                                :class="form.payment_method === method.value ? 'border-[#2E7D32] bg-green-pale' : 'border-gray-200 hover:border-gray-400'">
                                <input type="radio" :value="method.value" v-model="form.payment_method"
                                    class="accent-[#2E7D32]" />
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">{{ method.icon }}</span>
                                    <div>
                                        <p class="font-semibold text-gray-800 text-sm">{{ method.label }}</p>
                                        <p class="text-xs text-gray-500">{{ method.desc }}</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Right: Order Summary -->
                <div class="lg:col-span-1">
                    <div class="card p-5 sticky top-24 space-y-4">
                        <h3 class="font-bold text-gray-900">Order Summary</h3>
                        <div class="space-y-3 max-h-56 overflow-y-auto">
                            <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                                <img :src="item.product?.thumbnail_url || ''"
                                    class="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-medium text-gray-800 line-clamp-1">{{ item.product?.name }}
                                    </p>
                                    <p class="text-xs text-gray-400">Qty: {{ item.quantity }}</p>
                                </div>
                                <span class="text-sm font-bold text-gray-900 shrink-0">{{
                                    settings.formatPrice(item.line_total) }}</span>
                            </div>
                        </div>
                        <div class="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                            <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>{{
                                settings.formatPrice(cart.subtotal) }}</span></div>
                            <div v-if="cart.discount > 0" class="flex justify-between text-green-700">
                                <span>Discount</span><span>−{{ settings.formatPrice(cart.discount) }}</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span :class="shippingFree ? 'text-green-700 font-semibold' : ''">{{
                                    shippingFree ? 'FREE' : settings.formatPrice(settings.shippingCharge) }}</span>
                            </div>
                            <div
                                class="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                                <span>Total</span>
                                <span class="text-[#2E7D32]">{{ settings.formatPrice(orderTotal) }}</span>
                            </div>
                        </div>
                        <button type="submit" :disabled="placing"
                            class="btn-primary w-full justify-center py-4 text-base">
                            <span v-if="placing">Placing Order...</span>
                            <span v-else>Place Order →</span>
                        </button>
                        <p class="text-xs text-gray-400 text-center">🔒 Secure & encrypted checkout</p>
                    </div>
                </div>
            </form>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { checkoutApi, addressApi } from '@/api'
import { useToast } from 'vue-toastification'

const cart = useCartStore(), auth = useAuthStore(), settings = useSettingsStore()
const router = useRouter(), toast = useToast()

const placing = ref(false), errors = ref({})
const savedAddresses = ref([]), selectedAddressId = ref(null)

const form = reactive({
    shipping_name: '', shipping_phone: '', shipping_email: '', shipping_address_line1: '',
    shipping_address_line2: '', shipping_city: '', shipping_state: '', shipping_postal_code: '',
    shipping_country: 'Bangladesh', payment_method: 'cod', customer_note: '',
})

const shippingFree = computed(() => cart.subtotal >= settings.freeShippingOver)
const shippingCost = computed(() => shippingFree.value ? 0 : settings.shippingCharge)
const orderTotal = computed(() => Math.max(0, cart.total + shippingCost.value))

const paymentMethods = [
    { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
    { value: 'bkash', icon: '📱', label: 'bKash', desc: 'Mobile banking payment' },
    { value: 'nagad', icon: '📲', label: 'Nagad', desc: 'Mobile financial service' },
]

function fillFromAddress(addr) {
    selectedAddressId.value = addr.id
    Object.assign(form, {
        shipping_name: addr.recipient_name, shipping_phone: addr.phone,
        shipping_email: addr.email || '', shipping_address_line1: addr.address_line1,
        shipping_address_line2: addr.address_line2 || '', shipping_city: addr.city,
        shipping_state: addr.state || '', shipping_postal_code: addr.postal_code || '',
    })
}

async function placeOrder() {
    placing.value = true; errors.value = {}
    try {
        const res = await checkoutApi.process(form)
        const order = res.data.data
        router.push({ name: 'order-success', params: { number: order.order_number } })
    } catch (e) {
        if (e.response?.status === 422) errors.value = e.response.data.errors || {}
        else toast.error(e.response?.data?.message || 'Failed to place order.')
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
        } catch { }
        // Pre-fill name/email from user
        form.shipping_name = auth.user?.name || ''
        form.shipping_email = auth.user?.email || ''
    }
})
</script>
