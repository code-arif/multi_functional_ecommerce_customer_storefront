<template>
    <RouterLink :to="`/category/${category.slug}`" class="flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 border-gray-100
           hover:border-primary-300 hover:bg-brand-pale transition-all duration-200 group text-center">
        <div class="w-14 h-14 rounded-2xl bg-brand-pale flex items-center justify-center overflow-hidden
                group-hover:scale-110 transition-transform duration-300">
            <img v-if="category.image_url" :src="category.image_url" :alt="category.name"
                class="w-full h-full object-cover rounded-2xl" />
            <TagIcon v-else class="w-7 h-7 text-primary-500" />
        </div>
        <span
            class="text-xs font-semibold text-gray-700 group-hover:text-primary-700 transition-colors leading-tight line-clamp-2">
            {{ category.name }}
        </span>
        <span v-if="category.products_count" class="text-[10px] text-gray-400">
            {{ category.products_count }} items
        </span>
    </RouterLink>
</template>

<script setup>
import { TagIcon } from '@heroicons/vue/24/outline'
defineProps({ category: { type: Object, required: true } })
</script>