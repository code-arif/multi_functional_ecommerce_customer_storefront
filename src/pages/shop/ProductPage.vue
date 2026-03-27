<template>
    <DefaultLayout>
        <div class="app-container py-6">

            <!-- Loading -->
            <AppLoader v-if="loading" full-page text="Loading product..." />

            <!-- Error / Not found -->
            <EmptyState v-else-if="error" icon="bag" title="Product Not Found"
                description="This product doesn't exist or has been removed." action-to="/shop"
                action-label="Browse Shop" />

            <template v-else-if="product">
                <!-- Breadcrumb -->
                <Breadcrumb :crumbs="crumbs" />

                <!-- Main product layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 mt-4">

                    <!-- Gallery -->
                    <div class="md:sticky md:top-24 self-start">
                        <ProductGallery :images="product.images || []" :thumbnail="product.thumbnail_url"
                            :alt="product.name" :discount="discountPct" />
                    </div>

                    <!-- Product info -->
                    <div class="space-y-5">
                        <!-- Brand -->
                        <RouterLink v-if="product.brand" :to="`/shop?brand=${product.brand.slug}`"
                            class="text-sm font-semibold text-primary-700 hover:underline">
                            {{ product.brand.name }}
                        </RouterLink>

                        <!-- Title -->
                        <h1 class="font-display text-2xl md:text-3xl font-800 text-gray-900 leading-tight">{{
                            product.name }}</h1>

                        <!-- Rating -->
                        <div v-if="product.total_reviews > 0" class="flex items-center gap-3">
                            <StarRating :rating="product.average_rating" size="md" />
                            <span class="text-sm text-gray-500 font-medium">{{ product.average_rating }}/5 ({{
                                product.total_reviews }} reviews)</span>
                        </div>

                        <!-- Price -->
                        <div class="flex items-end gap-3">
                            <span class="font-display text-3xl font-800 text-primary-700">{{ formatPrice(displayPrice)
                            }}</span>
                            <span v-if="isOnSale" class="text-lg text-gray-400 line-through pb-0.5">{{
                                formatPrice(originalPrice) }}</span>
                            <span v-if="discountPct > 0"
                                class="badge bg-red-100 text-red-600 text-sm px-2.5 py-1 mb-0.5">-{{ discountPct
                                }}%</span>
                        </div>

                        <!-- Short description -->
                        <p v-if="product.short_description" class="text-gray-600 text-sm leading-relaxed">{{
                            product.short_description }}</p>

                        <hr class="border-gray-100" />

                        <!-- Variants -->
                        <VariantSelector v-if="product.type === 'variable'" :attributes="product.attributes || []"
                            :variants="product.variants || []" :selected="selectedAttributes"
                            @select="selectAttribute" />

                        <!-- Stock status -->
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full shrink-0"
                                :class="inStock ? 'bg-green-500' : 'bg-red-400'" />
                            <span class="text-sm font-semibold" :class="inStock ? 'text-green-700' : 'text-red-600'">
                                {{ inStock ? (product.is_low_stock ? `Low Stock — Only ${stockQty} left` : 'In Stock') :
                                    'Out of Stock' }}
                            </span>
                        </div>

                        <!-- Qty + Add to cart -->
                        <div v-if="product.type !== 'affiliate'" class="space-y-3">
                            <div class="flex items-center gap-4">
                                <QuantitySelector v-model="quantity" :max="Math.min(stockQty, 10)" />
                                <span class="text-xs text-gray-400">Max 10 per order</span>
                            </div>
                            <AddToCartButton :loading="cart.isAdding(product.id)" :disabled="!inStock"
                                :label="inStock ? 'Add to Cart' : 'Out of Stock'" @click="addToCart" />
                            <WishlistButton :is-wishlisted="wishlist.isWishlisted(product.id)"
                                @click="toggleWishlist" />
                        </div>

                        <!-- Affiliate -->
                        <div v-else>
                            <a :href="product.affiliate_link" target="_blank" rel="noopener noreferrer"
                                class="btn-primary-lg w-full justify-center">
                                🛍️ Buy on {{ product.source_platform }} →
                            </a>
                            <p class="text-xs text-gray-400 text-center mt-2">You'll be redirected to {{
                                product.source_platform }}</p>
                        </div>

                        <hr class="border-gray-100" />

                        <!-- Meta info -->
                        <dl class="grid grid-cols-1 gap-2 text-sm">
                            <div v-if="product.sku" class="flex gap-2">
                                <dt class="font-semibold text-gray-500 w-20 shrink-0">SKU:</dt>
                                <dd class="text-gray-700">{{ product.sku }}</dd>
                            </div>
                            <div v-if="product.category" class="flex gap-2">
                                <dt class="font-semibold text-gray-500 w-20 shrink-0">Category:</dt>
                                <dd>
                                    <RouterLink :to="`/category/${product.category.slug}`"
                                        class="text-primary-700 hover:underline">{{ product.category.name }}
                                    </RouterLink>
                                </dd>
                            </div>
                            <div v-if="product.tags?.length" class="flex gap-2">
                                <dt class="font-semibold text-gray-500 w-20 shrink-0">Tags:</dt>
                                <dd class="flex flex-wrap gap-1">
                                    <span v-for="tag in product.tags" :key="tag"
                                        class="badge-gray text-xs px-2 py-0.5">{{ tag }}</span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <!-- Tabs: Description / Reviews / Specs -->
                <div class="mt-14">
                    <div class="flex border-b border-gray-200 gap-0 overflow-x-auto">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px"
                            :class="activeTab === tab.id
                                ? 'border-primary-700 text-primary-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'">
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Description -->
                    <div v-if="activeTab === 'description'" class="py-8 max-w-3xl">
                        <div v-if="product.description" class="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                            v-html="product.description" />
                        <p v-else class="text-gray-500 text-sm">No description available for this product.</p>
                    </div>

                    <!-- Reviews -->
                    <div v-if="activeTab === 'reviews'" class="py-8">
                        <div v-if="product.reviews?.length">
                            <!-- Rating summary -->
                            <div class="flex items-start gap-8 mb-8 pb-8 border-b border-gray-100">
                                <div class="text-center shrink-0">
                                    <p class="font-display text-5xl font-800 text-primary-700">{{ product.average_rating
                                    }}</p>
                                    <StarRating :rating="product.average_rating" size="md"
                                        class="justify-center mt-1" />
                                    <p class="text-xs text-gray-400 mt-1">{{ product.total_reviews }} reviews</p>
                                </div>
                                <div class="flex-1 space-y-2">
                                    <div v-for="r in [5, 4, 3, 2, 1]" :key="r" class="flex items-center gap-3 text-xs">
                                        <span class="w-6 text-right text-gray-500">{{ r }}★</span>
                                        <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div class="h-full bg-yellow-400 rounded-full transition-all"
                                                :style="`width:${ratingPct(r)}%`" />
                                        </div>
                                        <span class="w-6 text-gray-400">{{ ratingCount(r) }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Review list -->
                            <div class="space-y-5">
                                <div v-for="review in product.reviews" :key="review.id" class="card p-5">
                                    <div class="flex items-start justify-between gap-4 mb-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                {{ review.user?.name?.charAt(0) || 'A' }}
                                            </div>
                                            <div>
                                                <p class="font-semibold text-gray-800 text-sm">{{ review.user?.name ||
                                                    'Anonymous' }}</p>
                                                <p class="text-xs text-gray-400">{{ review.created_at }}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <StarRating :rating="review.rating" size="sm" />
                                            <span v-if="review.is_verified_purchase" class="badge-green text-[10px]">✓
                                                Verified</span>
                                        </div>
                                    </div>
                                    <p v-if="review.title" class="font-semibold text-gray-800 text-sm mb-1">{{
                                        review.title }}</p>
                                    <p class="text-sm text-gray-600 leading-relaxed">{{ review.body }}</p>
                                    <div v-if="review.images?.length" class="flex gap-2 mt-3 flex-wrap">
                                        <img v-for="img in review.images" :key="img" :src="img"
                                            class="w-16 h-16 rounded-lg object-cover border border-gray-200 cursor-pointer hover:scale-105 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <EmptyState v-else icon="inbox" title="No reviews yet"
                            description="Be the first to review this product!" />
                    </div>
                </div>

                <!-- Related products -->
                <RelatedProducts :slug="product.slug" :category-slug="product.category?.slug" />
            </template>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import StarRating from '@/components/common/StarRating.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import VariantSelector from '@/components/product/VariantSelector.vue'
import QuantitySelector from '@/components/product/QuantitySelector.vue'
import AddToCartButton from '@/components/product/AddToCartButton.vue'
import WishlistButton from '@/components/product/WishlistButton.vue'
import RelatedProducts from '@/components/product/RelatedProducts.vue'
import { useProduct } from '@/composables/useProduct'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUiStore } from '@/stores/uiStore'
import { discountPercent } from '@/utils/currency'

const route = useRoute()
const slug = computed(() => route.params.slug)

const cart = useCartStore()
const wishlist = useWishlistStore()
const ui = useUiStore()

const {
    product, loading, error,
    selectedAttributes, quantity,
    displayPrice, originalPrice, isOnSale, inStock, stockQty,
    fetch, selectAttribute, addToCart, toggleWishlist
} = useProduct()

const activeTab = ref('description')

const formatPrice = (p) => ui.formatPrice(p)
const discountPct = computed(() => discountPercent(originalPrice.value, displayPrice.value))
const crumbs = computed(() => [
    { label: 'Home', to: '/' },
    { label: product.value?.category?.name || 'Shop', to: product.value?.category ? `/category/${product.value.category.slug}` : '/shop' },
    { label: product.value?.name || '' }
])

const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: `Reviews (${product.value?.total_reviews || 0})` }
]

function ratingCount(r) {
    return product.value?.reviews?.filter(rv => rv.rating === r).length || 0
}
function ratingPct(r) {
    const total = product.value?.total_reviews || 0
    if (!total) return 0
    return Math.round((ratingCount(r) / total) * 100)
}

// watch(() => props.slug, (slug) => { if (slug) fetch(slug) }, { immediate: true })
watch(slug, (val) => {
    if (val) fetch(val)
}, { immediate: true })
</script>