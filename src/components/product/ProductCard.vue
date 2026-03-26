<template>
    <div class="card-hover group relative flex flex-col overflow-hidden">

        <!-- Badges -->
        <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
            <span v-if="isOnSale" class="badge bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{{ discountPct }}%
            </span>
            <span v-if="product.is_new"
                class="badge bg-primary-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
            <span v-if="product.is_bestseller"
                class="badge bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span>
        </div>

        <!-- Wishlist button -->
        <button @click.prevent="handleWishlist" class="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center
             opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            :class="isWishlisted ? 'text-red-500' : 'text-gray-400'"
            :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'">
            <HeartIcon v-if="!isWishlisted" class="w-4 h-4" />
            <HeartSolidIcon v-else class="w-4 h-4" />
        </button>

        <!-- Image -->
        <RouterLink :to="`/product/${product.slug}`" class="block relative overflow-hidden bg-gray-50 aspect-product">
            <img v-if="imageUrl" :src="imageUrl" :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <PhotoIcon class="w-16 h-16 text-gray-200" />
            </div>

            <!-- Out of stock overlay -->
            <div v-if="!product.is_in_stock" class="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span
                    class="text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1 rounded-full bg-white">
                    Out of Stock
                </span>
            </div>
        </RouterLink>

        <!-- Info -->
        <div class="p-3.5 flex flex-col flex-1 gap-2">
            <!-- Category -->
            <p v-if="product.category?.name" class="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                {{ product.category.name }}
            </p>

            <!-- Name -->
            <RouterLink :to="`/product/${product.slug}`" class="block">
                <h3
                    class="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-primary-700 transition-colors">
                    {{ product.name }}
                </h3>
            </RouterLink>

            <!-- Rating -->
            <div v-if="product.total_reviews > 0" class="flex items-center gap-1.5">
                <StarRating :rating="product.average_rating" size="xs" />
                <span class="text-[11px] text-gray-400">({{ product.total_reviews }})</span>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-2 mt-auto">
                <span class="text-base font-bold text-primary-700">
                    {{ formatPrice(product.current_price) }}
                </span>
                <span v-if="isOnSale" class="text-xs text-gray-400 line-through">
                    {{ formatPrice(product.price) }}
                </span>
            </div>

            <!-- CTA -->
            <template v-if="product.type !== 'affiliate'">
                <button @click="handleAddToCart" :disabled="!product.is_in_stock || isAdding"
                    class="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 mt-1" :class="product.is_in_stock
                        ? 'bg-brand-pale text-primary-700 hover:bg-primary-700 hover:text-white active:scale-[0.97]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'">
                    <span v-if="isAdding" class="flex items-center justify-center gap-1.5">
                        <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Adding...
                    </span>
                    <span v-else-if="product.type === 'variable'">Select Options</span>
                    <span v-else-if="product.is_in_stock">Add to Cart</span>
                    <span v-else>Out of Stock</span>
                </button>
            </template>

            <template v-else>
                <a :href="product.affiliate_link" target="_blank" rel="noopener noreferrer" class="w-full py-2 rounded-xl text-xs font-semibold text-center bg-orange-50 text-orange-600
                 hover:bg-orange-500 hover:text-white transition-all duration-200 block mt-1">
                    Buy on {{ product.source_platform || 'External' }} →
                </a>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUiStore } from '@/stores/uiStore'
import { discountPercent } from '@/utils/currency'
import StarRating from '@/components/common/StarRating.vue'
import { HeartIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    product: { type: Object, required: true }
})

const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()
const ui = useUiStore()

const formatPrice = (p) => ui.formatPrice(p)
const isAdding = computed(() => cart.addingId === props.product.id || cart.addingId === props.product.slug)
const isWishlisted = computed(() => wishlist.isWishlisted(props.product.id))
const isOnSale = computed(() => props.product.is_on_sale || (props.product.sale_price && Number(props.product.sale_price) < Number(props.product.price)))
const discountPct = computed(() => props.product.discount_percentage || discountPercent(props.product.price, props.product.sale_price))

const imageUrl = computed(() => {
    return props.product.primary_image?.url
        || props.product.thumbnail_url
        || props.product.images?.[0]?.url
        || null
})

async function handleAddToCart() {
    if (props.product.type === 'variable') {
        router.push(`/product/${props.product.slug}`)
        return
    }
    await cart.addItem(props.product.id, null, 1)
}

async function handleWishlist() {
    await wishlist.toggle(props.product.id)
}
</script>