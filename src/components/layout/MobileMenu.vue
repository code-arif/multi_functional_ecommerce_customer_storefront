<template>
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="fade">
            <div v-if="ui.mobileMenuOpen" class="fixed inset-0 bg-black/40 z-40 lg:hidden"
                @click="ui.closeMobileMenu()" />
        </Transition>

        <!-- Drawer -->
        <Transition name="slide-right">
            <div v-if="ui.mobileMenuOpen"
                class="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <RouterLink to="/" @click="ui.closeMobileMenu()" class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-primary-700 flex items-center justify-center">
                            <span class="text-white font-black text-xs">E</span>
                        </div>
                        <span class="font-display font-700 text-lg text-gray-900">Eco<span
                                class="text-primary-700">Shop</span></span>
                    </RouterLink>
                    <button @click="ui.closeMobileMenu()" class="btn-icon">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>

                <!-- User section -->
                <div v-if="auth.isLoggedIn" class="px-5 py-4 border-b border-gray-100 bg-brand-pale/50">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold">
                            {{ auth.userInitial }}
                        </div>
                        <div>
                            <p class="font-semibold text-sm text-gray-900">{{ auth.userName }}</p>
                            <p class="text-xs text-gray-500">{{ auth.userEmail }}</p>
                        </div>
                    </div>
                </div>

                <!-- Nav -->
                <nav class="flex-1 overflow-y-auto px-4 py-4">
                    <div class="space-y-1">
                        <RouterLink v-for="link in mainLinks" :key="link.to" :to="link.to" @click="ui.closeMobileMenu()"
                            class="mobile-nav-link">
                            <component :is="link.icon" class="w-5 h-5" />
                            {{ link.label }}
                        </RouterLink>
                    </div>

                    <div v-if="auth.isLoggedIn" class="mt-4 pt-4 border-t border-gray-100">
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">My Account</p>
                        <div class="space-y-1">
                            <RouterLink v-for="link in accountLinks" :key="link.to" :to="link.to"
                                @click="ui.closeMobileMenu()" class="mobile-nav-link">
                                <component :is="link.icon" class="w-5 h-5" />
                                {{ link.label }}
                            </RouterLink>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div v-if="!auth.isLoggedIn" class="space-y-2">
                            <RouterLink to="/login" @click="ui.closeMobileMenu()"
                                class="btn-primary w-full justify-center">Login</RouterLink>
                            <RouterLink to="/register" @click="ui.closeMobileMenu()"
                                class="btn-outline  w-full justify-center">Create Account</RouterLink>
                        </div>
                        <button v-else @click="handleLogout"
                            class="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <ArrowRightOnRectangleIcon class="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import {
    XMarkIcon, HomeIcon, ShoppingBagIcon, MagnifyingGlassIcon,
    ShoppingCartIcon, UserIcon, ClipboardDocumentListIcon,
    HeartIcon, MapPinIcon, ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const ui = useUiStore()

const mainLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/shop', label: 'Shop', icon: ShoppingBagIcon },
    { to: '/search', label: 'Search', icon: MagnifyingGlassIcon },
    { to: '/cart', label: `Cart (${0})`, icon: ShoppingCartIcon }
]

const accountLinks = [
    { to: '/account', label: 'My Profile', icon: UserIcon },
    { to: '/account/orders', label: 'My Orders', icon: ClipboardDocumentListIcon },
    { to: '/account/wishlist', label: 'Wishlist', icon: HeartIcon },
    { to: '/account/addresses', label: 'Addresses', icon: MapPinIcon }
]

async function handleLogout() {
    ui.closeMobileMenu()
    await auth.logout()
}
</script>

<style scoped>
.mobile-nav-link {
    @apply flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-pale hover:text-primary-700 rounded-xl transition-all duration-150;
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform .25s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>