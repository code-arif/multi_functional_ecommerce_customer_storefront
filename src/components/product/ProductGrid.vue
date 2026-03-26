<template>
    <div>
        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="i in skeletonCount" :key="i"
                class="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                <div class="skeleton aspect-product" />
                <div class="p-3.5 space-y-2">
                    <div class="skeleton h-3 w-2/5 rounded-full" />
                    <div class="skeleton h-4 rounded-lg" />
                    <div class="skeleton h-4 w-3/4 rounded-lg" />
                    <div class="skeleton h-9 rounded-xl mt-2" />
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <EmptyState v-else-if="!products.length" icon="bag" title="No products found" :description="emptyMessage"
            action-to="/shop" action-label="Browse All Products" />

        <!-- Grid -->
        <div v-else class="grid gap-4" :class="gridCols">
            <ProductCard v-for="product in products" :key="product.id" :product="product" class="animate-fade-up" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps({
    products: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    skeletonCount: { type: Number, default: 8 },
    emptyMessage: { type: String, default: 'Try adjusting your filters or search query.' },
    cols: { type: Number, default: 4 }
})

const gridCols = computed(() => ({
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
}[props.cols] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'))
</script>