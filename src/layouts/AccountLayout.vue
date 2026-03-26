<template>
    <DefaultLayout>
        <div class="app-container py-8 md:py-12">
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Sidebar -->
                <aside class="w-full md:w-60 shrink-0">
                    <div class="card p-5">
                        <!-- User info -->
                        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                            <div
                                class="w-11 h-11 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                <img v-if="auth.userAvatar" :src="auth.userAvatar" :alt="auth.userName"
                                    class="w-full h-full object-cover rounded-xl" />
                                <span v-else>{{ auth.userInitial }}</span>
                            </div>
                            <div class="min-w-0">
                                <p class="font-semibold text-gray-900 text-sm truncate">{{ auth.userName }}</p>
                                <p class="text-xs text-gray-400 truncate">{{ auth.userEmail }}</p>
                            </div>
                        </div>
                        <!-- Nav links -->
                        <nav class="flex flex-col gap-1">
                            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                                :class="$route.name === link.name
                                    ? 'bg-brand-pale text-primary-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                <component :is="link.icon" class="w-4 h-4 shrink-0" />
                                {{ link.label }}
                            </RouterLink>
                            <button @click="handleLogout"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2">
                                <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                <!-- Content -->
                <main class="flex-1 min-w-0">
                    <router-view />
                </main>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from './DefaultLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import {
    UserIcon, ClipboardDocumentListIcon, HeartIcon,
    MapPinIcon, ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

const navLinks = [
    { to: '/account', name: 'account-profile', label: 'My Profile', icon: UserIcon },
    { to: '/account/orders', name: 'account-orders', label: 'My Orders', icon: ClipboardDocumentListIcon },
    { to: '/account/wishlist', name: 'account-wishlist', label: 'Wishlist', icon: HeartIcon },
    { to: '/account/addresses', name: 'account-addresses', label: 'Addresses', icon: MapPinIcon }
]

async function handleLogout() {
    await auth.logout()
}
</script>