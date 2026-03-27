<template>
    <DefaultLayout>
        <div class="min-h-[70vh] flex items-center justify-center py-12 px-4">
            <div class="w-full max-w-md">
                <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

                    <!-- Header -->
                    <div class="text-center mb-8">
                        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <LockIcon class="w-7 h-7 text-green-600" />
                        </div>
                        <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleLogin" class="space-y-5">

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>

                            <div class="relative">
                                <MailIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input v-model="form.email" type="email" required
                                    class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    placeholder="you@example.com" />
                            </div>

                            <p v-if="errors.email" class="text-red-500 text-xs mt-1">
                                {{ errors.email[0] }}
                            </p>
                        </div>

                        <!-- Password -->
                        <div>
                            <div class="flex justify-between items-center mb-1.5">
                                <label class="text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <!-- Forgot Password -->
                                <router-link to="/forgot-password" class="text-xs text-green-600 hover:underline">
                                    Forgot password?
                                </router-link>
                            </div>

                            <div class="relative">
                                <LockIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input v-model="form.password" :type="showPass ? 'text' : 'password'" required
                                    class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    placeholder="••••••••" />

                                <button type="button" @click="showPass = !showPass"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <component :is="showPass ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                                </button>
                            </div>

                            <p v-if="errors.password" class="text-red-500 text-xs mt-1">
                                {{ errors.password[0] }}
                            </p>
                        </div>

                        <!-- Login Button -->
                        <button type="submit" :disabled="auth.loading"
                            class="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
                            <span v-if="auth.loading">Signing in...</span>
                            <span v-else>Sign In</span>
                        </button>

                        <!-- Divider -->
                        <div class="flex items-center gap-3 my-3">
                            <div class="flex-1 h-px bg-gray-200"></div>
                            <span class="text-xs text-gray-400">OR</span>
                            <div class="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <!-- Google Login -->
                        <button type="button"
                            class="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">

                            <!-- Google SVG -->
                            <svg class="w-5 h-5" viewBox="0 0 48 48">
                                <path fill="#FFC107"
                                    d="M43.611 20.083H42V20H24v8h11.303C33.675 32.91 29.268 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.342 6.053 29.405 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                                <path fill="#FF3D00"
                                    d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.342 6.053 29.405 4 24 4c-7.732 0-14.41 4.417-17.694 10.691z" />
                                <path fill="#4CAF50"
                                    d="M24 44c5.21 0 10.004-1.99 13.584-5.23l-6.273-5.303C29.343 35.091 26.768 36 24 36c-5.246 0-9.641-3.066-11.275-7.462l-6.52 5.025C9.45 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2"
                                    d="M43.611 20.083H42V20H24v8h11.303c-.79 2.237-2.231 4.166-3.992 5.467l6.273 5.303C39.99 35.59 44 30.297 44 24c0-1.341-.138-2.651-.389-3.917z" />
                            </svg>

                            <span class="text-sm font-medium text-gray-700">
                                Continue with Google
                            </span>
                        </button>
                    </form>

                    <!-- Register -->
                    <p class="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?
                        <router-link to="/register" class="text-green-600 font-medium hover:underline">
                            Create one
                        </router-link>
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

// lucide icons
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const auth = useAuthStore()

const form = reactive({
    email: '',
    password: ''
})

const errors = ref({})
const showPass = ref(false)

async function handleLogin() {
    errors.value = {}
    try {
        await auth.login(form)
    } catch (e) {
        errors.value =
            e.response?.data?.errors ||
            { email: [e.response?.data?.message || 'Login failed.'] }
    }
}
</script>