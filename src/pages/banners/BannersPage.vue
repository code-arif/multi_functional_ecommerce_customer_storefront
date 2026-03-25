<template>
    <div>
        <PageHeader title="Banners & Sliders" subtitle="Manage homepage banners and hero sliders">
            <button @click="openForm()" class="btn-primary">
                <PlusIcon class="w-4 h-4" /> Add Banner
            </button>
        </PageHeader>
        <DataTable :items="banners" :columns="columns" :loading="loading" empty-icon="🖼️" empty-text="No banners yet">
            <template #default="{ item }">
                <td class="table-cell">
                    <div class="flex items-center gap-3">
                        <img v-if="item.image_url" :src="item.image_url"
                            class="w-16 h-10 object-cover rounded-lg bg-gray-100 shrink-0" />
                        <div v-else
                            class="w-16 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-300">
                            🖼️</div>
                        <div>
                            <p class="font-semibold text-gray-900 text-sm">{{ item.title }}</p>
                            <p v-if="item.subtitle" class="text-xs text-gray-400 line-clamp-1">{{ item.subtitle }}</p>
                        </div>
                    </div>
                </td>
                <td class="table-cell"><span class="badge badge-blue text-[10px]">{{ item.position?.replace('_', ' ')
                        }}</span></td>
                <td class="table-cell text-sm text-gray-600">{{ item.sort_order }}</td>
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
                    <h2 class="font-bold text-gray-900 text-lg mb-5">{{ editing ? 'Edit' : 'Add' }} Banner</h2>
                    <form @submit.prevent="save" class="space-y-4">
                        <div><label class="label">Title *</label><input v-model="form.title" required class="input" />
                        </div>
                        <div><label class="label">Subtitle</label><input v-model="form.subtitle" class="input" /></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="label">Position *</label>
                                <select v-model="form.position" required class="input">
                                    <option value="hero_slider">Hero Slider</option>
                                    <option value="homepage_top">Homepage Top</option>
                                    <option value="homepage_middle">Homepage Middle</option>
                                    <option value="homepage_bottom">Homepage Bottom</option>
                                    <option value="promotional">Promotional</option>
                                </select>
                            </div>
                            <div><label class="label">Sort Order</label><input v-model.number="form.sort_order"
                                    type="number" class="input" /></div>
                        </div>
                        <div><label class="label">Link URL</label><input v-model="form.link" class="input"
                                placeholder="https://..." /></div>
                        <div><label class="label">Button Text</label><input v-model="form.button_text" class="input"
                                placeholder="Shop Now" /></div>
                        <div><label class="label">Banner Image {{ editing ? '(leave empty to keep current)' : '' }}
                                *</label>
                            <input type="file" :required="!editing" accept="image/*"
                                @change="e => imageFile = e.target.files[0]" class="input" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="label">Starts At</label><input v-model="form.starts_at"
                                    type="datetime-local" class="input" /></div>
                            <div><label class="label">Ends At</label><input v-model="form.ends_at" type="datetime-local"
                                    class="input" /></div>
                        </div>
                        <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox"
                                v-model="form.is_active" class="accent-[#2E7D32]" /> Active</label>
                        <div class="flex gap-3 pt-2">
                            <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">{{
                                saving ? 'Saving...':'Save Banner' }}</button>
                            <button type="button" @click="showForm = false" class="btn-ghost px-5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
        <ConfirmModal :show="!!deleteTarget" title="Delete Banner" :message="`Delete '${deleteTarget?.title}'?`"
            :loading="deleting" @confirm="doDelete" @cancel="deleteTarget = null" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { bannerApi } from '@/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
const toast = useToast()
const banners = ref([]), loading = ref(true), showForm = ref(false), saving = ref(false)
const editing = ref(null), deleteTarget = ref(null), deleting = ref(false), imageFile = ref(null)
const form = reactive({ title: '', subtitle: '', position: 'hero_slider', link: '', button_text: '', sort_order: 0, starts_at: '', ends_at: '', is_active: true })
const columns = [{ key: 'image', label: 'Banner' }, { key: 'position', label: 'Position', class: 'w-36' }, { key: 'sort', label: 'Order', class: 'w-16' }, { key: 'status', label: 'Status', class: 'w-20' }, { key: 'actions', label: '', class: 'w-20 text-right' }]
async function load() { loading.value = true; try { const r = await bannerApi.list(); banners.value = r.data.data || [] } finally { loading.value = false } }
function openForm(item = null) { editing.value = item; if (item) Object.assign(form, { title: item.title, subtitle: item.subtitle || '', position: item.position, link: item.link || '', button_text: item.button_text || '', sort_order: item.sort_order || 0, starts_at: item.starts_at?.slice(0, 16) || '', ends_at: item.ends_at?.slice(0, 16) || '', is_active: item.is_active }); else Object.assign(form, { title: '', subtitle: '', position: 'hero_slider', link: '', button_text: '', sort_order: 0, starts_at: '', ends_at: '', is_active: true }); showForm.value = true; imageFile.value = null }
async function save() { saving.value = true; try { const fd = new FormData(); Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, v) }); if (imageFile.value) fd.append('image', imageFile.value); if (editing.value) await bannerApi.update(editing.value.id, fd); else await bannerApi.store(fd); toast.success('Saved.'); showForm.value = false; load() } finally { saving.value = false } }
function confirmDelete(item) { deleteTarget.value = item }
async function doDelete() { deleting.value = true; try { await bannerApi.destroy(deleteTarget.value.id); toast.success('Deleted.'); deleteTarget.value = null; load() } finally { deleting.value = false } }
onMounted(load)
</script>