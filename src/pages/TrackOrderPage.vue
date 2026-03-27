<template>
    <DefaultLayout>
        <div class="container-app py-12 max-w-lg">
            <div class="card p-8">
                <h1 class="text-2xl font-black text-gray-900 mb-6 text-center">Track Your Order</h1>
                <form @submit.prevent="track" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Order Token / Number</label>
                        <input v-model="token" required class="input" placeholder="Enter your order token" />
                    </div>
                    <button type="submit" :disabled="loading" class="btn-primary w-full justify-center py-3">
                        {{ loading ? 'Tracking...' : 'Track Order' }}
                    </button>
                </form>
                <div v-if="order" class="mt-8 space-y-3">
                    <div class="flex justify-between text-sm border-b pb-3">
                        <span class="text-gray-500">Order</span><span class="font-bold">#{{ order.order_number }}</span>
                    </div>
                    <div class="flex justify-between text-sm border-b pb-3">
                        <span class="text-gray-500">Status</span>
                        <span class="font-bold text-[#2E7D32]">{{ order.status }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Total</span><span class="font-bold">{{
                            settings.formatPrice(order.total_amount) }}</span>
                    </div>
                </div>
                <p v-if="error" class="text-red-500 text-sm text-center mt-4">{{ error }}</p>
            </div>
        </div>
    </DefaultLayout>
</template>
<script setup>
import { ref } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { orderApi } from '@/api'
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore(), token = ref(''), order = ref(null), loading = ref(false), error = ref('')
async function track() {
    loading.value = true; error.value = ''; order.value = null
    try { const r = await orderApi.trackGuest(token.value); order.value = r.data.data }
    catch { error.value = 'Order not found. Please check your token.' } finally { loading.value = false }
}
</script>