<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')" />
            <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-in"
                style="box-shadow:0 20px 60px rgba(0,0,0,0.15)">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="iconBg">
                        <ExclamationTriangleIcon class="w-5 h-5" :class="iconColor" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">{{ title }}</h3>
                        <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ message }}</p>
                    </div>
                </div>
                <div class="flex gap-3 mt-6 justify-end">
                    <button @click="$emit('cancel')" class="btn-ghost">Cancel</button>
                    <button @click="$emit('confirm')" :disabled="loading" class="btn-danger">{{
                        loading ?'Processing...':confirmText }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
const props = defineProps({ show: Boolean, loading: Boolean, title: { type: String, default: 'Confirm' }, message: { type: String, default: 'Are you sure?' }, confirmText: { type: String, default: 'Confirm' }, type: { type: String, default: 'danger' } })
defineEmits(['confirm', 'cancel'])
const iconBg = computed(() => ({ danger: 'bg-red-100', warning: 'bg-yellow-100' }[props.type] || 'bg-red-100'))
const iconColor = computed(() => ({ danger: 'text-red-600', warning: 'text-yellow-600' }[props.type] || 'text-red-600'))
</script>