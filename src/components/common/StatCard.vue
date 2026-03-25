<template>
    <div class="stat-card">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="iconBg">
            <component :is="icon" class="w-6 h-6" :class="iconColor" />
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">{{ label }}</p>
            <p class="text-2xl font-black text-gray-900 mt-0.5">{{ prefix }}{{ Number(value || 0).toLocaleString() }}{{
                suffix }}</p>
            <p v-if="change !== undefined" class="text-xs mt-0.5" :class="change >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(change) }}% vs last month
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({ label: String, value: [Number, String], icon: Object, iconBg: String, iconColor: String, prefix: String, suffix: String, change: Number })
</script>