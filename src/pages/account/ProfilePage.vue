<template>
    <div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-gray-900 mb-6">My Profile</h2>

        <!-- Card -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-2xl">

            <form @submit.prevent="saveProfile" class="space-y-5">

                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                    </label>

                    <div class="relative">
                        <UserIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input v-model="form.name"
                            class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>

                    <div class="relative">
                        <MailIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input v-model="form.email" type="email"
                            class="w-full pl-10 pr-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg outline-none cursor-not-allowed"
                            readonly />
                    </div>
                </div>

                <!-- Phone -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone
                    </label>

                    <div class="relative">
                        <PhoneIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input v-model="form.phone"
                            class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            placeholder="+8801XXXXXXXXX" />
                    </div>
                </div>

                <!-- Password Section -->
                <div class="border-t border-gray-100 pt-4">
                    <h4 class="font-semibold text-gray-700 mb-3">
                        Change Password
                    </h4>

                    <div class="space-y-3">

                        <!-- Current -->
                        <div class="relative">
                            <LockIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input v-model="form.current_password" :type="showCurrent ? 'text' : 'password'"
                                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Current password" />

                            <button type="button" @click="showCurrent = !showCurrent"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <component :is="showCurrent ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- New -->
                        <div class="relative">
                            <LockIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input v-model="form.password" :type="showNew ? 'text' : 'password'"
                                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="New password (min. 8)" />

                            <button type="button" @click="showNew = !showNew"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <component :is="showNew ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- Confirm -->
                        <div class="relative">
                            <LockIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input v-model="form.password_confirmation" :type="showConfirm ? 'text' : 'password'"
                                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Confirm new password" />

                            <button type="button" @click="showConfirm = !showConfirm"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <component :is="showConfirm ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </div>

                <!-- Submit -->
                <button type="submit" :disabled="saving"
                    class="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>

            </form>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// lucide
import {
    UserIcon,
    MailIcon,
    PhoneIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon
} from 'lucide-vue-next'

const auth = useAuthStore()

const saving = ref(false)

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = reactive({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    current_password: '',
    password: '',
    password_confirmation: ''
})

async function saveProfile() {
    saving.value = true

    const data = {
        name: form.name,
        phone: form.phone
    }

    if (form.password) {
        Object.assign(data, {
            current_password: form.current_password,
            password: form.password,
            password_confirmation: form.password_confirmation
        })
    }

    await auth.updateProfile(data)

    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''

    saving.value = false
}
</script>