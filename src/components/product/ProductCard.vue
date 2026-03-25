<template>
    <div class="card card-hover group relative flex flex-col overflow-hidden">
        <!-- Badges -->
        <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            <span v-if="product.is_on_sale"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">-{{
                    product.discount_percentage }}%</span>
            <span v-if="product.is_new"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D32] text-white">NEW</span>
        </div>
        <!-- Wishlist -->
        <button v-if="auth.isLoggedIn" @click.prevent="toggleWishlist"
            class="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            :class="isWishlisted ? 'text-red-500' : 'text-gray-400'">
            <svg class="w-4 h-4" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
        <!-- Image -->
        <router-link :to="`/product/${product.slug}`" class="block relative overflow-hidden bg-gray-50"
            style="aspect-ratio:1">
            <img v-if="imageUrl" :src="imageUrl" :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-5xl">🖼️</div>
            <div v-if="!product.is_in_stock" class="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span class="text-xs font-semibold text-gray-500 border border-gray-300 px-2 py-1 rounded-full">Out of
                    Stock</span>
            </div>
        </router-link>
        <!-- Info -->
        <div class="p-3 flex flex-col flex-1 gap-1.5">
            <p v-if="product.category?.name" class="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{{
                product.category.name }}</p>
            <router-link :to="`/product/${product.slug}`">
                <h3
                    class="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#2E7D32] transition-colors">
                    {{ product.name }}</h3>
            </router-link>
            <StarRating v-if="product.total_reviews > 0" :rating="product.average_rating" size="xs" />
            <div class="flex items-center gap-2 mt-auto pt-1">
                <span class="text-base font-bold text-[#2E7D32]">{{ settings.formatPrice(product.current_price)
                    }}</span>
                <span v-if="product.is_on_sale" class="text-xs text-gray-400 line-through">{{
                    settings.formatPrice(product.price) }}</span>
            </div>
            <button v-if="product.type !== 'affiliate'" @click="handleAddToCart"
                :disabled="!product.is_in_stock || isAdding"
                class="w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 mt-1"
                :class="product.is_in_stock ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white active:scale-[0.97]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'">
                <span v-if="isAdding">Adding...</span>
                <span v-else-if="product.type === 'variable'">View Options</span>
                <span v-else-if="product.is_in_stock">Add to Cart</span>
                <span v-else>Out of Stock</span>
            </button>
            <a v-else :href="product.affiliate_link" target="_blank" rel="noopener" @click="trackClick"
                class="w-full py-2 rounded-lg text-sm font-semibold text-center bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all block mt-1">
                Buy on {{ product.source_platform || 'External' }}
            </a>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useSettingsStore } from '@/stores/settings'
import { affiliateApi } from '@/api'
import { useRouter } from 'vue-router'
import StarRating from './StarRating.vue'
const props = defineProps({ product: { type: Object, required: true } })
const auth = useAuthStore(), cart = useCartStore(), wishlist = useWishlistStore(), settings = useSettingsStore(), router = useRouter()
const imageUrl = computed(() => props.product.primary_image?.url || props.product.thumbnail_url || props.product.images?.[0]?.url || null)
const isWishlisted = computed(() => wishlist.isWishlisted(props.product.id))
const isAdding = computed(() => cart.addingId === props.product.id)
async function handleAddToCart() {
    if (props.product.type === 'variable') { router.push(`/product/${props.product.slug}`); return }
    await cart.addItem(props.product.id, null, 1)
}
async function toggleWishlist() { await wishlist.toggle(props.product.id) }
async function trackClick() { try { await affiliateApi.click(props.product.slug) } catch { } }
</script>