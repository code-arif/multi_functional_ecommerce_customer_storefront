<template>
    <div class="relative" ref="containerRef">
        <div class="relative">
            <MagnifyingGlassIcon
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input ref="inputRef" v-model="query" @input="onInput" @keyup.enter="onEnter" @keydown.escape="close"
                @focus="onFocus" type="text" placeholder="Search products..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder-gray-400
               focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" autocomplete="off" />
            <button v-if="query" @click="clear"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XMarkIcon class="w-3.5 h-3.5" />
            </button>
        </div>

        <!-- Suggestions dropdown -->
        <Transition name="slide-down">
            <div v-if="showDrop && suggestions.length"
                class="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                <RouterLink v-for="s in suggestions" :key="s.id" :to="`/product/${s.slug}`" @click="onSelect(s)"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-brand-pale transition-colors">
                    <img v-if="s.image" :src="s.image" :alt="s.name"
                        class="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div v-else class="w-9 h-9 rounded-lg bg-brand-pale shrink-0" />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">{{ s.name }}</p>
                        <p class="text-xs text-primary-700 font-semibold">{{ formatPrice(s.price) }}</p>
                    </div>
                </RouterLink>
                <div class="border-t border-gray-100">
                    <button @click="onEnter"
                        class="w-full px-4 py-2.5 text-xs text-center text-primary-700 font-semibold hover:bg-brand-pale transition-colors">
                        See all results for "{{ query }}" →
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { searchService } from '@/services/searchService'
import { debounce } from '@/utils/helpers'
import { useUiStore } from '@/stores/uiStore'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ autofocus: Boolean })
const emit = defineEmits(['select'])

const router = useRouter()
const ui = useUiStore()

const query = ref('')
const suggestions = ref([])
const showDrop = ref(false)
const containerRef = ref(null)
const inputRef = ref(null)

function formatPrice(p) { return ui.formatPrice(p) }

const fetchSuggestions = debounce(async (q) => {
    if (!q || q.length < 2) { suggestions.value = []; return }
    try {
        const res = await searchService.suggestions(q)
        suggestions.value = res.data.data || []
    } catch { suggestions.value = [] }
}, 280)

function onInput() {
    fetchSuggestions(query.value)
    showDrop.value = true
}

function onFocus() { if (suggestions.value.length) showDrop.value = true }

function onEnter() {
    if (!query.value.trim()) return
    close()
    router.push({ name: 'search', query: { q: query.value.trim() } })
}

function onSelect(s) {
    close()
    emit('select', s.slug)
}

function clear() {
    query.value = ''
    suggestions.value = []
    showDrop.value = false
    nextTick(() => inputRef.value?.focus())
}

function close() {
    showDrop.value = false
}

onClickOutside(containerRef, close)

watch(() => props.autofocus, (v) => {
    if (v) nextTick(() => inputRef.value?.focus())
}, { immediate: true })
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity .15s ease, transform .15s ease;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}

.slide-down-leave-to {
    opacity: 0;
}
</style>