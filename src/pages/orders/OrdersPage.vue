<template>
    <div>
        <PageHeader title="Orders" :subtitle="`${pagination?.total || 0} total orders`" />

        <!-- Status filter tabs -->
        <div class="flex gap-2 mb-5 overflow-x-auto pb-1">
            <button v-for="tab in statusTabs" :key="tab.value" @click="statusFilter = tab.value; load(1)"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                :class="statusFilter === tab.value ? 'bg-[#2E7D32] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'">
                {{ tab.label }}
                <span v-if="tab.count" class="text-[10px] px-1.5 py-0.5 rounded-full"
                    :class="statusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{
                    tab.count }}</span>
            </button>
        </div>

        <DataTable :items="orders" :columns="columns" :loading="loading" :pagination="pagination" searchable
            search-placeholder="Order number, name, phone..." empty-icon="📋" empty-text="No orders found"
            @search="q => { search = q; load(1) }" @page="load">
            <template #default="{ item }">
                <td class="table-cell">
                    <p class="font-bold text-gray-900 text-sm">#{{ item.order_number }}</p>
                    <p class="text-gray-400 text-xs">{{ formatDate(item.created_at) }}</p>
                </td>
                <td class="table-cell">
                    <p class="font-semibold text-gray-800 text-sm">{{ item.shipping_name }}</p>
                    <p class="text-gray-400 text-xs">{{ item.shipping_phone }}</p>
                </td>
                <td class="table-cell">
                    <StatusBadge :value="item.status" />
                </td>
                <td class="table-cell">
                    <StatusBadge :value="item.payment_status" />
                </td>
                <td class="table-cell">
                    <p class="font-bold text-[#2E7D32]">৳{{ Number(item.total_amount).toLocaleString() }}</p>
                    <p class="text-xs text-gray-400 uppercase">{{ item.payment_method }}</p>
                </td>
                <td class="table-cell text-right">
                    <router-link :to="`/orders/${item.id}`" class="btn-ghost text-xs py-1.5 px-3">View →</router-link>
                </td>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { orderApi } from '@/api'

const orders = ref([]), pagination = ref(null), loading = ref(true)
const search = ref(''), statusFilter = ref('')

const statusTabs = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
]

const columns = [
    { key: 'order', label: 'Order', class: 'w-36' },
    { key: 'customer', label: 'Customer', class: '' },
    { key: 'status', label: 'Status', class: 'w-28' },
    { key: 'payment', label: 'Payment', class: 'w-28' },
    { key: 'total', label: 'Total', class: 'w-32' },
    { key: 'actions', label: '', class: 'w-20 text-right' },
]

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }) : '' }

async function load(page = 1) {
    loading.value = true
    try {
        const res = await orderApi.list({ page, search: search.value, status: statusFilter.value, per_page: 20 })
        orders.value = res.data.data || []
        pagination.value = res.data.pagination
    } finally { loading.value = false }
}
onMounted(() => load())
</script>
