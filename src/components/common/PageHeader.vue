<template>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 class="page-title">{{ title }}</h1>
            <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
            <slot />
        </div>
    </div>
</template>
<script setup>
defineProps({ title: String, subtitle: String })
</script>