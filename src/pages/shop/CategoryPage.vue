<template>
    <DefaultLayout>
        <div class="app-container py-8">
            <AppLoader v-if="loading && !category" full-page />
            <template v-else>
                <Breadcrumb :crumbs="crumbs" />
                <!-- Category header -->
                <div v-if="category" class="mb-8 mt-4">
                    <div class="flex items-center gap-4">
                        <div v-if="category.image_url"
                            class="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                            <img :src="category.image_url" :alt="category.name" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 class="section-title">{{ category.name }}</h1>
                            <p v-if="category.description" class="text-gray-500 text-sm mt-1">{{ category.description }}
                            </p>
                            <p class="text-xs text-gray-400 mt-1">{{ pagination?.total || 0 }} products</p>
                        </div>
                    </div>
                    <!-- Subcategories -->
                    <div v-if="category.children?.length" class="flex flex-wrap gap-2 mt-5">
                        <RouterLink v-for="sub in category.children" :key="sub.id" :to="`/category/${sub.slug}`"
                            class="badge-gray hover:badge-green transition-all px-3 py-1.5 text-sm font-medium rounded-xl cursor-pointer">
                            {{ sub.name }}
                        </RouterLink>
                    </div>
                </div>

                <!-- Sort + Products -->
                <div class="flex items-center justify-between mb-5">
                    <p class="text-sm text-gray-500">{{ pagination?.total ?? 0 }} products</p>
                    <SortDropdown v-model="sort" @update:modelValue="onSort" />
                </div>

                <ProductGrid :products="products" :loading="loading" />
                <AppPagination :pagination="pagination" @change="onPage" />
            </template>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import SortDropdown from '@/components/common/SortDropdown.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { categoryService } from '@/services/categoryService'
import { searchService } from '@/services/searchService'

const props = defineProps({ slug: { type: String, required: true } })

const category = ref(null)
const products = ref([])
const pagination = ref(null)
const loading = ref(false)
const sort = ref('')
const page = ref(1)

const crumbs = computed(() => [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: category.value?.name || '...' }
])

async function load(slug) {
    loading.value = true
    try {
        const [catRes, prodRes] = await Promise.all([
            categoryService.show(slug),
            searchService.search({ category: slug, sort: sort.value, page: page.value })
        ])
        category.value = catRes.value?.data?.data || catRes.data?.data
        products.value = prodRes.data?.data || []
        pagination.value = prodRes.data?.pagination
    } catch {
        products.value = []
    } finally {
        loading.value = false
    }
}

function onSort(val) { sort.value = val; page.value = 1; load(props.slug) }
function onPage(p) { page.value = p; load(props.slug) }

watch(() => props.slug, (s) => { page.value = 1; load(s) }, { immediate: true })
</script>