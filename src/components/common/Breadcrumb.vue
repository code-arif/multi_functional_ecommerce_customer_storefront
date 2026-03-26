<template>
    <nav class="flex items-center gap-1.5 text-sm text-gray-400 py-3">
        <template v-for="(crumb, i) in crumbs" :key="i">
            <RouterLink v-if="crumb.to" :to="crumb.to"
                class="hover:text-primary-700 transition-colors truncate max-w-[140px]">
                {{ crumb.label }}
            </RouterLink>
            <span v-else class="text-gray-700 font-medium truncate max-w-[200px]">{{ crumb.label }}</span>
            <ChevronRightIcon v-if="i < crumbs.length - 1" class="w-3.5 h-3.5 shrink-0 text-gray-300" />
        </template>
    </nav>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
defineProps({
    crumbs: { type: Array, default: () => [] }
    // Each crumb: { label: string, to?: string }
})
</script>