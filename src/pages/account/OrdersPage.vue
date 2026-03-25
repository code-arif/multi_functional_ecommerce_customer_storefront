<template>
    <div>
        <h2 class="text-xl font-black text-gray-900 mb-6">My Orders</h2>
        <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="skeleton h-24 rounded-2xl" />
        </div>
        <div v-else-if="!orders.length" class="text-center py-12">
            <p class="text-4xl mb-3">📦</p>
            <p class="text-gray-500">You haven't placed any orders yet.</p>
            <router-link to="/shop" class="btn-primary mt-4 inline-block">Shop Now</router-link>
        </div>
        <div v-else class="space-y-4">
            <router-link v-for="order in orders" :key="order.id" :to="`/account/orders/${order.order_number}`"
                class="card p-4 flex items-center gap-4 hover:border-[#4CAF50] transition-all block">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                        <p class="font-bold text-gray-900 text-sm">#{{ order.order_number }}</p>
                        <span class="badge" :class="statusBadge(order.status)">{{ order.status }}</span>
                    </div>
                    <p class="text-xs text-gray-400">{{ new Date(order.created_at).toLocaleDateString() }} · {{
                        order.items?.length||0 }} items</p>
                </div>
                <div class="text-right shrink-0">
                    <p class="font-bold text-[#2E7D32]">{{ settings.formatPrice(order.total_amount) }}</p>
                    <p class="text-xs text-gray-400 capitalize">{{ order.payment_method }}</p>
                </div>
            </router-link>
            <AppPagination :pagination="pagination" @change="loadOrders" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { orderApi } from '@/api'
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
const orders = ref([]), loading = ref(true), pagination = ref(null)
const statusBadge = (s) => ({ pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray')
async function loadOrders(page = 1) {
    loading.value = true
    try { const res = await orderApi.list({ page }); orders.value = res.data.data || []; pagination.value = res.data.pagination } finally { loading.value = false }
}
onMounted(() => loadOrders())
</script>