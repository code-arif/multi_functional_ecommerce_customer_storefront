<template>
    <div>
        <h2 class="text-xl font-black text-gray-900 mb-6">My Wishlist</h2>
        <div v-if="wishlist.loading" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="skeleton aspect-square rounded-2xl" />
        </div>
        <div v-else-if="!wishlist.items.length" class="text-center py-12">
            <p class="text-4xl mb-3">🤍</p>
            <p class="text-gray-500">Your wishlist is empty.</p>
            <router-link to="/shop" class="btn-primary mt-4 inline-block">Discover Products</router-link>
        </div>
        <ProductGrid v-else :products="wishlist.items" />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
const wishlist = useWishlistStore()
onMounted(() => wishlist.fetchWishlist())
</script>