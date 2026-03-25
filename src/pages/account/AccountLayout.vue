<template>
    <DefaultLayout>
        <div class="container-app py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <aside class="md:col-span-1">
                    <div class="card p-5">
                        <div class="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                            <div
                                class="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-lg">
                                {{ auth.userName.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="font-bold text-gray-900 text-sm">{{ auth.userName }}</p>
                                <p class="text-xs text-gray-400">{{ auth.userEmail }}</p>
                            </div>
                        </div>
                        <nav class="space-y-1">
                            <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                                :class="$route.path === link.to ? 'bg-green-pale text-[#2E7D32]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                <span>{{ link.icon }}</span> {{ link.label }}
                            </router-link>
                            <button @click="auth.logout()"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
                                <span>🚪</span> Logout
                            </button>
                        </nav>
                    </div>
                </aside>
                <!-- Content -->
                <main class="md:col-span-3">
                    <router-view />
                </main>
            </div>
        </div>
    </DefaultLayout>
</template>
<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const navLinks = [
    { to: '/account', icon: '👤', label: 'My Profile' },
    { to: '/account/orders', icon: '📦', label: 'My Orders' },
    { to: '/account/wishlist', icon: '❤️', label: 'Wishlist' },
    { to: '/account/addresses', icon: '📍', label: 'Addresses' },
]
</script>