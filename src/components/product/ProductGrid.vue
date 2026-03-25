<template>
    <div>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="i in skeletonCount" :key="i" class="card overflow-hidden">
                <div class="skeleton aspect-square" />
                <div class="p-3 space-y-2">
                    <div class="skeleton h-3 w-1/2 rounded" />
                    <div class="skeleton h-4 rounded" />
                    <div class="skeleton h-4 w-3/4 rounded" />
                    <div class="skeleton h-8 rounded-lg mt-2" />
                </div>
            </div>
        </div>
        <div v-else-if="!products.length" class="text-center py-16">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-4xl">🛍️</span>
            </div>
            <h3 class="text-gray-700 font-semibold text-lg mb-1">No products found</h3>
            <p class="text-gray-400 text-sm">{{ emptyMessage }}</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductCard v-for="product in products" :key="product.id" :product="product" class="animate-fade-in-up" />
        </div>
    </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
const props = defineProps({
    products: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    skeletonCount: { type: Number, default: 8 },
    emptyMessage: { type: String, default: 'Try adjusting your filters.' },
})
</script>