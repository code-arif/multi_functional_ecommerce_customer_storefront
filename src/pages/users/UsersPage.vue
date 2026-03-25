<template>
    <div>
        <PageHeader title="Customers" :subtitle="`${pagination?.total || 0} registered customers`" />
        <DataTable :items="users" :columns="columns" :loading="loading" :pagination="pagination" searchable
            search-placeholder="Search by name, email..." empty-icon="👥" empty-text="No customers found"
            @search="q => { search = q; load(1) }" @page="load">
            <template #filters>
                <select v-model="statusFilter" @change="load(1)" class="input-sm w-28">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                </select>
            </template>
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {{ item.name?.charAt(0)?.toUpperCase() }}
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900 text-sm">{{ item.name }}</p>
                            <p class="text-gray-400 text-xs">{{ item.email }}</p>
                        </div>
                    </div>
                </td>
                <td class="table-cell text-sm text-gray-600">{{ item.phone || '—' }}</td>
                <td class="table-cell">
                    <StatusBadge :value="item.status" />
                </td>
                <td class="table-cell text-xs text-gray-400">{{ formatDate(item.created_at) }}</td>
                <td class="table-cell text-right">
                    <div class="flex items-center justify-end gap-1">
                        <router-link :to="`/users/${item.id}`" class="btn-ghost text-xs py-1.5 px-3">View</router-link>
                        <select @change="e => changeStatus(item.id, e.target.value)" :value="item.status"
                            class="input-sm w-24 text-xs">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="banned">Ban</option>
                        </select>
                    </div>
                </td>
            </template>
        </DataTable>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { userApi } from '@/api'
const toast = useToast()
const users = ref([]), pagination = ref(null), loading = ref(true), search = ref(''), statusFilter = ref('')
const columns = [
    { key: 'name', label: 'Customer', class: '' },
    { key: 'phone', label: 'Phone', class: 'w-32' },
    { key: 'status', label: 'Status', class: 'w-24' },
    { key: 'joined', label: 'Joined', class: 'w-32' },
    { key: 'actions', label: '', class: 'w-44 text-right' },
]
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }) : '' }
async function load(page = 1) {
    loading.value = true
    try { const r = await userApi.list({ page, search: search.value, status: statusFilter.value }); users.value = r.data.data || []; pagination.value = r.data.pagination } finally { loading.value = false }
}
async function changeStatus(id, status) {
    await userApi.updateStatus(id, status); toast.success('Status updated.'); load()
}
onMounted(() => load())
</script>