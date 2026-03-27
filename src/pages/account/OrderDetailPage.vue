<template>
    <div>
        <div class="flex items-center gap-3 mb-6">
            <router-link to="/account/orders" class="text-gray-400 hover:text-gray-700 transition">←
                Orders</router-link>
            <span class="text-gray-300">/</span>
            <h2 class="text-xl font-black text-gray-900">#{{ route.params.number }}</h2>
        </div>
        <div v-if="loading" class="skeleton h-64 rounded-2xl" />
        <div v-else-if="order" class="space-y-6">
            <!-- Status header -->
            <div class="card p-5 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500">Order Status</p>
                    <span class="badge text-sm px-3 py-1 mt-1" :class="statusBadge(order.status)">{{ order.status
                        }}</span>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total Amount</p>
                    <p class="text-xl font-black text-[#2E7D32]">{{ settings.formatPrice(order.total_amount) }}</p>
                </div>
            </div>
            <!-- Items -->
            <div class="card p-5">
                <h3 class="font-bold text-gray-900 mb-4">Items Ordered</h3>
                <div class="space-y-3">
                    <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4">
                        <img :src="item.product_image ? `/storage/${item.product_image}` : '/images/no_images.jpg'"
                            class="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                        <div class="flex-1">
                            <p class="font-semibold text-gray-800 text-sm">{{ item.product_name }}</p>
                            <p v-if="item.variant_attributes" class="text-xs text-gray-400">
                                {{Object.entries(item.variant_attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}}
                            </p>
                            <p class="text-xs text-gray-500">Qty: {{ item.quantity }} × {{
                                settings.formatPrice(item.unit_price) }}</p>
                        </div>
                        <p class="font-bold text-gray-900">{{ settings.formatPrice(item.subtotal) }}</p>
                    </div>
                </div>
            </div>
            <!-- Shipping + Totals side by side -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="card p-5">
                    <h3 class="font-bold text-gray-900 mb-3">Shipping Address</h3>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p class="font-semibold">{{ order.shipping_address?.name }}</p>
                        <p>{{ order.shipping_address?.address_line1 }}</p>
                        <p>{{ order.shipping_address?.city }}, {{ order.shipping_address?.country }}</p>
                        <p>{{ order.shipping_address?.phone }}</p>
                    </div>
                </div>
                <div class="card p-5">
                    <h3 class="font-bold text-gray-900 mb-3">Payment Summary</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>{{
                            settings.formatPrice(order.subtotal) }}</span></div>
                        <div v-if="order.discount_amount > 0" class="flex justify-between text-green-700">
                            <span>Discount</span><span>−{{ settings.formatPrice(order.discount_amount) }}</span></div>
                        <div class="flex justify-between text-gray-600"><span>Shipping</span><span>{{
                            order.shipping_charge > 0 ? settings.formatPrice(order.shipping_charge):'FREE' }}</span>
                        </div>
                        <div class="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                            <span>Total</span><span class="text-[#2E7D32]">{{ settings.formatPrice(order.total_amount)
                                }}</span></div>
                    </div>
                </div>
            </div>
            <!-- Cancel button -->
            <div v-if="order.can_be_cancelled" class="text-center">
                <button @click="cancelOrder" :disabled="cancelling"
                    class="text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 px-5 py-2 rounded-xl hover:bg-red-50 transition">
                    {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApi } from '@/services/orderService'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'vue-toastification'
const route = useRoute(), router = useRouter(), settings = useSettingsStore(), toast = useToast()
const order = ref(null), loading = ref(true), cancelling = ref(false)
const statusBadge = (s) => ({ pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray')
async function cancelOrder() {
    if (!confirm('Are you sure you want to cancel this order?')) return
    cancelling.value = true
    try { await orderApi.cancel(route.params.number); await loadOrder(); toast.success('Order cancelled.') } finally { cancelling.value = false }
}
async function loadOrder() {
    try { const res = await orderApi.show(route.params.number); order.value = res.data.data } finally { loading.value = false }
}
onMounted(loadOrder)
</script>