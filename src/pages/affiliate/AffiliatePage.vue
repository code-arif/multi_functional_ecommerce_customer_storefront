<template>
    <div>
        <PageHeader title="Affiliate Products" subtitle="Manage external affiliate products">
            <button @click="openForm()" class="btn-primary">
                <PlusIcon class="w-4 h-4" /> Add Affiliate Product
            </button>
        </PageHeader>
        <DataTable :items="products" :columns="columns" :loading="loading" :pagination="pagination" searchable
            @search="q => { search = q; load(1) }" @page="load" empty-icon="🔗">
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img v-if="item.thumbnail_url" :src="item.thumbnail_url"
                                class="w-full h-full object-cover" />
                        </div>
                        <p class="font-semibold text-gray-900 text-sm line-clamp-1">{{ item.title }}</p>
                    </div>
                </td>
                <td class="table-cell text-sm text-gray-600">{{ item.source_platform }}</td>
                <td class="table-cell text-sm font-semibold text-gray-900">{{ item.display_price ?
                    `৳${Number(item.display_price).toLocaleString()}` : '—' }}</td>
                <td class="table-cell text-sm text-gray-600">{{ item.click_count }}</td>
                <td class="table-cell"><span class="badge" :class="item.is_active ? 'badge-green' : 'badge-gray'">{{
                    item.is_active ?'Active':'Inactive' }}</span></td>
                <td class="table-cell text-right">
                    <button @click="openForm(item)" class="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 mr-1">
                        <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(item)" class="p-1.5 rounded-lg text-red-400 hover:bg-red-50">
                        <TrashIcon class="w-4 h-4" />
                    </button>
                </td>
            </template>
        </DataTable>
        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForm = false" />
                <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg animate-in"
                    style="box-shadow:0 20px 60px rgba(0,0,0,0.15)">
                    <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit' : 'Add' }} Affiliate Product</h2>
                    <form @submit.prevent="save" class="space-y-4">
                        <div><label class="label">Product Title *</label><input v-model="form.title" required
                                class="input" />
                        </div>
                        <div><label class="label">Affiliate Link *</label><input v-model="form.affiliate_link" required
                                type="url" class="input" placeholder="https://..." /></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="label">Source Platform *</label><input v-model="form.source_platform"
                                    required class="input" placeholder="Amazon, Daraz..." /></div>
                            <div><label class="label">Display Price</label><input v-model.number="form.display_price"
                                    type="number" min="0" class="input" /></div>
                        </div>
                        <div><label class="label">Description</label><textarea v-model="form.description" rows="3"
                                class="input" /></div>
                        <div><label class="label">Thumbnail</label><input type="file" accept="image/*"
                                @change="e => thumbFile = e.target.files[0]" class="input" /></div>
                        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"
                                v-model="form.is_active" class="accent-[#2E7D32]" /> Active</label>
                        <div class="flex gap-3 pt-2">
                            <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">{{
                                saving?'Saving...':'Save' }}</button>
                            <button type="button" @click="showForm = false" class="btn-ghost px-5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
        <ConfirmModal :show="!!deleteTarget" title="Delete Affiliate Product"
            :message="`Delete '${deleteTarget?.title}'?`" :loading="deleting" @confirm="doDelete"
            @cancel="deleteTarget = null" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { affiliateApi } from '@/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
const toast = useToast()
const products = ref([]), pagination = ref(null), loading = ref(true), showForm = ref(false), saving = ref(false), search = ref('')
const editing = ref(null), deleteTarget = ref(null), deleting = ref(false), thumbFile = ref(null)
const form = reactive({ title: '', affiliate_link: '', source_platform: '', display_price: null, description: '', is_active: true })
const columns = [{ key: 'title', label: 'Product' }, { key: 'platform', label: 'Platform', class: 'w-28' }, { key: 'price', label: 'Price', class: 'w-28' }, { key: 'clicks', label: 'Clicks', class: 'w-20' }, { key: 'status', label: 'Status', class: 'w-20' }, { key: 'actions', label: '', class: 'w-20 text-right' }]
async function load(page = 1) { loading.value = true; try { const r = await affiliateApi.list({ page, search: search.value }); products.value = r.data.data || []; pagination.value = r.data.pagination } finally { loading.value = false } }
function openForm(item = null) { editing.value = item; if (item) Object.assign(form, { title: item.title, affiliate_link: item.affiliate_link, source_platform: item.source_platform, display_price: item.display_price, description: item.description || '', is_active: item.is_active }); else Object.assign(form, { title: '', affiliate_link: '', source_platform: '', display_price: null, description: '', is_active: true }); showForm.value = true; thumbFile.value = null }
async function save() { saving.value = true; try { const fd = new FormData(); Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, v) }); if (thumbFile.value) fd.append('thumbnail', thumbFile.value); if (editing.value) await affiliateApi.update(editing.value.id, fd); else await affiliateApi.store(fd); toast.success('Saved.'); showForm.value = false; load() } finally { saving.value = false } }
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() { deleting.value = true; try { await affiliateApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false } }
onMounted(() => load())
</script>