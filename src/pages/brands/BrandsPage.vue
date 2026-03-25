<template>
    <div>
        <PageHeader title="Brands" subtitle="Manage product brands">
            <button @click="openForm()" class="btn-primary">
                <PlusIcon class="w-4 h-4" /> Add Brand
            </button>
        </PageHeader>
        <DataTable :items="brands" :columns="columns" :loading="loading" searchable @search="q => { search = q; load() }"
            empty-icon="🏭">
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            <img v-if="item.logo_url" :src="item.logo_url" class="w-full h-full object-contain p-1" />
                            <span v-else class="text-lg">🏭</span>
                        </div>
                        <p class="font-semibold text-gray-900 text-sm">{{ item.name }}</p>
                    </div>
                </td>
                <td class="table-cell text-sm text-gray-500">{{ item.products_count || 0 }} products</td>
                <td class="table-cell"><span class="badge" :class="item.is_active ? 'badge-green' : 'badge-gray'">{{
                    item.is_active ?'Active':'Inactive' }}</span></td>
                <td class="table-cell text-right">
                    <button @click="openForm(item)"
                        class="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition mr-1">
                        <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(item)"
                        class="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition">
                        <TrashIcon class="w-4 h-4" />
                    </button>
                </td>
            </template>
        </DataTable>
        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForm = false" />
                <div class="relative bg-white rounded-2xl p-6 w-full max-w-md animate-in"
                    style="box-shadow:0 20px 60px rgba(0,0,0,0.15)">
                    <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit' : 'Add' }} Brand</h2>
                    <form @submit.prevent="save" class="space-y-4">
                        <div><label class="label">Brand Name *</label><input v-model="form.name" required
                                class="input" /></div>
                        <div><label class="label">Website</label><input v-model="form.website" type="url" class="input"
                                placeholder="https://" /></div>
                        <div><label class="label">Description</label><textarea v-model="form.description" rows="2"
                                class="input" /></div>
                        <div><label class="label">Logo</label><input type="file" accept="image/*"
                                @change="e => logoFile = e.target.files[0]" class="input" /></div>
                        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"
                                v-model="form.is_active" class="accent-[#2E7D32]" /> Active</label>
                        <div class="flex gap-3 pt-2">
                            <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">{{
                                saving ?'Saving...':'Save Brand' }}</button>
                            <button type="button" @click="showForm = false" class="btn-ghost px-5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
        <ConfirmModal :show="!!deleteTarget" title="Delete Brand" :message="`Delete '${deleteTarget?.name}'?`"
            :loading="deleting" @confirm="doDelete" @cancel="deleteTarget = null" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { brandApi } from '@/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
const toast = useToast()
const brands = ref([]), loading = ref(true), showForm = ref(false), saving = ref(false), search = ref('')
const editing = ref(null), deleteTarget = ref(null), deleting = ref(false), logoFile = ref(null)
const form = reactive({ name: '', website: '', description: '', is_active: true })
const columns = [{ key: 'name', label: 'Brand' }, { key: 'products', label: 'Products', class: 'w-32' }, { key: 'status', label: 'Status', class: 'w-24' }, { key: 'actions', label: '', class: 'w-24 text-right' }]
async function load() { loading.value = true; try { const r = await brandApi.list({ search: search.value }); brands.value = r.data.data || [] } finally { loading.value = false } }
function openForm(item = null) { editing.value = item; if (item) Object.assign(form, { name: item.name, website: item.website || '', description: item.description || '', is_active: item.is_active }); else Object.assign(form, { name: '', website: '', description: '', is_active: true }); showForm.value = true; logoFile.value = null }
async function save() { saving.value = true; try { const fd = new FormData(); Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v) }); if (logoFile.value) fd.append('logo', logoFile.value); if (editing.value) await brandApi.update(editing.value.id, fd); else await brandApi.store(fd); toast.success('Saved.'); showForm.value = false; load() } finally { saving.value = false } }
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() { deleting.value = true; try { await brandApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false } }
onMounted(load)
</script>
