<template>
    <DefaultLayout>
        <!-- Hero -->
        <section class="relative overflow-hidden bg-gradient-to-br from-[#E8F5E9] via-white to-white">
            <div v-if="sliders.length" class="relative">
                <div class="overflow-hidden">
                    <div class="flex transition-transform duration-700 ease-in-out"
                        :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
                        <div v-for="slide in sliders" :key="slide.id" class="min-w-full">
                            <div class="container-app py-14 md:py-24 flex flex-col md:flex-row items-center gap-10">
                                <div class="flex-1 animate-fade-in-up">
                                    <h1 class="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">{{
                                        slide.title }}</h1>
                                    <p v-if="slide.subtitle" class="text-gray-500 text-lg mb-8">{{ slide.subtitle }}</p>
                                    <a v-if="slide.link" :href="slide.link" class="btn-primary text-base px-8 py-3.5">
                                        {{ slide.button_text || 'Shop Now' }} →
                                    </a>
                                </div>
                                <div class="flex-1 flex justify-center">
                                    <img :src="slide.image_url" :alt="slide.title"
                                        class="max-h-80 object-contain drop-shadow-2xl rounded-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <button v-for="(_, i) in sliders" :key="i" @click="activeSlide = i"
                        class="rounded-full transition-all"
                        :class="i === activeSlide ? 'w-6 h-2.5 bg-[#2E7D32]' : 'w-2.5 h-2.5 bg-gray-300'" />
                </div>
            </div>
            <div v-else class="container-app py-20 text-center">
                <div class="animate-fade-in-up max-w-2xl mx-auto">
                    <span
                        class="inline-flex items-center gap-2 bg-green-pale text-[#2E7D32] text-sm font-bold px-4 py-2 rounded-full mb-6">✨
                        New Arrivals Every Week</span>
                    <h1 class="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                        Shop the Best<br><span class="text-[#2E7D32]">Products Online</span>
                    </h1>
                    <p class="text-gray-500 text-lg mb-10">Fast delivery across Bangladesh. Trusted by thousands.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link to="/shop" class="btn-primary text-base px-8 py-4">Shop Now →</router-link>
                        <router-link to="/affiliate" class="btn-secondary text-base px-8 py-4">View Deals</router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features bar -->
        <div class="border-y border-gray-100 bg-white">
            <div class="container-app">
                <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                    <div v-for="f in featureBar" :key="f.label" class="flex items-center gap-3 px-6 py-4">
                        <div class="w-9 h-9 rounded-lg bg-green-pale flex items-center justify-center shrink-0">
                            <component :is="f.icon" class="w-5 h-5 text-[#2E7D32]" />
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
        <section class="container-app py-12">
            <div class="flex items-center justify-between mb-6">
                <h2 class="section-title">Shop by Category</h2>
                <router-link to="/shop" class="text-[#2E7D32] text-sm font-semibold hover:underline">View All
                    →</router-link>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <template v-if="categoriesLoading">
                    <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-2xl" />
                </template>
                <router-link v-else v-for="cat in categories" :key="cat.id" :to="`/category/${cat.slug}`"
                    class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-[#4CAF50] hover:bg-green-pale transition-all group">
                    <div
                        class="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                        <img v-if="cat.image_url" :src="cat.image_url" :alt="cat.name"
                            class="w-full h-full object-cover rounded-xl" />
                        <span v-else class="text-2xl">🏷️</span>
                    </div>
                    <span
                        class="text-xs font-semibold text-gray-700 text-center line-clamp-2 group-hover:text-[#2E7D32] transition-colors">{{
                        cat.name }}</span>
                </router-link>
            </div>
        </section>

        <!-- Featured Products -->
        <section class="container-app py-10">
            <div class="flex items-center justify-between mb-6">
                <h2 class="section-title">Featured Products</h2>
                <router-link to="/shop?featured=1" class="text-[#2E7D32] text-sm font-semibold hover:underline">See All
                    →</router-link>
            </div>
            <ProductGrid :products="featuredProducts" :loading="featuredLoading" />
        </section>

        <!-- Promo Banner -->
        <section v-if="midBanners.length" class="container-app py-4">
            <a :href="midBanners[0].link || '#'" class="relative block overflow-hidden rounded-2xl group">
                <img :src="midBanners[0].image_url" :alt="midBanners[0].title"
                    class="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div
                    class="absolute inset-0 bg-gradient-to-r from-[#2E7D32]/70 to-transparent flex items-center px-8 md:px-16">
                    <div>
                        <h2 class="text-white text-2xl md:text-4xl font-black mb-2">{{ midBanners[0].title }}</h2>
                        <span class="inline-block bg-white text-[#2E7D32] font-bold px-5 py-2 rounded-xl text-sm">{{
                            midBanners[0].button_text || 'Shop Now' }} →</span>
                    </div>
                </div>
            </a>
        </section>

        <!-- New Arrivals -->
        <section class="container-app py-10">
            <div class="flex items-center justify-between mb-6">
                <h2 class="section-title">New Arrivals</h2>
                <router-link to="/shop?new=1" class="text-[#2E7D32] text-sm font-semibold hover:underline">See All
                    →</router-link>
            </div>
            <ProductGrid :products="newProducts" :loading="newLoading" />
        </section>

        <!-- Bestsellers -->
        <section class="bg-[#F9FAFB] py-10">
            <div class="container-app">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="section-title">🔥 Bestsellers</h2>
                    <router-link to="/shop?sort=popularity"
                        class="text-[#2E7D32] text-sm font-semibold hover:underline">See All
                        →</router-link>
                </div>
                <ProductGrid :products="bestsellers" :loading="bestLoading" />
            </div>
        </section>
    </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import { productApi, cmsApi, categoryApi } from '@/api'
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

const sliders = ref([]), topBanners = ref([]), midBanners = ref([])
const activeSlide = ref(0)
let sliderTimer = null

const categories = ref([]), categoriesLoading = ref(true)
const featuredProducts = ref([]), featuredLoading = ref(true)
const newProducts = ref([]), newLoading = ref(true)
const bestsellers = ref([]), bestLoading = ref(true)

const featureBar = [
    { icon: TruckIcon, label: 'Free Shipping', sub: 'On orders over ৳1000' },
    { icon: ShieldCheckIcon, label: 'Secure Payment', sub: '100% safe checkout' },
    { icon: CreditCardIcon, label: 'Easy Returns', sub: '7-day return policy' },
    { icon: ChatBubbleLeftRightIcon, label: '24/7 Support', sub: 'We\'re always here' },
]

function nextSlide() { activeSlide.value = (activeSlide.value + 1) % Math.max(sliders.value.length, 1) }

onMounted(async () => {
    const [homeRes, catRes, featRes, newRes, bestRes] = await Promise.allSettled([
        cmsApi.homepage(), categoryApi.tree(),
        productApi.featured(8), productApi.newArrivals(8), productApi.bestsellers(8),
    ])
    if (homeRes.status === 'fulfilled') {
        const d = homeRes.value.data.data
        sliders.value = d.sliders || []
        midBanners.value = d.mid_banners || []
        if (sliders.value.length > 1) sliderTimer = setInterval(nextSlide, 5000)
    }
    if (catRes.status === 'fulfilled') { categories.value = catRes.value.data.data?.slice(0, 12) || []; categoriesLoading.value = false }
    if (featRes.status === 'fulfilled') { featuredProducts.value = featRes.value.data.data || []; featuredLoading.value = false }
    if (newRes.status === 'fulfilled') { newProducts.value = newRes.value.data.data || []; newLoading.value = false }
    if (bestRes.status === 'fulfilled') { bestsellers.value = bestRes.value.data.data || []; bestLoading.value = false }
})
onUnmounted(() => { if (sliderTimer) clearInterval(sliderTimer) })
</script>