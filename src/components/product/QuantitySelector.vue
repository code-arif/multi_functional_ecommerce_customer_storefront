<template>
    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
        <button @click="decrement" :disabled="modelValue <= 1" class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50
             disabled:opacity-30 transition-colors text-lg font-medium border-none bg-transparent">−</button>
        <span class="w-12 text-center font-bold text-gray-800 text-sm select-none">{{ modelValue }}</span>
        <button @click="increment" :disabled="modelValue >= max" class="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50
             disabled:opacity-30 transition-colors text-lg font-medium border-none bg-transparent">+</button>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 100 }
})
const emit = defineEmits(['update:modelValue'])

function increment() { if (props.modelValue < props.max) emit('update:modelValue', props.modelValue + 1) }
function decrement() { if (props.modelValue > props.min) emit('update:modelValue', props.modelValue - 1) }
</script>