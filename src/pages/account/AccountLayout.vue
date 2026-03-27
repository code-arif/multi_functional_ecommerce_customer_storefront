<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

                <!-- Sidebar -->
                <aside class="md:col-span-1">
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

                        <!-- User Info -->
                        <div class="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                            <div
                                class="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                                {{ auth.userName.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900 text-sm">{{ auth.userName }}</p>
                                <p class="text-xs text-gray-400">{{ auth.userEmail }}</p>
                            </div>
                        </div>

                        <!-- Navigation -->
                        <nav class="space-y-1">
                            <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
                                :class="$route.path === link.to
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                <component :is="link.icon" class="w-5 h-5" />
                                {{ link.label }}
                            </router-link>

                            <!-- Logout -->
                            <button @click="auth.logout()"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition">
                                <LogOutIcon class="w-5 h-5" />
                                Logout
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
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/authStore'

// lucide icons
import {
    UserIcon,
    PackageIcon,
    HeartIcon,
    MapPinIcon,
    LogOutIcon
} from 'lucide-vue-next'

const auth = useAuthStore()

const navLinks = [
    { to: '/account', icon: UserIcon, label: 'My Profile' },
    { to: '/account/orders', icon: PackageIcon, label: 'My Orders' },
    { to: '/account/wishlist', icon: HeartIcon, label: 'Wishlist' },
    { to: '/account/addresses', icon: MapPinIcon, label: 'Addresses' },
]
</script>