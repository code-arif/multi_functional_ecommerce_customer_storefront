<template>
    <button @click="handle" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm
           border-2 transition-all duration-200 active:scale-[0.97]" :class="isWishlisted
            ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-700 hover:bg-brand-pale'">
        <HeartIcon v-if="!isWishlisted" class="w-5 h-5" />
        <HeartSolidIcon v-else class="w-5 h-5" />
        {{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}
    </button>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    isWishlisted: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])

function handle() { emit('click') }
</script>