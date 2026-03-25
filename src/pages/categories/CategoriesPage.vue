<template>
    <div>
        <PageHeader title="Categories" subtitle="Manage product categories">
            <button @click="openForm()" class="btn-primary">
                <PlusIcon class="w-4 h-4" /> Add Category
            </button>
        </PageHeader>
        <DataTable :items="categories" :columns="columns" :loading="loading" empty-icon="🏷️"
            empty-text="No categories yet">
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover" />
                            <span v-else class="w-full h-full flex items-center justify-center text-lg">🏷️</span>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900 text-sm">{{ item.name }}</p>
                            <p class="text-xs text-gray-400">/{{ item.slug }}</p>
                        </div>
                    </div>
                </td>
                <td class="table-cell text-sm text-gray-600">{{ item.parent?.name || '—' }}</td>
                <td class="table-cell text-sm text-gray-700">{{ item.products_count || 0 }}</td>
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

        <!-- Form Modal -->
        <Teleport to="body">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showForm = false" />
                <div class="relative bg-white rounded-2xl p-6 w-full max-w-md animate-in"
                    style="box-shadow:0 20px 60px rgba(0,0,0,0.15)">
                    <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit' : 'Add' }} Category</h2>
                    <form @submit.prevent="save" class="space-y-4">
                        <div><label class="label">Name *</label><input v-model="form.name" required class="input" />
                        </div>
                        <div><label class="label">Parent Category</label>
                            <select v-model.number="form.parent_id" class="input">
                                <option :value="null">None (Root Category)</option>
                                <option v-for="c in flatCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </div>
                        <div><label class="label">Description</label><textarea v-model="form.description" rows="2"
                                class="input" /></div>
                        <div><label class="label">Image</label>
                            <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]"
                                class="input" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="label">Sort Order</label><input v-model.number="form.sort_order"
                                    type="number" class="input" /></div>
                            <div class="flex items-end pb-1">
                                <label class="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" v-model="form.is_active" class="accent-[#2E7D32]" /> Active
                                </label>
                            </div>
                        </div>
                        <div class="flex gap-3 pt-2">
                            <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">{{
                                saving ?'Saving...':'Save Category' }}</button>
                            <button type="button" @click="showForm = false" class="btn-ghost px-5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
        <ConfirmModal :show="!!deleteTarget" title="Delete Category" :message="`Delete '${deleteTarget?.name}'?`"
            :loading="deleting" @confirm="doDelete" @cancel="deleteTarget = null" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { categoryApi } from '@/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const categories = ref([]), loading = ref(true), showForm = ref(false), saving = ref(false)
const editing = ref(null), deleteTarget = ref(null), deleting = ref(false), imageFile = ref(null)
const form = reactive({ name: '', parent_id: null, description: '', sort_order: 0, is_active: true })
const columns = [
    { key: 'name', label: 'Category' },
    { key: 'parent', label: 'Parent', class: 'w-32' },
    { key: 'products', label: 'Products', class: 'w-24' },
    { key: 'status', label: 'Status', class: 'w-24' },
    { key: 'actions', label: '', class: 'w-24 text-right' },
]
const flatCategories = computed(() => categories.value.filter(c => !editing.value || c.id !== editing.value.id))

async function load() {
    loading.value = true
    try { const r = await categoryApi.list(); categories.value = r.data.data || [] } finally { loading.value = false }
}
function openForm(item = null) {
    editing.value = item
    if (item) Object.assign(form, { name: item.name, parent_id: item.parent_id, description: item.description || '', sort_order: item.sort_order || 0, is_active: item.is_active })
    else Object.assign(form, { name: '', parent_id: null, description: '', sort_order: 0, is_active: true })
    showForm.value = true; imageFile.value = null
}
async function save() {
    saving.value = true
    try {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v) })
        if (imageFile.value) fd.append('image', imageFile.value)
        if (editing.value) await categoryApi.update(editing.value.id, fd)
        else await categoryApi.store(fd)
        toast.success('Category saved.'); showForm.value = false; load()
    } finally { saving.value = false }
}
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() {
    deleting.value = true
    try { await categoryApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false }
}
onMounted(load)
</script>