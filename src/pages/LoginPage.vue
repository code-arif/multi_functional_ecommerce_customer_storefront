<template>
    <div class="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-4">
        <div class="w-full max-w-sm">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span class="text-white font-black text-2xl">E</span>
                </div>
                <h1 class="text-2xl font-black text-white">EcoAdmin</h1>
                <p class="text-slate-400 text-sm mt-1">Sign in to your admin panel</p>
            </div>
            <div class="bg-white rounded-2xl p-7" style="box-shadow:0 20px 60px rgba(0,0,0,0.3)">
                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label class="label">Email Address</label>
                        <input v-model="form.email" type="email" required class="input" placeholder="admin@ecoshop.com"
                            autofocus />
                        <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email[0] }}</p>
                    </div>
                    <div>
                        <label class="label">Password</label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPass ? 'text' : 'password'" required
                                class="input pr-10" placeholder="••••••••" />
                            <button type="button" @click="showPass = !showPass"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{{ showPass ? '🙈' : '👁️'
                                }}</button>
                        </div>
                    </div>
                    <button type="submit" :disabled="loading"
                        class="btn-primary w-full justify-center py-3 text-base mt-2">
                        {{ loading ? 'Signing in...' : 'Sign In →' }}
                    </button>
                </form>
            </div>
            <p class="text-center text-slate-500 text-xs mt-6">EcoShop Admin Panel v1.0</p>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const errors = ref({}), loading = ref(false), showPass = ref(false)
async function handleLogin() {
    loading.value = true; errors.value = {}
    try { await auth.login(form) }
    catch (e) { errors.value = e.response?.data?.errors || { email: [e.response?.data?.message || 'Login failed.'] } }
    finally { loading.value = false }
}
</script>