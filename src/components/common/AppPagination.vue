<template>
    <nav v-if="pagination && pagination.last_page > 1" class="flex items-center justify-center gap-1.5 mt-8">
        <button @click="emit('change', pagination.current_page - 1)" :disabled="pagination.current_page === 1"
            class="px-3.5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600
             hover:border-primary-500 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            ← Prev
        </button>

        <template v-for="page in visiblePages" :key="page">
            <span v-if="page === '...'" class="px-2 py-2 text-gray-400 text-sm select-none">•••</span>
            <button v-else @click="emit('change', page)"
                class="w-10 h-10 rounded-xl text-sm font-medium transition-all duration-150" :class="page === pagination.current_page
                    ? 'bg-primary-700 text-white shadow-green'
                    : 'border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-700'">
                {{ page }}
            </button>
        </template>

        <button @click="emit('change', pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3.5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600
             hover:border-primary-500 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Next →
        </button>
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