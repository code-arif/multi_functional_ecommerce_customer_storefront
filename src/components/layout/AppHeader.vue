<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100" style="box-shadow:0 1px 12px rgba(0,0,0,.06)">
    <!-- Top promo bar -->
    <div class="bg-primary-700 text-white text-xs py-2 text-center hidden sm:block">
      🚚 Free shipping on orders over {{ ui.formatPrice(ui.freeShippingOver) }} &nbsp;|&nbsp;
      Fast delivery across Bangladesh
    </div>

    <!-- Main nav -->
    <div class="app-container">
      <div class="flex items-center h-16 gap-3 md:gap-5">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0 group">
          <div
              class="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center group-hover:bg-primary-800 transition-colors">
            <span class="text-white font-black text-sm leading-none">E</span>
          </div>
          <span class="font-display font-700 text-xl text-gray-900 hidden sm:block">
                        Eco<span class="text-primary-700">Shop</span>
                    </span>
        </RouterLink>

        <!-- Desktop nav links -->
        <nav class="hidden lg:flex items-center gap-1 ml-2">
          <RouterLink to="/" class="nav-item" :class="{ 'nav-item-active': $route.name === 'home' }">Home
          </RouterLink>
          <RouterLink to="/shop" class="nav-item" :class="{ 'nav-item-active': $route.name === 'shop' }">Shop
          </RouterLink>
          <RouterLink to="/search" class="nav-item">Deals</RouterLink>
        </nav>

        <!-- Search bar (desktop) -->
        <div class="flex-1 max-w-md hidden md:block relative" ref="searchWrapRef">
          <SearchBar @select="onSearchSelect"/>
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-1 ml-auto">
          <!-- Search toggle (mobile) -->
          <button @click="ui.toggleSearch()" class="btn-icon md:hidden">
            <MagnifyingGlassIcon class="w-5 h-5"/>
          </button>

          <!-- Wishlist -->
          <RouterLink v-if="auth.isLoggedIn" to="/account/wishlist" class="btn-icon relative hidden sm:flex">
            <HeartIcon class="w-5 h-5"/>
          </RouterLink>

          <!-- Cart -->
          <button @click="ui.toggleMiniCart()" class="btn-icon relative">
            <ShoppingCartIcon class="w-5 h-5"/>
            <span v-if="cart.itemCount > 0"
                  class="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-0.5">
                            {{ cart.itemCount > 99 ? '99+' : cart.itemCount }}
            </span>
          </button>

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button v-if="auth.isLoggedIn" @click="userMenuOpen = !userMenuOpen"
                    class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div
                  class="w-7 h-7 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                <img v-if="auth.userAvatar" :src="auth.userAvatar" class="w-full h-full object-cover"/>
                <span v-else>{{ auth.userInitial }}</span>
              </div>
              <span class="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">{{
                  auth.userName.split(' ')[0]
                }}</span>
              <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
                               :class="{ 'rotate-180': userMenuOpen }"/>
            </button>

            <!-- Dropdown -->
            <Transition name="slide-down">
              <div v-if="auth.isLoggedIn && userMenuOpen"
                   class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden animate-slide-down">
                <RouterLink to="/account" @click="userMenuOpen = false" class="dropdown-item">
                  <UserIcon class="w-4 h-4"/>
                  My Profile
                </RouterLink>
                <RouterLink to="/account/orders" @click="userMenuOpen = false" class="dropdown-item">
                  <ClipboardDocumentListIcon class="w-4 h-4"/>
                  My Orders
                </RouterLink>

                <RouterLink to="/track-order" @click="userMenuOpen = false" class="dropdown-item">
                  <MapPinIcon class="w-4 h-4"/>
                  Track Order
                </RouterLink>

                <RouterLink to="/account/wishlist" @click="userMenuOpen = false" class="dropdown-item">
                  <HeartIcon class="w-4 h-4"/>
                  Wishlist
                </RouterLink>
                <div class="border-t border-gray-100 my-1"/>
                <button @click="handleLogout" class="dropdown-item text-red-500 w-full">
                  <ArrowRightOnRectangleIcon class="w-4 h-4"/>
                  Logout
                </button>
              </div>
            </Transition>

            <!-- Auth buttons -->
            <div v-if="!auth.isLoggedIn" class="flex items-center gap-2">
              <RouterLink to="/login" class="btn-ghost text-sm hidden sm:inline-flex">Login</RouterLink>
              <RouterLink to="/register" class="btn-primary text-sm">Sign Up</RouterLink>
            </div>
          </div>

          <!-- Mobile menu toggle -->
          <button @click="ui.toggleMobileMenu()" class="btn-icon lg:hidden ml-1">
            <Bars3Icon v-if="!ui.mobileMenuOpen" class="w-5 h-5"/>
            <XMarkIcon v-else class="w-5 h-5"/>
          </button>
        </div>
      </div>

      <!-- Mobile search bar -->
      <div v-if="ui.searchOpen" class="pb-3 md:hidden animate-slide-down">
        <SearchBar @select="onSearchSelect" :autofocus="true"/>
      </div>
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {onClickOutside} from '@vueuse/core'
import SearchBar from '@/components/common/SearchBar.vue'
import {useAuthStore} from '@/stores/authStore'
import {useCartStore} from '@/stores/cartStore'
import {useUiStore} from '@/stores/uiStore'
import {
  MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon, UserIcon,
  ChevronDownIcon, Bars3Icon, XMarkIcon,
  ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, MapPinIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const cart = useCartStore()
const ui = useUiStore()
const router = useRouter()

const userMenuOpen = ref(false)
const userMenuRef = ref(null)
const searchWrapRef = ref(null)

onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

async function handleLogout() {
  userMenuOpen.value = false
  await auth.logout()
}

function onSearchSelect(slug) {
  ui.closeSearch()
  router.push({name: 'product', params: {slug}})
}
</script>

<style scoped>
.nav-item {
  @apply px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-brand-pale transition-all duration-150;
}

.nav-item-active {
  @apply text-primary-700 bg-brand-pale font-semibold;
}

.dropdown-item {
  @apply flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-pale hover:text-primary-700 transition-colors cursor-pointer;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity .15s ease, transform .15s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>