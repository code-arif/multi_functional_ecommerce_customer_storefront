<template>
    <DefaultLayout>
        <div class="container-app py-16 max-w-2xl">
            <div class="card p-8 text-center">
                <div
                    class="w-20 h-20 bg-green-pale rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-green">
                    <svg class="w-10 h-10 text-[#2E7D32]" fill="none" stroke="currentColor" stroke-width="2.5"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 class="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
                <p class="text-gray-500 mb-6">Thank you for your purchase. Your order is being processed.</p>

                <div v-if="order" class="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Order Number</span>
                        <span class="font-bold text-gray-900">{{ order.order_number }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Payment Method</span>
                        <span class="font-semibold text-gray-700">{{ order.payment_method?.toUpperCase() }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Total Amount</span>
                        <span class="font-bold text-[#2E7D32]">{{ settings.formatPrice(order.total_amount) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Shipping To</span>
                        <span class="font-semibold text-gray-700 text-right">{{ order.shipping_address?.name }}, {{
                            order.shipping_address?.city }}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                        <span class="text-gray-500">Status</span>
                        <span class="badge-green">{{ order.status }}</span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <router-link v-if="auth.isLoggedIn" :to="`/account/orders/${route.params.number}`"
                        class="btn-primary px-8 py-3">
                        Track Order
                    </router-link>
                    <router-link to="/shop" class="btn-secondary px-8 py-3">
                        Continue Shopping
                    </router-link>
                </div>

                <p class="text-xs text-gray-400 mt-6">
                    A confirmation email has been sent to {{ order?.shipping_address?.email || auth.userEmail }}
                </p>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { orderApi } from '@/api'
const route = useRoute(), auth = useAuthStore(), settings = useSettingsStore()
const order = ref(null)
onMounted(async () => {
    try {
        const res = await orderApi.show(route.params.number)
        order.value = res.data.data
    } catch { }
})
</script>