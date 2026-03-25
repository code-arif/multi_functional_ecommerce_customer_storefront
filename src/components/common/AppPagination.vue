<template>
    <nav v-if="pagination && pagination.last_page > 1" class="flex items-center justify-center gap-1.5 mt-8">
        <button @click="emit('change', pagination.current_page - 1)" :disabled="pagination.current_page === 1"
            class="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32] disabled:opacity-40 disabled:cursor-not-allowed transition">‹
            Prev</button>
        <template v-for="page in visiblePages" :key="page">
            <span v-if="page === '...'" class="px-3 py-2 text-gray-400 text-sm">...</span>
            <button v-else @click="emit('change', page)" class="w-9 h-9 rounded-lg text-sm font-medium transition"
                :class="page === pagination.current_page ? 'bg-[#2E7D32] text-white' : 'border border-gray-200 text-gray-700 hover:border-[#2E7D32] hover:text-[#2E7D32]'">{{
                page }}</button>
        </template>
        <button @click="emit('change', pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32] disabled:opacity-40 disabled:cursor-not-allowed transition">Next
            ›</button>
    </nav>
</template>


<script setup>
import { computed } from 'vue'
const props = defineProps({ pagination: Object })
const emit = defineEmits(['change'])
const visiblePages = computed(() => {
    if (!props.pagination) return []
    const { current_page: c, last_page: l } = props.pagination
    if (l <= 7) return Array.from({ length: l }, (_, i) => i + 1)
    if (c <= 4) return [1, 2, 3, 4, 5, '...', l]
    if (c >= l - 3) return [1, '...', l - 4, l - 3, l - 2, l - 1, l]
    return [1, '...', c - 1, c, c + 1, '...', l]
})
</script>