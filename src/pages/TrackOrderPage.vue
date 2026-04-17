<template>
  <DefaultLayout>
    <div class="container-app mx-auto px-4 py-16 flex justify-center">
      <div class="w-full max-w-md">

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          <h1 class="text-2xl font-black text-gray-900 mb-6 text-center">
            Track Your Order
          </h1>

          <!-- Form -->
          <form @submit.prevent="track" class="space-y-4">

            <div>
              <label class="label">
                Order Token / Number
              </label>

              <input v-model="token" required class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder-gray-400
               focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="Enter your order token"
              />
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-[#2E7D32] hover:bg-[#256428] text-white py-3 rounded-xl font-semibold transition flex justify-center items-center"
            >
              {{ loading ? 'Tracking...' : 'Track Order' }}
            </button>

          </form>

          <!-- Result -->
          <div v-if="order" class="mt-8 space-y-3 bg-gray-50 rounded-xl p-4">

            <div class="flex justify-between text-sm border-b pb-3">
              <span class="text-gray-500">Order</span>
              <span class="font-bold text-gray-900">
                                #{{ order.order_number }}
                            </span>
            </div>

            <div class="flex justify-between text-sm border-b pb-3">
              <span class="text-gray-500">Status</span>
              <span class="font-bold text-[#2E7D32]">
                                {{ order.status }}
                            </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Total</span>
              <span class="font-bold text-gray-900">
                                {{ settings.formatPrice(order.total_amount) }}
                            </span>
            </div>

          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-500 text-sm text-center mt-4">
            {{ error }}
          </p>

        </div>

      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {ref} from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import {orderApi} from '@/api'
import {useSettingsStore} from '@/stores/settings'

const settings = useSettingsStore()
const token = ref('')
const order = ref(null)
const loading = ref(false)
const error = ref('')

async function track() {
  loading.value = true
  error.value = ''
  order.value = null

  try {
    const r = await orderApi.trackGuest(token.value)
    order.value = r.data.data
  } catch {
    error.value = 'Order not found. Please check your token.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.label {
  @apply block text-sm font-semibold text-gray-700 mb-1.5;
}
</style>