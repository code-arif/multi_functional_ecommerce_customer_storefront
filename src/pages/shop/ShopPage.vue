<template>
    <DefaultLayout>
        <div class="app-container py-8">
            <Breadcrumb :crumbs="[{ label: 'Home', to: '/' }, { label: 'Shop' }]" />

            <div class="flex gap-8 mt-2">
                <!-- Filter sidebar (desktop) -->
                <div class="hidden lg:block w-64 shrink-0">
                    <FilterSidebar :filters="filters" :categories="categories" @update="onFilterUpdate"
                        @clear="clearFilters" />
                </div>

                <!-- Main content -->
                <div class="flex-1 min-w-0">
                    <!-- Header row -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h1 class="section-title">{{ pageTitle }}</h1>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ pagination?.total ?? 0 }} products found
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <SortDropdown v-model="filters.sort" @update:modelValue="onSortChange" />
                            <!-- Mobile filter btn -->
                            <button @click="mobileFilterOpen = true" class="lg:hidden btn-outline text-sm py-2.5">
                                <FunnelIcon class="w-4 h-4" /> Filters
                            </button>
                        </div>
                    </div>

                    <!-- Active filter chips -->
                    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-5">
                        <span v-if="filters.category"
                            class="inline-flex items-center gap-1 badge-green text-xs font-semibold px-3 py-1.5">
                            {{ filters.category }}
                            <button @click="onFilterUpdate({ ...filters, category: '' })"
                                class="ml-1 hover:text-red-500 text-sm leading-none">×</button>
                        </span>
                        <span v-if="filters.rating"
                            class="inline-flex items-center gap-1 badge-green text-xs font-semibold px-3 py-1.5">
                            {{ filters.rating }}★ & up
                            <button @click="onFilterUpdate({ ...filters, rating: '' })"
                                class="ml-1 hover:text-red-500 text-sm leading-none">×</button>
                        </span>
                        <span v-if="filters.in_stock"
                            class="inline-flex items-center gap-1 badge-green text-xs font-semibold px-3 py-1.5">
                            In Stock
                            <button @click="onFilterUpdate({ ...filters, in_stock: false })"
                                class="ml-1 hover:text-red-500 text-sm leading-none">×</button>
                        </span>
                        <button @click="clearFilters" class="text-xs text-red-500 font-semibold hover:underline">Clear
                            all</button>
                    </div>

                    <ProductGrid :products="products" :loading="loading" />
                    <AppPagination :pagination="pagination" @change="onPageChange" />
                </div>
            </div>

            <!-- Mobile filter drawer -->
            <Teleport to="body">
                <Transition name="fade">
                    <div v-if="mobileFilterOpen" class="fixed inset-0 bg-black/40 z-40 lg:hidden"
                        @click="mobileFilterOpen = false" />
                </Transition>
                <Transition name="slide-up">
                    <div v-if="mobileFilterOpen"
                        class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-5 lg:hidden max-h-[80vh] overflow-y-auto">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-gray-900">Filters</h3>
                            <button @click="mobileFilterOpen = false" class="btn-icon">
                                <XMarkIcon class="w-5 h-5" />
                            </button>
                        </div>
                        <FilterSidebar :filters="filters" :categories="categories"
                            @update="v => { onFilterUpdate(v); mobileFilterOpen = false }" @clear="clearFilters" />
                    </div>
                </Transition>
            </Teleport>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import FilterSidebar from '@/components/product/FilterSidebar.vue'
import SortDropdown from '@/components/common/SortDropdown.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { searchService } from '@/services/searchService'
import { categoryService } from '@/services/categoryService'
import { useDebounceFn } from '@vueuse/core'
import { FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const products = ref([])
const pagination = ref(null)
const loading = ref(false)
const categories = ref([])
const mobileFilterOpen = ref(false)

const filters = reactive({
    category: route.query.category || '',
    brand: route.query.brand || '',
    min_price: route.query.min_price || '',
    max_price: route.query.max_price || '',
    rating: route.query.rating || '',
    in_stock: route.query.in_stock || '',
    sort: route.query.sort || '',
    page: Number(route.query.page) || 1,
    featured: route.query.featured || '',
    new: route.query.new || ''
})

const pageTitle = computed(() => filters.category ? filters.category : 'All Products')
const hasActiveFilters = computed(() => filters.category || filters.rating || filters.in_stock || filters.min_price || filters.max_price)

const loadProducts = useDebounceFn(async () => {
    loading.value = true
    try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false && v !== null))
        const res = await searchService.search(params)
        products.value = res.data.data || []
        pagination.value = res.data.pagination
    } finally {
        loading.value = false
    }
}, 300)

function onFilterUpdate(vals) {
    Object.assign(filters, vals, { page: 1 })
    loadProducts()
}
function onSortChange(val) { filters.sort = val; filters.page = 1; loadProducts() }
function onPageChange(page) { filters.page = page; loadProducts() }
function clearFilters() {
    Object.assign(filters, { category: '', brand: '', min_price: '', max_price: '', rating: '', in_stock: '', sort: '', page: 1 })
    loadProducts()
}

onMounted(async () => {
    const [, catRes] = await Promise.allSettled([loadProducts(), categoryService.tree()])
    if (catRes.status === 'fulfilled') categories.value = catRes.value.data.data || []
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform .25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>