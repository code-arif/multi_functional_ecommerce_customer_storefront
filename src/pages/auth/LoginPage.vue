<template>
    <DefaultLayout>
        <div class="min-h-[70vh] flex items-center justify-center py-12 px-4">
            <div class="w-full max-w-md">
                <div class="card p-8">
                    <div class="text-center mb-8">
                        <div class="w-14 h-14 bg-green-pale rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">🔐</span>
                        </div>
                        <h1 class="text-2xl font-black text-gray-900">Welcome Back</h1>
                        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
                    </div>
                    <form @submit.prevent="handleLogin" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input v-model="form.email" type="email" required class="input"
                                placeholder="you@example.com" />
                            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div class="relative">
                                <input v-model="form.password" :type="showPass ? 'text' : 'password'" required
                                    class="input pr-10" placeholder="••••••••" />
                                <button type="button" @click="showPass = !showPass"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {{ showPass ? '🙈' : '👁️' }}
                                </button>
                            </div>
                            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password[0] }}</p>
                        </div>
                        <button type="submit" :disabled="auth.loading"
                            class="btn-primary w-full justify-center py-3.5 text-base">
                            <span v-if="auth.loading">Signing in...</span>
                            <span v-else>Sign In →</span>
                        </button>
                    </form>
                    <p class="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?
                        <router-link to="/register" class="text-[#2E7D32] font-semibold hover:underline">Create
                            one</router-link>
                    </p>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const errors = ref({}), showPass = ref(false)
async function handleLogin() {
    errors.value = {}
    try { await auth.login(form) }
    catch (e) { errors.value = e.response?.data?.errors || { email: [e.response?.data?.message || 'Login failed.'] } }
}
</script>