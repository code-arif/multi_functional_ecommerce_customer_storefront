<template>
    <DefaultLayout>
        <div class="container-app py-20 text-center">
            <p class="text-8xl font-black text-gray-200 mb-4">404</p>
            <h1 class="text-3xl font-black text-gray-800 mb-3">Page Not Found</h1>
            <p class="text-gray-500 mb-10">The page you're looking for doesn't exist.</p>
            <router-link to="/" class="btn-primary px-8 py-4 text-base">Go Home</router-link>
        </div>
    </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>