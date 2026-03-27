<template>
    <div>
        <h2 class="text-xl font-black text-gray-900 mb-6">My Profile</h2>
        <div class="card p-6">
            <form @submit.prevent="saveProfile" class="space-y-4 max-w-md">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input v-model="form.name" class="input" />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input v-model="form.email" type="email" class="input bg-gray-50" readonly />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input v-model="form.phone" class="input" placeholder="+8801XXXXXXXXX" />
                </div>
                <div class="border-t border-gray-100 pt-4">
                    <h4 class="font-semibold text-gray-700 mb-3">Change Password</h4>
                    <div class="space-y-3">
                        <input v-model="form.current_password" type="password" class="input"
                            placeholder="Current password" />
                        <input v-model="form.password" type="password" class="input"
                            placeholder="New password (min. 8)" />
                        <input v-model="form.password_confirmation" type="password" class="input"
                            placeholder="Confirm new password" />
                    </div>
                </div>
                <button type="submit" :disabled="saving" class="btn-primary py-3">
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
const saving = ref(false)
const form = reactive({ name: auth.user?.name || '', email: auth.user?.email || '', phone: auth.user?.phone || '', current_password: '', password: '', password_confirmation: '' })
async function saveProfile() {
    saving.value = true
    const data = { name: form.name, phone: form.phone }
    if (form.password) Object.assign(data, { current_password: form.current_password, password: form.password, password_confirmation: form.password_confirmation })
    await auth.updateProfile(data)
    form.current_password = form.password = form.password_confirmation = ''
    saving.value = false
}
</script>