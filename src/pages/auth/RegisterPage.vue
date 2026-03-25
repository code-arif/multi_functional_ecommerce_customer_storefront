<template>
    <DefaultLayout>
        <div class="min-h-[70vh] flex items-center justify-center py-12 px-4">
            <div class="w-full max-w-md">
                <div class="card p-8">
                    <div class="text-center mb-8">
                        <div class="w-14 h-14 bg-green-pale rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">🌿</span>
                        </div>
                        <h1 class="text-2xl font-black text-gray-900">Create Account</h1>
                        <p class="text-gray-500 text-sm mt-1">Join thousands of happy shoppers</p>
                    </div>
                    <form @submit.prevent="handleRegister" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <input v-model="form.name" required class="input" placeholder="Your full name" />
                            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input v-model="form.email" type="email" required class="input"
                                placeholder="you@example.com" />
                            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
                            <input v-model="form.phone" class="input" placeholder="+8801XXXXXXXXX" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <input v-model="form.password" type="password" required class="input"
                                placeholder="Min. 8 characters" />
                            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <input v-model="form.password_confirmation" type="password" required class="input"
                                placeholder="Repeat password" />
                        </div>
                        <button type="submit" :disabled="auth.loading"
                            class="btn-primary w-full justify-center py-3.5 text-base">
                            <span v-if="auth.loading">Creating Account...</span>
                            <span v-else>Create Account →</span>
                        </button>
                    </form>
                    <p class="text-center text-sm text-gray-500 mt-6">
                        Already have an account?
                        <router-link to="/login" class="text-[#2E7D32] font-semibold hover:underline">Sign
                            in</router-link>
                    </p>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
<script setup>
import { ref, reactive } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const form = reactive({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
const errors = ref({})
async function handleRegister() {
    errors.value = {}
    try { await auth.register(form) }
    catch (e) { errors.value = e.response?.data?.errors || {} }
}
</script>