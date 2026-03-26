<template>
    <footer class="bg-gray-900 text-white mt-16">
        <!-- Main footer grid -->
        <div class="app-container py-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                <!-- Brand -->
                <div>
                    <RouterLink to="/" class="flex items-center gap-2 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span class="text-white font-black text-sm">E</span>
                        </div>
                        <span class="font-display font-700 text-lg">Eco<span class="text-primary-400">Shop</span></span>
                    </RouterLink>
                    <p class="text-gray-400 text-sm leading-relaxed mb-5">
                        Your trusted online marketplace for quality products. Fast delivery across Bangladesh.
                    </p>
                    <!-- Social links -->
                    <div class="flex gap-3">
                        <a v-if="ui.socialLinks.facebook" :href="ui.socialLinks.facebook" target="_blank" rel="noopener"
                            class="social-link">f</a>
                        <a v-if="ui.socialLinks.instagram" :href="ui.socialLinks.instagram" target="_blank"
                            rel="noopener" class="social-link">in</a>
                        <a v-if="ui.socialLinks.twitter" :href="ui.socialLinks.twitter" target="_blank" rel="noopener"
                            class="social-link">tw</a>
                        <a v-if="ui.socialLinks.youtube" :href="ui.socialLinks.youtube" target="_blank" rel="noopener"
                            class="social-link">yt</a>
                    </div>
                </div>

                <!-- Quick links -->
                <div>
                    <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                    <ul class="space-y-2">
                        <li v-for="link in quickLinks" :key="link.to">
                            <RouterLink :to="link.to"
                                class="text-gray-400 text-sm hover:text-primary-400 transition-colors">
                                {{ link.label }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Customer service -->
                <div>
                    <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
                    <ul class="space-y-2">
                        <li v-for="page in cmsPages" :key="page.slug">
                            <RouterLink :to="`/page/${page.slug}`"
                                class="text-gray-400 text-sm hover:text-primary-400 transition-colors">
                                {{ page.title }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/track-order"
                                class="text-gray-400 text-sm hover:text-primary-400 transition-colors">
                                Track My Order
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
                    <ul class="space-y-3">
                        <li v-if="ui.storePhone" class="flex items-center gap-3 text-sm text-gray-400">
                            <PhoneIcon class="w-4 h-4 text-primary-400 shrink-0" />
                            {{ ui.storePhone }}
                        </li>
                        <li v-if="ui.storeEmail" class="flex items-center gap-3 text-sm text-gray-400">
                            <EnvelopeIcon class="w-4 h-4 text-primary-400 shrink-0" />
                            <a :href="`mailto:${ui.storeEmail}`" class="hover:text-primary-400 transition-colors">{{
                                ui.storeEmail }}</a>
                        </li>
                    </ul>
                    <!-- Payment icons -->
                    <div class="mt-6">
                        <p class="text-xs text-gray-500 mb-2 uppercase tracking-wider">We Accept</p>
                        <div class="flex gap-2 flex-wrap">
                            <span v-for="m in ['bKash', 'Nagad', 'COD']" :key="m"
                                class="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-lg">{{ m
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-gray-800">
            <div
                class="app-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                <p>© {{ year }} {{ ui.storeName }}. All rights reserved.</p>
                <p>Made with ❤️ in Bangladesh</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { cmsService } from '@/services/cmsService'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

const ui = useUiStore()
const year = computed(() => new Date().getFullYear())
const cmsPages = ref([])

const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/search', label: 'Deals & Offers' },
    { to: '/cart', label: 'My Cart' },
    { to: '/account/orders', label: 'My Orders' }
]

onMounted(async () => {
    try {
        const res = await cmsService.pages()
        cmsPages.value = (res.data.data || []).slice(0, 4)
    } catch { }
})
</script>

<style scoped>
.social-link {
    @apply w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold uppercase hover:bg-primary-700 hover:text-white transition-all duration-200;
}
</style>