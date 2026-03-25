<template>
    <DefaultLayout>
        <div class="container-app py-8">
            <div class="flex gap-8">
                <!-- Sidebar Filters -->
                <aside class="hidden lg:block w-64 shrink-0">
                    <div class="card p-5 sticky top-24">
                        <div class="flex items-center justify-between mb-5">
                            <h3 class="font-bold text-gray-900">Filters</h3>
                            <button @click="clearFilters" class="text-xs text-[#2E7D32] hover:underline">Clear
                                All</button>
                        </div>
                        <!-- Category -->
                        <div class="mb-5">
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Category</p>
                            <div class="space-y-2 max-h-48 overflow-y-auto">
                                <label v-for="cat in categories" :key="cat.id"
                                    class="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="radio" :value="cat.slug" v-model="filters.category"
                                        class="accent-[#2E7D32]" />
                                    <span class="text-sm text-gray-700 group-hover:text-[#2E7D32] transition">{{
                                        cat.name }}</span>
                                </label>
                            </div>
                        </div>
                        <!-- Price Range -->
                        <div class="mb-5">
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Price Range</p>
                            <div class="flex gap-2">
                                <input v-model.number="filters.min_price" type="number" placeholder="Min"
                                    class="input py-2 text-sm" />
                                <input v-model.number="filters.max_price" type="number" placeholder="Max"
                                    class="input py-2 text-sm" />
                            </div>
                        </div>
                        <!-- Rating -->
                        <div class="mb-5">
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Min Rating</p>
                            <div class="space-y-2">
                                <label v-for="r in [4, 3, 2, 1]" :key="r" class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" :value="r" v-model.number="filters.rating"
                                        class="accent-[#2E7D32]" />
                                    <div class="flex items-center gap-1">
                                        <span v-for="i in 5" :key="i" class="text-sm"
                                            :class="i <= r ? 'text-yellow-400' : 'text-gray-200'">★</span>
                                        <span class="text-xs text-gray-500">& up</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <!-- In Stock -->
                        <label class="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" v-model="filters.in_stock" class="accent-[#2E7D32] w-4 h-4" />
                            <span class="text-sm text-gray-700">In Stock Only</span>
                        </label>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="flex-1 min-w-0">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h1 class="text-2xl font-black text-gray-900">{{ pageTitle }}</h1>
                            <p class="text-sm text-gray-500 mt-0.5">{{ pagination?.total || 0 }} products found</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <!-- Sort -->
                            <select v-model="filters.sort" class="input py-2 text-sm w-44">
                                <option value="">Latest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popularity">Most Popular</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <!-- Mobile filter btn -->
                            <button @click="mobileFilters = true"
                                class="lg:hidden btn-secondary py-2 text-sm">Filters</button>
                        </div>
                    </div>

                    <!-- Active filters -->
                    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
                        <span v-if="filters.category"
                            class="inline-flex items-center gap-1 bg-green-pale text-[#2E7D32] text-xs font-semibold px-3 py-1.5 rounded-full">
                            {{ filters.category }} <button @click="filters.category = ''"
                                class="ml-1 hover:text-red-500">×</button>
                        </span>
                        <span v-if="filters.rating"
                            class="inline-flex items-center gap-1 bg-green-pale text-[#2E7D32] text-xs font-semibold px-3 py-1.5 rounded-full">
                            {{ filters.rating }}★+ <button @click="filters.rating = null"
                                class="ml-1 hover:text-red-500">×</button>
                        </span>
                        <span v-if="filters.in_stock"
                            class="inline-flex items-center gap-1 bg-green-pale text-[#2E7D32] text-xs font-semibold px-3 py-1.5 rounded-full">
                            In Stock <button @click="filters.in_stock = false" class="ml-1 hover:text-red-500">×</button>
                        </span>
                    </div>

                    <!-- Products -->
                    <ProductGrid :products="products" :loading="loading" />

                    <!-- Pagination -->
                    <AppPagination :pagination="pagination" @change="onPageChange" class="mt-8" />
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { productApi, categoryApi, searchApi } from '@/api'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

const products = ref([])
const pagination = ref(null)
const loading = ref(true)
const categories = ref([])
const mobileFilters = ref(false)

const filters = reactive({
    category: route.query.category || '',
    sort: route.query.sort || '',
    min_price: route.query.min_price || null,
    max_price: route.query.max_price || null,
    rating: route.query.rating || null,
    in_stock: route.query.in_stock === 'true',
    page: 1,
})

const pageTitle = computed(() => {
    if (filters.category) return filters.category
    return 'All Products'
})

const hasActiveFilters = computed(() =>
    filters.category || filters.rating || filters.in_stock || filters.min_price || filters.max_price
)

function clearFilters() {
    Object.assign(filters, { category: '', sort: '', min_price: null, max_price: null, rating: null, in_stock: false, page: 1 })
}

const fetchProducts = useDebounceFn(async () => {
    loading.value = true
    try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== null && v !== '' && v !== false))
        const res = await searchApi.search(params)
        products.value = res.data.data || []
        pagination.value = res.data.pagination
    } finally {
        loading.value = false
    }
}, 400)

function onPageChange(page) { filters.page = page }

watch(filters, () => fetchProducts(), { deep: true })

onMounted(async () => {
    const [catRes] = await Promise.allSettled([categoryApi.tree()])
    if (catRes.status === 'fulfilled') categories.value = catRes.value.data.data || []
    fetchProducts()
})
</script>