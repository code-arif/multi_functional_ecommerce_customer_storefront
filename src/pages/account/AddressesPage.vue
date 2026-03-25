<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-black text-gray-900">My Addresses</h2>
            <button @click="showForm = !showForm" class="btn-primary py-2 px-4 text-sm">+ Add New</button>
        </div>
        <!-- Add form -->
        <div v-if="showForm" class="card p-5 mb-6">
            <h3 class="font-bold text-gray-900 mb-4">New Address</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input v-model="newAddr.recipient_name" class="input" placeholder="Recipient name *" />
                <input v-model="newAddr.phone" class="input" placeholder="Phone *" />
                <input v-model="newAddr.address_line1" class="input sm:col-span-2" placeholder="Address line 1 *" />
                <input v-model="newAddr.city" class="input" placeholder="City *" />
                <input v-model="newAddr.state" class="input" placeholder="District" />
                <label class="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
                    <input type="checkbox" v-model="newAddr.is_default" class="accent-[#2E7D32]" />
                    Set as default address
                </label>
            </div>
            <div class="flex gap-3 mt-4">
                <button @click="saveAddress" :disabled="saving" class="btn-primary py-2 px-5 text-sm">{{
                    saving ?'Saving...':'Save' }}</button>
                <button @click="showForm = false" class="btn-ghost py-2 px-5 text-sm">Cancel</button>
            </div>
        </div>
        <!-- Address list -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="addr in addresses" :key="addr.id" class="card p-4 relative">
                <div v-if="addr.is_default" class="badge-green text-[10px] absolute top-3 right-3">Default</div>
                <p class="font-bold text-gray-800 text-sm">{{ addr.recipient_name }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ addr.address_line1 }}</p>
                <p class="text-sm text-gray-500">{{ addr.city }}, {{ addr.country }}</p>
                <p class="text-sm text-gray-500">{{ addr.phone }}</p>
                <button @click="deleteAddress(addr.id)"
                    class="text-xs text-red-400 hover:text-red-600 mt-3 transition">Delete</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { addressApi } from '@/api'
import { useToast } from 'vue-toastification'
const toast = useToast()
const addresses = ref([]), showForm = ref(false), saving = ref(false)
const newAddr = reactive({ recipient_name: '', phone: '', address_line1: '', city: '', state: '', is_default: false })
async function loadAddresses() { try { const r = await addressApi.list(); addresses.value = r.data.data || [] } catch { } }
async function saveAddress() {
    saving.value = true
    try { await addressApi.store(newAddr); await loadAddresses(); showForm.value = false; Object.keys(newAddr).forEach(k => newAddr[k] = k === 'is_default' ? false : ''); toast.success('Address saved.') } finally { saving.value = false }
}
async function deleteAddress(id) {
    if (!confirm('Delete this address?')) return
    await addressApi.delete(id); await loadAddresses(); toast.info('Address deleted.')
}
onMounted(loadAddresses)
</script>