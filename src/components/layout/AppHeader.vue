<template>
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100" style="box-shadow:0 1px 12px rgba(0,0,0,0.06)">
        <!-- Top bar -->
        <div class="bg-[#2E7D32] text-white text-xs py-1.5 text-center">
            🚚 Free shipping on orders over ৳{{ settings.freeShippingOver }}
        </div>

        <!-- Main nav -->
        <div class="container-app">
            <div class="flex items-center h-16 gap-4">

                <!-- Logo -->
                <router-link to="/" class="flex items-center gap-2 shrink-0">
                    <div class="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center">
                        <span class="text-white font-black text-sm">E</span>
                    </div>
                    <span class="text-xl font-black text-gray-900">Eco<span class="text-[#2E7D32]">Shop</span></span>
                </router-link>

                <!-- Search (desktop) -->
                <div class="hidden md:flex flex-1 max-w-xl relative" ref="searchRef">
                    <input v-model="searchQuery" @input="onSearchInput" @keyup.enter="goSearch"
                        @focus="showSuggestions = true" type="text" placeholder="Search products..."
                        class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#4CAF50]/20 transition" />
                    <button @click="goSearch"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]">
                        <MagnifyingGlassIcon class="w-4 h-4" />
                    </button>

                    <!-- Suggestions dropdown -->
                    <div v-if="showSuggestions && suggestions.length"
                        class="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden animate-slide-down">
                        <router-link v-for="s in suggestions" :key="s.id" :to="`/product/${s.slug}`"
                            @click="closeSuggestions"
                            class="flex items-center gap-3 px-4 py-2.5 hover:bg-green-pale transition-colors">
                            <img v-if="s.image" :src="s.image" class="w-8 h-8 rounded-lg object-cover" />
                            <div v-else class="w-8 h-8 rounded-lg bg-gray-100" />
                            <div>
                                <p class="text-sm font-medium text-gray-800">{{ s.name }}</p>
                                <p class="text-xs text-[#2E7D32] font-semibold">৳{{ s.price }}</p>
                            </div>
                        </router-link>
                    </div>
                </div>

                <!-- Nav Links (desktop) -->
                <nav class="hidden lg:flex items-center gap-1">
                    <router-link to="/shop" class="nav-link">Shop</router-link>
                    <router-link to="/affiliate" class="nav-link">Deals</router-link>
                </nav>

                <!-- Right Actions -->
                <div class="flex items-center gap-2 ml-auto">

                    <!-- Wishlist -->
                    <router-link v-if="auth.isLoggedIn" to="/account/wishlist"
                        class="relative p-2 rounded-xl text-gray-600 hover:text-[#2E7D32] hover:bg-green-pale transition">
                        <HeartIcon class="w-5 h-5" />
                    </router-link>

                    <!-- Cart -->
                    <router-link to="/cart"
                        class="relative p-2 rounded-xl text-gray-600 hover:text-[#2E7D32] hover:bg-green-pale transition">
                        <ShoppingCartIcon class="w-5 h-5" />
                        <span v-if="cartCount > 0"
                            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-green">
                            {{ cartCount > 9 ? '9+' : cartCount }}
                        </span>
                    </router-link>

                    <!-- Auth -->
                    <div v-if="auth.isLoggedIn" class="relative" ref="userMenuRef">
                        <button @click="userMenuOpen = !userMenuOpen"
                            class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-green-pale transition">
                            <div
                                class="w-7 h-7 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                <img v-if="auth.userAvatar" :src="auth.userAvatar" class="w-full h-full object-cover" />
                                <span v-else>{{ auth.userName.charAt(0).toUpperCase() }}</span>
                            </div>
                            <span class="text-sm font-medium text-gray-700 hidden md:block">{{ auth.userName.split('
                                ')[0] }}</span>
                            <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400"
                                :class="{ 'rotate-180': userMenuOpen }" />
                        </button>

                        <!-- Dropdown -->
                        <div v-if="userMenuOpen"
                            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden animate-slide-down">
                            <router-link to="/account" @click="userMenuOpen = false" class="dropdown-item">
                                <UserIcon class="w-4 h-4" />My Profile
                            </router-link>
                            <router-link to="/account/orders" @click="userMenuOpen = false" class="dropdown-item">
                                <ClipboardListIcon class="w-4 h-4" />My Orders
                            </router-link>
                            <router-link to="/account/wishlist" @click="userMenuOpen = false" class="dropdown-item">
                                <HeartIcon class="w-4 h-4" />Wishlist
                            </router-link>
                            <router-link to="/account/addresses" @click="userMenuOpen = false" class="dropdown-item">
                                <MapPinIcon class="w-4 h-4" />Addresses
                            </router-link>
                            <div class="border-t border-gray-100 my-1" />
                            <button @click="handleLogout" class="dropdown-item text-red-600 w-full">
                                <ArrowRightOnRectangleIcon class="w-4 h-4" />Logout
                            </button>
                        </div>
                    </div>

                    <div v-else class="flex items-center gap-2">
                        <router-link to="/login" class="btn-ghost text-sm hidden sm:flex">Login</router-link>
                        <router-link to="/register" class="btn-primary text-sm py-2 px-4">Sign Up</router-link>
                    </div>

                    <!-- Mobile menu toggle -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition">
                        <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5 text-gray-600" />
                        <XMarkIcon v-else class="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <!-- Mobile Search -->
            <div class="md:hidden pb-3">
                <div class="relative">
                    <input v-model="searchQuery" @keyup.enter="goSearch" type="text" placeholder="Search products..."
                        class="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2E7D32]" />
                    <button @click="goSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MagnifyingGlassIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white px-4 py-3 animate-slide-down">
            <nav class="flex flex-col gap-1">
                <router-link to="/" @click="mobileMenuOpen = false" class="mobile-nav-link">Home</router-link>
                <router-link to="/shop" @click="mobileMenuOpen = false" class="mobile-nav-link">Shop</router-link>
                <router-link to="/affiliate" @click="mobileMenuOpen = false" class="mobile-nav-link">Deals</router-link>
                <router-link to="/cart" @click="mobileMenuOpen = false" class="mobile-nav-link">Cart ({{ cartCount
                    }})</router-link>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { searchApi } from '@/api'
import { useDebounceFn } from '@vueuse/core'
import {
    MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon, UserIcon,
    ChevronDownIcon, Bars3Icon, XMarkIcon, MapPinIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { ClipboardDocumentListIcon as ClipboardListIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const auth = useAuthStore()
const cartStore = useCartStore()
const settings = useSettingsStore()

const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const userMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchRef = ref(null)
const userMenuRef = ref(null)

const cartCount = computed(() => cartStore.itemCount)

const fetchSuggestions = useDebounceFn(async () => {
    if (searchQuery.value.length < 2) { suggestions.value = []; return }
    try {
        const res = await searchApi.suggestions(searchQuery.value)
        suggestions.value = res.data.data
    } catch { suggestions.value = [] }
}, 300)

function onSearchInput() { fetchSuggestions() }

function goSearch() {
    closeSuggestions()
    if (searchQuery.value.trim()) {
        router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
    }
}

function closeSuggestions() {
    showSuggestions.value = false
    suggestions.value = []
}

async function handleLogout() {
    userMenuOpen.value = false
    await auth.logout()
}

// Click outside
function handleClickOutside(e) {
    if (searchRef.value && !searchRef.value.contains(e.target)) closeSuggestions()
    if (userMenuRef.value && !userMenuRef.value.contains(e.target)) userMenuOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.nav-link {
    @apply px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-[#2E7D32] hover:bg-green-pale transition-colors;
}

.nav-link.router-link-active {
    @apply text-[#2E7D32] bg-green-pale;
}

.dropdown-item {
    @apply flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-pale hover:text-[#2E7D32] transition-colors cursor-pointer;
}

.mobile-nav-link {
    @apply block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-pale hover:text-[#2E7D32] transition-colors;
}
</style>