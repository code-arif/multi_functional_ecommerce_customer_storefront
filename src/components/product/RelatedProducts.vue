<template>
    <section v-if="products.length || loading" class="mt-14">
        <div class="flex items-center justify-between mb-6">
            <h2 class="section-title">Related Products</h2>
            <RouterLink :to="`/category/${categorySlug}`" v-if="categorySlug"
                class="text-sm font-semibold text-primary-700 hover:underline">
                View All →
            </RouterLink>
        </div>
        <ProductGrid :products="products" :loading="loading" :skeleton-count="4" />
    </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProductGrid from './ProductGrid.vue'
import { productService } from '@/services/productService'

const props = defineProps({
    slug: { type: String, required: true },
    categorySlug: { type: String, default: '' }
})

const products = ref([])
const loading = ref(false)

async function load(slug) {
    loading.value = true
    try {
        const res = await productService.related(slug)
        products.value = res.data.data || []
    } finally {
        loading.value = false
    }
}

watch(() => props.slug, load, { immediate: true })
</script>