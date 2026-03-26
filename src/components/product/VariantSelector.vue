<template>
    <div v-if="attributes.length" class="space-y-4">
        <div v-for="attr in attributes" :key="attr.id">
            <div class="flex items-center gap-2 mb-2.5">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ attr.name }}:</span>
                <span class="text-sm font-semibold text-gray-800">{{ selected[attr.name] || '—' }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
                <button v-for="val in attr.values" :key="val.id" @click="$emit('select', attr.name, val.value)"
                    :disabled="isUnavailable(attr.name, val.value)"
                    class="transition-all duration-150 rounded-xl border-2 text-sm font-medium px-3.5 py-1.5" :class="[
                        selected[attr.name] === val.value
                            ? 'border-primary-700 bg-brand-pale text-primary-800 font-semibold'
                            : isUnavailable(attr.name, val.value)
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                                : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    ]">
                    <!-- Color swatch -->
                    <span v-if="val.color_code"
                        class="inline-block w-4 h-4 rounded-full border border-gray-200 mr-1.5 align-middle"
                        :style="`background:${val.color_code}`" />
                    {{ val.value }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    attributes: { type: Array, default: () => [] },
    variants: { type: Array, default: () => [] },
    selected: { type: Object, default: () => ({}) }
})
defineEmits(['select'])

function isUnavailable(attrName, value) {
    if (!props.variants.length) return false
    // Check if any variant with this value is in stock
    return !props.variants.some(v =>
        v.attributes?.[attrName] === value && v.stock_quantity > 0
    )
}
</script>