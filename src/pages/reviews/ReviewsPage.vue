<template>
    <div>
        <PageHeader title="Reviews" subtitle="Moderate customer reviews" />
        <div class="flex gap-2 mb-4">
            <button v-for="tab in tabs" :key="tab.value" @click="statusFilter = tab.value; load(1)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                :class="statusFilter === tab.value ? 'bg-[#2E7D32] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'">
                {{ tab.label }}
            </button>
        </div>
        <DataTable :items="reviews" :columns="columns" :loading="loading" :pagination="pagination" @page="load"
            empty-icon="⭐">
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-1">
                        <span v-for="i in 5" :key="i" class="text-sm"
                            :class="i <= item.rating ? 'text-yellow-400' : 'text-gray-200'">★</span>
                        <span class="text-xs text-gray-500 ml-1">({{ item.rating }}/5)</span>
                    </div>
                </td>
                <td class="table-cell">
                    <p class="text-sm font-semibold text-gray-800 line-clamp-1">{{ item.title || '—' }}</p>
                    <p class="text-xs text-gray-500 line-clamp-2">{{ item.body || 'No comment' }}</p>
                </td>
                <td class="table-cell text-sm text-gray-600">{{ item.product?.name }}</td>
                <td class="table-cell text-sm text-gray-600">{{ item.user?.name }}</td>
                <td class="table-cell">
                    <StatusBadge :value="item.status" />
                </td>
                <td class="table-cell text-right">
                    <div class="flex items-center justify-end gap-1">
                        <button v-if="item.status !== 'approved'" @click="approve(item.id)"
                            class="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1.5 rounded-lg font-semibold transition">✓
                            Approve</button>
                        <button v-if="item.status !== 'rejected'" @click="reject(item.id)"
                            class="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2.5 py-1.5 rounded-lg font-semibold transition">✕
                            Reject</button>
                        <button @click="confirmDelete(item)" class="p-1.5 rounded-lg text-red-400 hover:bg-red-50">
                            <TrashIcon class="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </template>
        </DataTable>
        <ConfirmModal :show="!!deleteTarget" title="Delete Review" message="Delete this review permanently?"
            :loading="deleting" @confirm="doDelete" @cancel="deleteTarget = null" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { reviewApi } from '@/api'
import { TrashIcon } from '@heroicons/vue/24/outline'
const toast = useToast()
const reviews = ref([]), pagination = ref(null), loading = ref(true), statusFilter = ref('pending')
const deleteTarget = ref(null), deleting = ref(false)
const tabs = [{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }, { value: '', label: 'All' }]
const columns = [{ key: 'rating', label: 'Rating', class: 'w-32' }, { key: 'review', label: 'Review' }, { key: 'product', label: 'Product', class: 'w-36' }, { key: 'user', label: 'Customer', class: 'w-32' }, { key: 'status', label: 'Status', class: 'w-24' }, { key: 'actions', label: '', class: 'w-52 text-right' }]
async function load(page = 1) { loading.value = true; try { const r = await reviewApi.list({ page, status: statusFilter.value }); reviews.value = r.data.data || []; pagination.value = r.data.pagination } finally { loading.value = false } }
async function approve(id) { await reviewApi.approve(id); toast.success('Review approved.'); load() }
async function reject(id) { await reviewApi.reject(id); toast.info('Review rejected.'); load() }
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() { deleting.value = true; try { await reviewApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false } }
onMounted(() => load())
</script>
