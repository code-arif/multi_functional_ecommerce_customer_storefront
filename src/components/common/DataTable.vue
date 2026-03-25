<template>
    <div class="card overflow-hidden">
        <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
            <div class="flex items-center gap-3 flex-1 flex-wrap">
                <div v-if="searchable" class="relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input v-model="searchQuery" @input="$emit('search', searchQuery)"
                        :placeholder="searchPlaceholder || 'Search...'" class="input pl-9 py-2 w-52 text-sm" />
                </div>
                <slot name="filters" />
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <slot name="actions" />
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50/80">
                    <tr>
                        <th v-for="col in columns" :key="col.key" class="table-header" :class="col.class">{{ col.label
                            }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td :colspan="columns.length" class="text-center py-16">
                            <div class="flex flex-col items-center gap-3 text-gray-400">
                                <svg class="w-7 h-7 animate-spin text-[#2E7D32]" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span class="text-sm">Loading...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="!items.length">
                        <td :colspan="columns.length" class="text-center py-16">
                            <div class="flex flex-col items-center gap-2 text-gray-400">
                                <span class="text-3xl">{{ emptyIcon || '📋' }}</span>
                                <p class="text-sm font-medium">{{ emptyText || 'No records found' }}</p>
                            </div>
                        </td>
                    </tr>
                    <tr v-else v-for="item in items" :key="item.id" class="table-row">
                        <slot :item="item" />
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="pagination && pagination.last_page > 1"
            class="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p class="text-xs text-gray-500">Showing {{ pagination.from }}–{{ pagination.to }} of {{ pagination.total }}
            </p>
            <div class="flex items-center gap-1">
                <button @click="$emit('page', pagination.current_page - 1)" :disabled="pagination.current_page === 1"
                    class="p-1.5 rounded text-gray-500 hover:bg-white disabled:opacity-30 transition">
                    <ChevronLeftIcon class="w-4 h-4" />
                </button>
                <span class="text-xs text-gray-600 px-2 font-medium">{{ pagination.current_page }} / {{
                    pagination.last_page }}</span>
                <button @click="$emit('page', pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.last_page"
                    class="p-1.5 rounded text-gray-500 hover:bg-white disabled:opacity-30 transition">
                    <ChevronRightIcon class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
const props = defineProps({ items: { type: Array, default: () => [] }, columns: { type: Array, required: true }, loading: Boolean, pagination: Object, searchable: Boolean, searchPlaceholder: String, emptyText: String, emptyIcon: String })
defineEmits(['search', 'page', 'sort'])
const searchQuery = ref('')
</script>