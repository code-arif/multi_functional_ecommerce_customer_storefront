<template>
    <DefaultLayout>
        <div v-if="loading" class="container-app py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                <div class="skeleton rounded-2xl" style="aspect-ratio:1" />
                <div class="space-y-4">
                    <div class="skeleton h-6 w-24 rounded" />
                    <div class="skeleton h-8 w-full rounded" />
                    <div class="skeleton h-8 w-3/4 rounded" />
                    <div class="skeleton h-10 w-32 rounded" />
                    <div class="skeleton h-12 w-full rounded-xl mt-6" />
                </div>
            </div>
        </div>

        <div v-else-if="product" class="py-8">
            <!-- Breadcrumb -->
            <div class="container-app mb-6">
                <nav class="flex items-center gap-2 text-sm text-gray-500">
                    <router-link to="/" class="hover:text-[#2E7D32]">Home</router-link>
                    <ChevronRightIcon class="w-3.5 h-3.5" />
                    <router-link v-if="product.category" :to="`/category/${product.category.slug}`"
                        class="hover:text-[#2E7D32]">
                        {{ product.category.name }}
                    </router-link>
                    <ChevronRightIcon v-if="product.category" class="w-3.5 h-3.5" />
                    <span class="text-gray-800 font-medium truncate max-w-xs">{{ product.name }}</span>
                </nav>
            </div>

            <!-- Main Product Section -->
            <div class="container-app">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    <!-- Gallery -->
                    <div class="space-y-3">
                        <!-- Main Image -->
                        <div class="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in"
                            style="aspect-ratio:1" @click="lightboxOpen = true">
                            <img :src="activeImage" :alt="product.name"
                                class="w-full h-full object-contain p-4 transition-all duration-300" />
                            <button
                                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-[#2E7D32] transition">
                                <MagnifyingGlassPlusIcon class="w-4 h-4" />
                            </button>
                            <div v-if="!product.is_in_stock"
                                class="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <span
                                    class="text-sm font-semibold text-gray-500 border border-gray-300 px-4 py-2 rounded-xl">Out
                                    of Stock</span>
                            </div>
                        </div>

                        <!-- Thumbnails -->
                        <div v-if="allImages.length > 1" class="flex gap-2 overflow-x-auto pb-1">
                            <button v-for="(img, i) in allImages" :key="i" @click="activeImage = img.url"
                                class="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition"
                                :class="activeImage === img.url ? 'border-[#2E7D32]' : 'border-gray-200 hover:border-gray-400'">
                                <img :src="img.url" class="w-full h-full object-cover" />
                            </button>
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="space-y-5">
                        <!-- Brand & badges -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <span v-if="product.brand" class="badge badge-gray">{{ product.brand.name }}</span>
                            <span v-if="product.is_new" class="badge badge-green">New Arrival</span>
                            <span v-if="product.is_bestseller"
                                class="badge bg-orange-100 text-orange-600">Bestseller</span>
                            <span v-if="product.is_on_sale" class="badge badge-red">Sale</span>
                        </div>

                        <!-- Name -->
                        <h1 class="text-2xl md:text-3xl font-black text-gray-900 leading-snug">{{ product.name }}</h1>

                        <!-- Rating -->
                        <div v-if="product.total_reviews > 0" class="flex items-center gap-2">
                            <StarRating :rating="product.average_rating" size="md" />
                            <span class="text-sm text-gray-500">{{ product.average_rating }} ({{ product.total_reviews
                                }} reviews)</span>
                        </div>

                        <!-- Price -->
                        <div class="flex items-baseline gap-3">
                            <span class="text-3xl font-black text-[#2E7D32]">
                                {{ settings.formatPrice(selectedVariant ? selectedVariant.current_price :
                                product.current_price) }}
                            </span>
                            <span v-if="product.is_on_sale && !selectedVariant"
                                class="text-lg text-gray-400 line-through">
                                {{ settings.formatPrice(product.price) }}
                            </span>
                            <span v-if="product.is_on_sale && !selectedVariant" class="badge badge-red">
                                {{ product.discount_percentage }}% OFF
                            </span>
                        </div>

                        <!-- Short description -->
                        <p v-if="product.short_description" class="text-gray-600 leading-relaxed text-sm">
                            {{ product.short_description }}
                        </p>

                        <!-- Variants -->
                        <div v-if="product.type === 'variable' && product.attributes?.length" class="space-y-4">
                            <div v-for="attr in product.attributes" :key="attr.id">
                                <p class="text-sm font-semibold text-gray-700 mb-2">
                                    {{ attr.name }}:
                                    <span class="font-normal text-gray-500">{{ selectedOptions[attr.name] || 'Select'
                                        }}</span>
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="val in attr.values" :key="val.id"
                                        @click="selectOption(attr.name, val.value)"
                                        class="px-4 py-1.5 rounded-lg border text-sm font-medium transition-all" :class="selectedOptions[attr.name] === val.value
                                            ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]'
                                            : 'border-gray-200 text-gray-700 hover:border-[#2E7D32]'">
                                        <span v-if="val.color_code"
                                            class="inline-block w-4 h-4 rounded-full border border-gray-300 mr-1.5 align-middle"
                                            :style="`background:${val.color_code}`" />
                                        {{ val.value }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Quantity + Add to Cart -->
                        <div v-if="product.type !== 'affiliate'" class="flex items-center gap-3">
                            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                <button @click="qty = Math.max(1, qty - 1)"
                                    class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                                    <MinusIcon class="w-4 h-4" />
                                </button>
                                <span class="w-12 text-center font-semibold text-gray-800">{{ qty }}</span>
                                <button @click="qty++"
                                    class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                                    <PlusIcon class="w-4 h-4" />
                                </button>
                            </div>

                            <button @click="handleAddToCart" :disabled="!canAddToCart || isAdding"
                                class="btn-primary flex-1 py-3">
                                <span v-if="isAdding" class="flex items-center gap-2">
                                    <span
                                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Adding...
                                </span>
                                <span v-else-if="!product.is_in_stock">Out of Stock</span>
                                <span v-else-if="product.type === 'variable' && !selectedVariant">Select Options</span>
                                <span v-else class="flex items-center gap-2">
                                    <ShoppingCartIcon class="w-4 h-4" />Add to Cart
                                </span>
                            </button>

                            <button @click="toggleWishlist"
                                class="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center transition hover:border-red-400"
                                :class="isWishlisted ? 'text-red-500 bg-red-50 border-red-200' : 'text-gray-400'">
                                <HeartIcon class="w-5 h-5" :class="isWishlisted ? 'fill-red-500' : ''" />
                            </button>
                        </div>

                        <!-- Affiliate button -->
                        <a v-else :href="product.affiliate_link" target="_blank" rel="noopener"
                            @click="trackAffiliateClick" class="btn-primary w-full py-3.5 text-center block text-base">
                            <ArrowTopRightOnSquareIcon class="w-5 h-5 inline mr-2" />
                            Buy on {{ product.source_platform || 'External Store' }}
                        </a>

                        <!-- Stock indicator -->
                        <div v-if="product.is_in_stock" class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span v-if="product.is_low_stock" class="text-orange-600 font-medium">
                                Only {{ product.stock_quantity }} left in stock!
                            </span>
                            <span v-else class="text-green-600 font-medium">In Stock</span>
                        </div>

                        <!-- Meta info -->
                        <div class="border-t border-gray-100 pt-4 space-y-1.5 text-sm text-gray-500">
                            <p v-if="product.sku"><span class="font-medium text-gray-700">SKU:</span> {{ product.sku }}
                            </p>
                            <p v-if="product.category"><span class="font-medium text-gray-700">Category:</span>
                                <router-link :to="`/category/${product.category.slug}`"
                                    class="text-[#2E7D32] hover:underline ml-1">
                                    {{ product.category.name }}
                                </router-link>
                            </p>
                            <p v-if="product.tags?.length"><span class="font-medium text-gray-700">Tags:</span>
                                <span v-for="tag in product.tags" :key="tag"
                                    class="ml-1 inline-block badge badge-gray">{{ tag }}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Tabs: Description & Reviews -->
                <div class="mt-12">
                    <div class="flex border-b border-gray-200 gap-1">
                        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                            class="px-5 py-3 text-sm font-semibold border-b-2 transition -mb-px" :class="activeTab === tab.key
                                ? 'border-[#2E7D32] text-[#2E7D32]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'">
                            {{ tab.label }}
                            <span v-if="tab.key === 'reviews'" class="ml-1 text-xs text-gray-400">({{
                                product.total_reviews }})</span>
                        </button>
                    </div>

                    <div class="py-8">
                        <!-- Description -->
                        <div v-if="activeTab === 'description'" class="prose prose-sm max-w-none text-gray-700"
                            v-html="product.description || product.short_description || 'No description available.'" />

                        <!-- Reviews -->
                        <div v-if="activeTab === 'reviews'">
                            <!-- Rating summary -->
                            <div class="flex items-center gap-6 p-6 bg-green-pale rounded-2xl mb-6">
                                <div class="text-center">
                                    <p class="text-5xl font-black text-[#2E7D32]">{{ product.average_rating.toFixed(1)
                                        }}</p>
                                    <StarRating :rating="product.average_rating" size="md"
                                        class="mt-1 justify-center" />
                                    <p class="text-xs text-gray-500 mt-1">{{ product.total_reviews }} reviews</p>
                                </div>
                                <div class="flex-1 space-y-1.5">
                                    <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2">
                                        <span class="text-xs w-4 text-gray-500">{{ star }}</span>
                                        <StarIcon class="w-3.5 h-3.5 text-yellow-400" />
                                        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-yellow-400 rounded-full transition-all"
                                                :style="`width:${getStarPercent(star)}%`" />
                                        </div>
                                        <span class="text-xs text-gray-400 w-6">{{ reviewBreakdown[star] || 0 }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Review list -->
                            <div v-if="reviews.length" class="space-y-4">
                                <div v-for="review in reviews" :key="review.id" class="card p-4">
                                    <div class="flex items-start justify-between gap-3 mb-2">
                                        <div class="flex items-center gap-2.5">
                                            <div
                                                class="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-bold">
                                                {{ review.user?.name?.charAt(0).toUpperCase() }}
                                            </div>
                                            <div>
                                                <p class="text-sm font-semibold text-gray-800">{{ review.user?.name }}
                                                </p>
                                                <p class="text-xs text-gray-400">{{ review.created_at }}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <StarRating :rating="review.rating" size="sm" />
                                            <span v-if="review.is_verified_purchase"
                                                class="badge badge-green text-[10px]">✓ Verified</span>
                                        </div>
                                    </div>
                                    <p v-if="review.title" class="font-semibold text-gray-800 mb-1 text-sm">{{
                                        review.title }}</p>
                                    <p class="text-sm text-gray-600 leading-relaxed">{{ review.body }}</p>
                                </div>
                            </div>
                            <div v-else class="text-center py-10 text-gray-400">
                                <ChatBubbleLeftRightIcon class="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p>No reviews yet. Be the first to review!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products -->
            <section v-if="related.length" class="py-12 bg-[#F9FAFB] mt-8">
                <div class="container-app">
                    <SectionHeader title="You May Also Like" subtitle="Related Products" />
                    <ProductGrid :products="related" />
                </div>
            </section>
        </div>

        <!-- 404 -->
        <div v-else class="container-app py-20 text-center">
            <p class="text-gray-500">Product not found.</p>
            <router-link to="/shop" class="btn-primary mt-4 inline-flex">Back to Shop</router-link>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import StarRating from '@/components/common/StarRating.vue'
import { productApi, affiliateApi } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { useHead } from '@unhead/vue'
import {
    ChevronRightIcon, ShoppingCartIcon, HeartIcon, MinusIcon, PlusIcon,
    MagnifyingGlassPlusIcon, ArrowTopRightOnSquareIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()
const settings = useSettingsStore()
const auth = useAuthStore()

const product = ref(null)
const loading = ref(true)
const reviews = ref([])
const related = ref([])
const activeImage = ref('')
const activeTab = ref('description')
const qty = ref(1)
const selectedOptions = ref({})
const selectedVariant = ref(null)
const lightboxOpen = ref(false)
const isAdding = computed(() => cart.addingId !== null)
const isWishlisted = computed(() => wishlist.isWishlisted(product.value?.id))

const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'reviews', label: 'Reviews' },
]

const allImages = computed(() => {
    if (!product.value) return []
    const imgs = product.value.images || []
    if (product.value.thumbnail_url && !imgs.length) return [{ url: product.value.thumbnail_url }]
    return imgs.map(i => ({ url: i.url }))
})

const reviewBreakdown = computed(() => {
    const b = {}
    reviews.value.forEach(r => { b[r.rating] = (b[r.rating] || 0) + 1 })
    return b
})

function getStarPercent(star) {
    if (!product.value?.total_reviews) return 0
    return Math.round(((reviewBreakdown.value[star] || 0) / product.value.total_reviews) * 100)
}

function selectOption(attrName, value) {
    selectedOptions.value = { ...selectedOptions.value, [attrName]: value }
    // Find matching variant
    selectedVariant.value = product.value?.variants?.find(v => {
        return Object.entries(selectedOptions.value).every(([k, val]) => v.attributes[k] === val)
    }) || null
}

const canAddToCart = computed(() => {
    if (!product.value?.is_in_stock) return false
    if (product.value.type === 'variable') return !!selectedVariant.value
    return true
})

async function handleAddToCart() {
    await cart.addItem(
        product.value.id,
        selectedVariant.value?.id || null,
        qty.value
    )
}

async function toggleWishlist() {
    if (!auth.isLoggedIn) return
    await wishlist.toggle(product.value.id)
}

async function trackAffiliateClick() {
    try { await affiliateApi.click(product.value.slug) } catch { }
}

async function loadProduct() {
    loading.value = true
    try {
        const res = await productApi.show(route.params.slug)
        product.value = res.data.data
        activeImage.value = allImages.value[0]?.url || ''
        // Load reviews and related in parallel
        const [revRes, relRes] = await Promise.allSettled([
            productApi.reviews(route.params.slug, { per_page: 10 }),
            productApi.related(route.params.slug),
        ])
        if (revRes.status === 'fulfilled') reviews.value = revRes.value.data.data || []
        if (relRes.status === 'fulfilled') related.value = relRes.value.data.data || []
    } catch { product.value = null }
    finally { loading.value = false }
}

watch(() => route.params.slug, loadProduct, { immediate: true })

// Dynamic head
const headTitle = computed(() => product.value ? `${product.value.name} — EcoShop` : 'Product')
useHead({ title: headTitle })
</script>