<template>
    <div class="flex h-screen overflow-hidden bg-[#F8FAFC]">
        <!-- Sidebar -->
        <aside :class="['fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0F172A] transition-all duration-300 lg:relative',
            sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden']">
            <!-- Logo -->
            <div class="flex items-center gap-3 px-4 h-[60px] border-b border-white/5 shrink-0">
                <div class="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center shrink-0">
                    <span class="text-white font-black text-sm">E</span>
                </div>
                <span v-if="sidebarOpen" class="text-white font-black text-lg whitespace-nowrap">
                    Eco<span class="text-[#4CAF50]">Admin</span>
                </span>
            </div>

            <!-- Nav -->
            <nav class="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
                <template v-for="item in navItems" :key="item.name">
                    <!-- Section header -->
                    <p v-if="item.section && sidebarOpen"
                        class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-1">{{
                        item.section }}</p>

                    <!-- Nav link -->
                    <router-link v-else-if="item.to" :to="item.to"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative"
                        :class="isActive(item.to)
                            ? 'bg-[#2E7D32] text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
                        <component :is="item.icon" class="w-5 h-5 shrink-0" />
                        <span v-if="sidebarOpen" class="text-sm font-medium whitespace-nowrap">{{ item.name }}</span>
                        <!-- Badge -->
                        <span v-if="item.badge && sidebarOpen"
                            class="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{{
                            item.badge }}</span>
                        <!-- Tooltip when collapsed -->
                        <div v-if="!sidebarOpen"
                            class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                            {{ item.name }}
                        </div>
                    </router-link>
                </template>
            </nav>

            <!-- User info -->
            <div class="border-t border-white/5 p-3 shrink-0">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {{ auth.userName.charAt(0).toUpperCase() }}
                    </div>
                    <div v-if="sidebarOpen" class="flex-1 min-w-0">
                        <p class="text-white text-xs font-semibold truncate">{{ auth.userName }}</p>
                        <p class="text-slate-500 text-[10px] truncate">{{ auth.userEmail }}</p>
                    </div>
                    <button v-if="sidebarOpen" @click="auth.logout()" title="Logout"
                        class="text-slate-500 hover:text-red-400 transition-colors p-1 rounded">
                        <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>

        <!-- Overlay (mobile) -->
        <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 z-40 lg:hidden" />

        <!-- Main area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Top Header -->
            <header class="h-[60px] bg-white border-b border-gray-100 flex items-center gap-4 px-4 lg:px-6 shrink-0"
                style="box-shadow:0 1px 4px rgba(0,0,0,0.04)">
                <button @click="sidebarOpen = !sidebarOpen"
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
                    <Bars3Icon class="w-5 h-5" />
                </button>

                <!-- Breadcrumb -->
                <div class="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                    <span class="font-semibold text-gray-900">{{ currentPageTitle }}</span>
                </div>

                <div class="ml-auto flex items-center gap-2">
                    <!-- Notifications -->
                    <button class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
                        <BellIcon class="w-5 h-5" />
                        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <!-- View Store -->
                    <a :href="storeUrl" target="_blank"
                        class="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] border border-[#2E7D32] px-3 py-1.5 rounded-lg hover:bg-green-50 transition">
                        <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" /> View Store
                    </a>
                </div>
            </header>

            <!-- Page content -->
            <main class="flex-1 overflow-y-auto p-4 lg:p-6">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" class="animate-in" />
                    </transition>
                </router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
    Squares2X2Icon, ShoppingBagIcon, ClipboardDocumentListIcon,
    UsersIcon, TagIcon, BuildingStorefrontIcon, TicketIcon,
    StarIcon, LinkIcon, DocumentTextIcon, PhotoIcon,
    ChartBarIcon, CogIcon, Bars3Icon, BellIcon,
    ArrowRightOnRectangleIcon, ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(true)
const storeUrl = import.meta.env.VITE_STORE_URL || 'http://localhost:3000'

const navItems = [
    { to: '/', name: 'Dashboard', icon: Squares2X2Icon },
    { section: 'Catalog' },
    { to: '/products', name: 'Products', icon: ShoppingBagIcon },
    { to: '/categories', name: 'Categories', icon: TagIcon },
    { to: '/brands', name: 'Brands', icon: BuildingStorefrontIcon },
    { to: '/affiliate', name: 'Affiliate', icon: LinkIcon },
    { section: 'Sales' },
    { to: '/orders', name: 'Orders', icon: ClipboardDocumentListIcon },
    { to: '/coupons', name: 'Coupons', icon: TicketIcon },
    { to: '/reviews', name: 'Reviews', icon: StarIcon },
    { section: 'Users' },
    { to: '/users', name: 'Customers', icon: UsersIcon },
    { section: 'Content' },
    { to: '/cms', name: 'CMS Pages', icon: DocumentTextIcon },
    { to: '/banners', name: 'Banners', icon: PhotoIcon },
    { section: 'Analytics' },
    { to: '/reports', name: 'Reports', icon: ChartBarIcon },
    { section: 'System' },
    { to: '/settings', name: 'Settings', icon: CogIcon },
]

const pageTitles = {
    '/': 'Dashboard', '/products': 'Products', '/orders': 'Orders',
    '/users': 'Customers', '/categories': 'Categories', '/brands': 'Brands',
    '/coupons': 'Coupons', '/reviews': 'Reviews', '/affiliate': 'Affiliate Products',
    '/cms': 'CMS Pages', '/banners': 'Banners', '/reports': 'Reports', '/settings': 'Settings'
}

const currentPageTitle = computed(() => {
    const p = '/' + (route.path.split('/')[1] || '')
    return pageTitles[p] || 'EcoAdmin'
})

function isActive(path) {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>