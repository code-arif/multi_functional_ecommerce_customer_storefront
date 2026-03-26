<template>
    <button @click="handle" :disabled="disabled || loading"
        class="flex items-center justify-center gap-2 w-full font-semibold rounded-xl transition-all duration-200 active:scale-[0.97]"
        :class="[sizeClass, disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary-lg']">
        <span v-if="loading" class="flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Adding...
        </span>
        <span v-else>
            <ShoppingCartIcon class="w-5 h-5 inline -mt-0.5 mr-1" />
            {{ label }}
        </span>
    </button>
</template>

<script setup>
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    label: { type: String, default: 'Add to Cart' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: 'md' }
})
const emit = defineEmits(['click'])

const sizeClass = props.size === 'lg' ? 'py-4 text-base' : 'py-3 text-sm'

function handle() { if (!props.disabled && !props.loading) emit('click') }
</script>