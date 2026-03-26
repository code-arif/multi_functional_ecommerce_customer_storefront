<template>
    <DefaultLayout>
        <!-- Hero Slider -->
        <section class="relative bg-gradient-to-br from-brand-pale via-white to-white overflow-hidden">
            <div v-if="sliders.length" class="relative">
                <div class="overflow-hidden">
                    <div class="flex transition-transform duration-700 ease-in-out"
                        :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
                        <div v-for="slide in sliders" :key="slide.id" class="min-w-full">
                            <div class="app-container py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
                                <div class="flex-1 animate-fade-up">
                                    <div
                                        class="inline-flex items-center gap-2 bg-brand-pale text-primary-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                                        ✦ Best Online Store
                                    </div>
                                    <h1
                                        class="font-display text-4xl md:text-6xl font-800 text-gray-900 leading-tight tracking-tight mb-5">
                                        {{ slide.title }}
                                    </h1>
                                    <p v-if="slide.subtitle"
                                        class="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">{{ slide.subtitle }}
                                    </p>
                                    <div class="flex flex-wrap gap-3">
                                        <a v-if="slide.link" :href="slide.link" class="btn-primary-lg">{{
                                            slide.button_text || 'Shop Now' }} →</a>
                                        <RouterLink to="/search" class="btn-outline text-base px-7 py-3.5">View Deals
                                        </RouterLink>
                                    </div>
                                </div>
                                <div class="flex-1 flex justify-center">
                                    <img :src="slide.image_url" :alt="slide.title"
                                        class="max-h-80 object-contain drop-shadow-2xl rounded-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Dots -->
                <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    <button v-for="(_, i) in sliders" :key="i" @click="activeSlide = i"
                        class="rounded-full transition-all duration-300"
                        :class="i === activeSlide ? 'w-6 h-2.5 bg-primary-700' : 'w-2.5 h-2.5 bg-gray-300'" />
                </div>
                <button @click="prevSlide"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary-700 transition-colors">
                    <ChevronLeftIcon class="w-5 h-5" />
                </button>
                <button @click="nextSlide"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary-700 transition-colors">
                    <ChevronRightIcon class="w-5 h-5" />
                </button>
            </div>

            <!-- Default hero (no sliders) -->
            <div v-else class="app-container py-16 md:py-24 text-center">
                <div class="max-w-2xl mx-auto animate-fade-up">
                    <div
                        class="inline-flex items-center gap-2 bg-brand-pale text-primary-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                        ✦ New Arrivals Every Week</div>
                    <h1
                        class="font-display text-5xl md:text-7xl font-800 text-gray-900 leading-none tracking-tight mb-6">
                        Shop the Best<br><span class="text-primary-700">Products Online</span>
                    </h1>
                    <p class="text-gray-500 text-xl mb-10 leading-relaxed">Fast delivery across Bangladesh. Trusted by
                        thousands of happy customers.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <RouterLink to="/shop" class="btn-primary-lg">Shop Now →</RouterLink>
                        <RouterLink to="/search" class="btn-outline text-base px-7 py-3.5">View Deals</RouterLink>
                    </div>
                    <div class="flex justify-center gap-8 mt-12">
                        <div v-for="s in stats" :key="s.label" class="text-center">
                            <p class="font-display font-800 text-2xl text-primary-700">{{ s.value }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ s.label }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature bar -->
        <div class="border-y border-gray-100 bg-white">
            <div class="app-container">
                <div class="grid grid-cols-2 lg:grid-cols-4">
                    <div v-for="(f, i) in features" :key="f.label" class="flex items-center gap-3 px-5 py-4"
                        :class="i < 3 ? 'border-r border-gray-100' : ''">
                        <div class="w-9 h-9 rounded-xl bg-brand-pale flex items-center justify-center shrink-0">
                            <component :is="f.icon" class="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-800">{{ f.label }}</p>
                            <p class="text-[11px] text-gray-400">{{ f.sub }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <section class="app-container py-12">
            <div class="flex items-center justify-between mb-7">
                <div>
                    <h2 class="section-title">Shop by Category</h2>
                    <p class="text-gray-500 text-sm mt-1">Browse our curated collection</p>
                </div>
                <RouterLink to="/shop" class="text-sm font-semibold text-primary-700 hover:underline hidden sm:block">
                    View All →</RouterLink>
            </div>
            <div v-if="catsLoading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                <div v-for="i in 6" :key="i" class="skeleton h-28 rounded-2xl" />
            </div>
            <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                <CategoryCard v-for="cat in categories.slice(0, 12)" :key="cat.id" :category="cat" />
            </div>
        </section>

        <!-- Featured Products -->
        <section class="app-container py-10">
            <div class="flex items-center justify-between mb-7">
                <div>
                    <h2 class="section-title">Featured Products</h2>
                    <p class="text-gray-500 text-sm mt-1">Hand-picked just for you</p>
                </div>
                <RouterLink to="/shop?featured=1"
                    class="text-sm font-semibold text-primary-700 hover:underline hidden sm:block">See All →
                </RouterLink>
            </div>
            <ProductGrid :products="productStore.featured" :loading="productStore.loading" />
        </section>

        <!-- Promo banner -->
        <section v-if="midBanners.length" class="app-container py-4">
            <a :href="midBanners[0].link || '/shop'"
                class="relative block overflow-hidden rounded-2xl group cursor-pointer">
                <img :src="midBanners[0].image_url" :alt="midBanners[0].title"
                    class="w-full h-48 md:h-72 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div
                    class="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-transparent flex items-center px-8 md:px-16">
                    <div>
                        <h2 class="font-display text-white text-2xl md:text-4xl font-800 mb-3">{{ midBanners[0].title }}
                        </h2>
                        <p v-if="midBanners[0].subtitle" class="text-white/80 mb-6 text-base">{{ midBanners[0].subtitle
                            }}</p>
                        <span
                            class="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-pale transition-colors">
                            {{ midBanners[0].button_text || 'Shop Now' }} →
                        </span>
                    </div>
                </div>
            </a>
        </section>

        <!-- New Arrivals -->
        <section class="app-container py-10">
            <div class="flex items-center justify-between mb-7">
                <div>
                    <h2 class="section-title">New Arrivals</h2>
                    <p class="text-gray-500 text-sm mt-1">Fresh products just landed</p>
                </div>
                <RouterLink to="/shop?new=1"
                    class="text-sm font-semibold text-primary-700 hover:underline hidden sm:block">See All →
                </RouterLink>
            </div>
            <ProductGrid :products="productStore.newArrivals" :loading="productStore.loading" />
        </section>

        <!-- Bestsellers -->
        <section class="bg-gray-50 py-10">
            <div class="app-container">
                <div class="flex items-center justify-between mb-7">
                    <div>
                        <h2 class="section-title">🔥 Bestsellers</h2>
                        <p class="text-gray-500 text-sm mt-1">Loved by thousands of customers</p>
                    </div>
                    <RouterLink to="/shop?sort=popularity"
                        class="text-sm font-semibold text-primary-700 hover:underline hidden sm:block">See All →
                    </RouterLink>
                </div>
                <ProductGrid :products="productStore.bestsellers" :loading="productStore.loading" />
            </div>
        </section>

        <!-- Why choose us -->
        <section class="app-container py-14">
            <h2 class="section-title text-center mb-10">Why Shop With Us?</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div v-for="item in whyUs" :key="item.title"
                    class="card p-6 text-center hover:shadow-green transition-shadow duration-300">
                    <div class="w-12 h-12 rounded-2xl bg-brand-pale flex items-center justify-center mx-auto mb-4">
                        <component :is="item.icon" class="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ item.title }}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">{{ item.desc }}</p>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import CategoryCard from '@/components/product/CategoryCard.vue'
import { useProductStore } from '@/stores/productStore'
import { cmsService } from '@/services/cmsService'
import { categoryService } from '@/services/categoryService'
import {
    TruckIcon, ShieldCheckIcon, CreditCardIcon, ChatBubbleLeftRightIcon,
    ChevronLeftIcon, ChevronRightIcon, SparklesIcon
} from '@heroicons/vue/24/outline'

const productStore = useProductStore()
const sliders = ref([])
const midBanners = ref([])
const categories = ref([])
const catsLoading = ref(true)
const activeSlide = ref(0)
let sliderTimer = null

const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '2K+', label: 'Products' },
    { value: '4.9★', label: 'Avg Rating' }
]

const features = [
    { icon: TruckIcon, label: 'Free Shipping', sub: 'On orders over ৳1000' },
    { icon: ShieldCheckIcon, label: 'Secure Payment', sub: '100% safe checkout' },
    { icon: CreditCardIcon, label: 'Easy Returns', sub: '7-day return policy' },
    { icon: ChatBubbleLeftRightIcon, label: '24/7 Support', sub: 'Always here for you' }
]

const whyUs = [
    { icon: TruckIcon, title: 'Fast Delivery', desc: 'Delivered to your doorstep across Bangladesh within days.' },
    { icon: ShieldCheckIcon, title: 'Secure Shopping', desc: '100% secure payments & buyer protection guaranteed.' },
    { icon: CreditCardIcon, title: 'Easy Payments', desc: 'bKash, Nagad, COD & more payment options available.' },
    { icon: ChatBubbleLeftRightIcon, title: '24/7 Support', desc: 'Our support team is always ready to help you.' }
]

function nextSlide() { activeSlide.value = (activeSlide.value + 1) % Math.max(sliders.value.length, 1) }
function prevSlide() { activeSlide.value = (activeSlide.value - 1 + Math.max(sliders.value.length, 1)) % Math.max(sliders.value.length, 1) }

onMounted(async () => {
    await productStore.loadHomepageProducts()

    const [homeRes, catRes] = await Promise.allSettled([
        cmsService.homepage(),
        categoryService.tree()
    ])

    if (homeRes.status === 'fulfilled') {
        const d = homeRes.value.data.data
        sliders.value = d.sliders || []
        midBanners.value = d.mid_banners || []
        if (sliders.value.length > 1) {
            sliderTimer = setInterval(nextSlide, 5000)
        }
    }

    if (catRes.status === 'fulfilled') {
        categories.value = catRes.value.data.data || []
        catsLoading.value = false
    }
})

onUnmounted(() => { if (sliderTimer) clearInterval(sliderTimer) })
</script>