<template>
    <aside class="w-full">
        <div class="card p-5 sticky top-24">
            <div class="flex items-center justify-between mb-5">
                <h3 class="font-bold text-gray-900 text-base">Filters</h3>
                <button @click="$emit('clear')" class="text-xs text-primary-700 font-semibold hover:underline">Clear
                    All</button>
            </div>

            <!-- Category -->
            <div class="mb-5 pb-5 border-b border-gray-100">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    <label class="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="filter-cat" value="" v-model="localFilters.category" @change="emit"
                            class="accent-primary-700" />
                        <span class="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">All
                            Categories</span>
                    </label>
                    <label v-for="cat in categories" :key="cat.id"
                        class="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="filter-cat" :value="cat.slug" v-model="localFilters.category"
                            @change="emit" class="accent-primary-700" />
                        <span class="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{{ cat.name
                            }}</span>
                    </label>
                </div>
            </div>

            <!-- Price range -->
            <div class="mb-5 pb-5 border-b border-gray-100">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                <div class="flex items-center gap-2">
                    <input v-model.number="localFilters.min_price" @change="emit" type="number" min="0"
                        placeholder="Min" class="form-input py-2 text-sm" />
                    <span class="text-gray-400 text-sm shrink-0">—</span>
                    <input v-model.number="localFilters.max_price" @change="emit" type="number" min="0"
                        placeholder="Max" class="form-input py-2 text-sm" />
                </div>
            </div>

            <!-- Rating -->
            <div class="mb-5 pb-5 border-b border-gray-100">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Min. Rating</p>
                <div class="space-y-2">
                    <label v-for="r in [4, 3, 2, 1]" :key="r" class="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="filter-rating" :value="r" v-model.number="localFilters.rating"
                            @change="emit" class="accent-primary-700" />
                        <span
                            class="flex items-center gap-1 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">
                            <span v-for="i in 5" :key="i" class="text-sm"
                                :class="i <= r ? 'text-yellow-400' : 'text-gray-200'">★</span>
                            <span class="ml-1 text-xs text-gray-500">& up</span>
                        </span>
                    </label>
                </div>
            </div>

            <!-- In stock -->
            <div>
                <label class="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" v-model="localFilters.in_stock" @change="emit"
                        class="accent-primary-700 w-4 h-4 rounded" />
                    <span class="text-sm text-gray-700 font-medium">In Stock Only</span>
                </label>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
    filters: { type: Object, default: () => ({}) },
    categories: { type: Array, default: () => [] }
})
const emit = defineEmits(['update', 'clear'])

const localFilters = reactive({
    category: props.filters.category || '',
    min_price: props.filters.min_price || '',
    max_price: props.filters.max_price || '',
    rating: props.filters.rating || '',
    in_stock: props.filters.in_stock || false
})

watch(() => props.filters, (v) => Object.assign(localFilters, v), { deep: true })

function emit() {
    emit('update', { ...localFilters })
}
</script>