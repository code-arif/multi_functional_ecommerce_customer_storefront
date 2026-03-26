<template>
    <div class="min-h-screen flex flex-col bg-white">
        <AppHeader />
        <main class="flex-1">
            <slot />
        </main>
        <AppFooter />
        <!-- Mini Cart Drawer -->
        <MiniCart />
        <!-- Mobile Menu Drawer -->
        <MobileMenu />
    </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MiniCart from '@/components/cart/MiniCart.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
</script>