<template>
    <div class="flex flex-col gap-3">
        <!-- Main image -->
        <div class="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 cursor-zoom-in"
            style="aspect-ratio:1/1" @mousemove="onMouseMove" @mouseleave="zooming = false"
            @mouseenter="zooming = true">
            <img v-if="activeImage" :src="activeImage" :alt="alt"
                class="w-full h-full object-contain p-4 transition-transform duration-300"
                :style="zooming ? `transform: scale(1.6); transform-origin: ${zoomX}% ${zoomY}%` : ''"
                loading="eager" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <PhotoIcon class="w-20 h-20 text-gray-200" />
            </div>

            <!-- Badge on main image -->
            <div v-if="discount > 0" class="absolute top-3 left-3">
                <span class="badge bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">-{{ discount }}%
                    OFF</span>
            </div>

            <!-- Arrow nav (if multiple images) -->
            <template v-if="images.length > 1">
                <button @click="prev" class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md
                 flex items-center justify-center text-gray-600 hover:text-primary-700 transition-colors">
                    <ChevronLeftIcon class="w-4 h-4" />
                </button>
                <button @click="next" class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md
                 flex items-center justify-center text-gray-600 hover:text-primary-700 transition-colors">
                    <ChevronRightIcon class="w-4 h-4" />
                </button>
            </template>
        </div>

        <!-- Thumbnails -->
        <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button v-for="(img, i) in images" :key="i" @click="activeIndex = i"
                class="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150"
                :class="activeIndex === i ? 'border-primary-600' : 'border-gray-200 hover:border-gray-400'">
                <img :src="img.url" :alt="`Image ${i + 1}`" class="w-full h-full object-cover" loading="lazy" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    images: { type: Array, default: () => [] },
    thumbnail: { type: String, default: '' },
    alt: { type: String, default: 'Product image' },
    discount: { type: Number, default: 0 }
})

const activeIndex = ref(0)
const zooming = ref(false)
const zoomX = ref(50)
const zoomY = ref(50)

const activeImage = computed(() => {
    if (props.images.length) return props.images[activeIndex.value]?.url
    return props.thumbnail || null
})

function prev() { activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length }
function next() { activeIndex.value = (activeIndex.value + 1) % props.images.length }

function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    zoomX.value = ((e.clientX - rect.left) / rect.width) * 100
    zoomY.value = ((e.clientY - rect.top) / rect.height) * 100
}
</script>