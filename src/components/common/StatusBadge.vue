<template>
    <span class="badge" :class="cls">{{ label || value }}</span>
</template>
<script setup>

import { computed } from 'vue'
const p = defineProps({ value: String, label: String })
const cls = computed(() => ({
    pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue',
    shipped: 'badge-purple', delivered: 'badge-green', cancelled: 'badge-red', refunded: 'badge-gray',
    active: 'badge-green', inactive: 'badge-gray', banned: 'badge-red', draft: 'badge-yellow',
    approved: 'badge-green', rejected: 'badge-red', paid: 'badge-green', failed: 'badge-red',
    cod: 'badge-gray', bkash: 'badge-purple', nagad: 'badge-blue',
    simple: 'badge-blue', variable: 'badge-purple', affiliate: 'badge-yellow',
}[p.value] || 'badge-gray'))
</script>