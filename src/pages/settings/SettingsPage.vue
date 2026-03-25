<template>
    <div class="max-w-4xl">
        <PageHeader title="Store Settings" subtitle="Configure your store's global settings" />

        <div class="space-y-6">
            <div v-for="group in settingGroups" :key="group.key" class="card p-5">
                <h3 class="font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span>{{ group.icon }}</span> {{ group.label }}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="field in group.fields" :key="field.key" :class="field.span === 2 ? 'sm:col-span-2' : ''">
                        <label class="label">{{ field.label }}</label>
                        <div v-if="field.type === 'file'" class="flex items-center gap-3">
                            <img v-if="settingsForm[field.key]" :src="settingsForm[field.key]"
                                class="w-12 h-12 rounded-lg object-contain border border-gray-200 bg-gray-50" />
                            <div class="flex-1">
                                <input type="file" accept="image/*"
                                    @change="e => uploadFile(field.key, e.target.files[0])"
                                    class="input text-xs py-1.5" />
                            </div>
                        </div>
                        <textarea v-else-if="field.type === 'textarea'" v-model="settingsForm[field.key]" rows="2"
                            class="input" :placeholder="field.placeholder" />
                        <input v-else v-model="settingsForm[field.key]" :type="field.type || 'text'" class="input"
                            :placeholder="field.placeholder" />
                    </div>
                </div>
                <button @click="saveGroup(group)" :disabled="saving === group.key" class="btn-primary mt-5 text-sm">
                    {{ saving === group.key ? 'Saving...' : 'Save ' + group.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import { settingsApi } from '@/api'
const toast = useToast()
const settingsForm = reactive({}), saving = ref(null), uploading = ref(null)

const settingGroups = [
    {
        key: 'general', icon: '🏪', label: 'General', fields: [
            { key: 'store_name', label: 'Store Name', placeholder: 'EcoShop' },
            { key: 'store_email', label: 'Email', type: 'email', placeholder: 'info@ecoshop.com' },
            { key: 'store_phone', label: 'Phone', placeholder: '+8801XXXXXXXXX' },
            { key: 'store_address', label: 'Address', type: 'textarea', span: 2, placeholder: 'Full address...' },
            { key: 'currency', label: 'Currency Code', placeholder: 'BDT' },
            { key: 'currency_symbol', label: 'Currency Symbol', placeholder: '৳' },
        ]
    },
    {
        key: 'shipping', icon: '🚚', label: 'Shipping', fields: [
            { key: 'shipping_charge', label: 'Shipping Charge (৳)', type: 'number', placeholder: '60' },
            { key: 'free_shipping_over', label: 'Free Shipping Over (৳)', type: 'number', placeholder: '1000' },
        ]
    },
    {
        key: 'seo', icon: '🔍', label: 'SEO', fields: [
            { key: 'meta_title', label: 'Default Meta Title', span: 2 },
            { key: 'meta_description', label: 'Default Meta Description', type: 'textarea', span: 2 },
            { key: 'meta_keywords', label: 'Meta Keywords', span: 2 },
        ]
    },
    {
        key: 'social', icon: '📱', label: 'Social Media', fields: [
            { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
            { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
            { key: 'twitter_url', label: 'Twitter URL', placeholder: 'https://twitter.com/...' },
            { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
        ]
    },
    {
        key: 'branding', icon: '🎨', label: 'Branding', fields: [
            { key: 'store_logo', label: 'Store Logo', type: 'file' },
            { key: 'store_favicon', label: 'Favicon', type: 'file' },
        ]
    },
]

async function uploadFile(key, file) {
    if (!file) return
    uploading.value = key
    try { const r = await settingsApi.upload(key, file); settingsForm[key] = r.data.data.url || r.data.data.path; toast.success('File uploaded.') } finally { uploading.value = null }
}

async function saveGroup(group) {
    saving.value = group.key
    try {
        const keys = group.fields.filter(f => f.type !== 'file').map(f => f.key)
        const payload = { settings: Object.fromEntries(keys.map(k => [k, settingsForm[k] || ''])) }
        await settingsApi.update(payload)
        toast.success(`${group.label} settings saved.`)
    } finally { saving.value = null }
}

onMounted(async () => {
    const r = await settingsApi.list()
    const groups = r.data.data
    Object.values(groups).flat().forEach(s => { settingsForm[s.key] = s.value || '' })
})
</script>