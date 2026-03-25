VUEEOF
<template>
    <div>
        <PageHeader title="CMS Pages" subtitle="Manage website content pages">
            <button @click="openForm()" class="btn-primary">
                <PlusIcon class="w-4 h-4" /> New Page
            </button>
        </PageHeader>
        <DataTable :items="pages" :columns="columns" :loading="loading" empty-icon="📄">
            <template #default="{ item }">
                <td class="table-cell">
                    <p class="font-semibold text-gray-900 text-sm">{{ item.title }}</p>
                    <p class="text-xs text-gray-400">/{{ item.slug }}</p>
                </td>
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
                <div class="relative bg-white rounded-2xl p-6 w-full max-w-2xl animate-in max-h-[90vh] overflow-y-auto"
                    style="box-shadow:0 20px 60px rgba(0,0,0,0.15)">
                    <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit' : 'New' }} Page</h2>
                    <form @submit.prevent="save" class="space-y-4">
                        <div><label class="label">Page Title *</label><input v-model="form.title" required
                                class="input" />
                        </div>
                        <div><label class="label">Content</label><textarea v-model="form.content" rows="10"
                                class="input font-mono text-sm" placeholder="HTML or plain text content..." /></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="label">Meta Title</label><input v-model="form.meta_title"
                                    class="input" /></div>
                            <div><label class="label">Sort Order</label><input v-model.number="form.sort_order"
                                    type="number" class="input" /></div>
                        </div>
                        <div><label class="label">Meta Description</label><textarea v-model="form.meta_description"
                                rows="2" class="input" /></div>
                        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"
                                v-model="form.is_active" class="accent-[#2E7D32]" /> Active</label>
                        <div class="flex gap-3 pt-2">
                            <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">{{
                                saving?'Saving...':'Save Page' }}</button>
                            <button type="button" @click="showForm = false" class="btn-ghost px-5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
        <ConfirmModal :show="!!deleteTarget" title="Delete Page" :message="`Delete '${deleteTarget?.title}'?`"
            :loading="deleting" @confirm="doDelete" @cancel="deleteTarget = null" />
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { cmsApi } from '@/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
const toast = useToast()
const pages = ref([]), loading = ref(true), showForm = ref(false), saving = ref(false)
const editing = ref(null), deleteTarget = ref(null), deleting = ref(false)
const form = reactive({ title: '', content: '', meta_title: '', meta_description: '', sort_order: 0, is_active: true })
const columns = [{ key: 'title', label: 'Page' }, { key: 'status', label: 'Status', class: 'w-24' }, { key: 'actions', label: '', class: 'w-20 text-right' }]
async function load() { loading.value = true; try { const r = await cmsApi.list(); pages.value = r.data.data || [] } finally { loading.value = false } }
function openForm(item = null) { editing.value = item; if (item) Object.assign(form, { title: item.title, content: item.content || '', meta_title: item.meta_title || '', meta_description: item.meta_description || '', sort_order: item.sort_order || 0, is_active: item.is_active }); else Object.assign(form, { title: '', content: '', meta_title: '', meta_description: '', sort_order: 0, is_active: true }); showForm.value = true }
async function save() { saving.value = true; try { if (editing.value) await cmsApi.update(editing.value.id, form); else await cmsApi.store(form); toast.success('Saved.'); showForm.value = false; load() } finally { saving.value = false } }
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() { deleting.value = true; try { await cmsApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false } }
onMounted(load)
</script>