<template>
    <DefaultLayout>
        <div class="app-container py-8">
            <Breadcrumb :crumbs="[{ label: 'Home', to: '/' }, { label: 'Search' }]" />
            <!-- Search box -->
            <div class="max-w-2xl mt-4 mb-8">
                <h1 class="section-title mb-5">
                    {{ query ? `Results for "${query}"` : 'Search Products' }}
                </h1>
                <div class="flex gap-3">
                    <input v-model="localQuery" @keyup.enter="doSearch" type="text" placeholder="Search products..."
                        class="form-input flex-1" />
                    <button @click="doSearch" class="btn-primary px-6">Search</button>
                </div>
            </div>

            <!-- Filters row -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <p class="text-sm text-gray-500">{{ pagination?.total ?? 0 }} products found</p>
                <div class="ml-auto flex items-center gap-3">
                    <SortDropdown v-model="sort" @update:modelValue="onSort" />
                </div>
            </div>

            <ProductGrid :products="products" :loading="loading" :empty-message="`No products found for '${query}'`" />
            <AppPagination :pagination="pagination" @change="onPage" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import SortDropdown from '@/components/common/SortDropdown.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { searchService } from '@/services/searchService'

const route = useRoute()
const router = useRouter()

const query = ref(route.query.q || '')
const localQuery = ref(query.value)
const products = ref([])
const pagination = ref(null)
const loading = ref(false)
const sort = ref(route.query.sort || '')
const page = ref(Number(route.query.page) || 1)

async function search() {
    if (!query.value.trim()) return
    loading.value = true
    try {
        const res = await searchService.search({ q: query.value, sort: sort.value, page: page.value })
        products.value = res.data.data || []
        pagination.value = res.data.pagination
    } finally {
        loading.value = false
    }
}

function doSearch() {
    query.value = localQuery.value.trim()
    page.value = 1
    router.replace({ query: { q: query.value } })
    search()
}

function onSort(val) { sort.value = val; page.value = 1; search() }
function onPage(p) { page.value = p; search() }

watch(() => route.query.q, (q) => {
    if (q) { query.value = q; localQuery.value = q; search() }
})

onMounted(() => { if (query.value) search() })
</script>