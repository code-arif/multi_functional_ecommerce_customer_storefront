<template>
  <DefaultLayout>
    <div class="container-app mx-auto px-4 py-20 flex justify-center">
      <div class="w-full max-w-xl">

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">

          <!-- Success Icon -->
          <div
              class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check class="w-10 h-10 text-[#2E7D32]"/>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-black text-gray-900 mb-2">
            Order Placed!
          </h1>

          <!-- Subtitle -->
          <p class="text-gray-500 mb-6">
            Thank you for your purchase. Your order is being processed.
          </p>

          <!-- Order Info -->
          <div ref="downloadArea" v-if="order" class="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Order Number</span>
              <span class="font-bold text-gray-900">{{ order.order_number }}</span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Payment Method</span>
              <span class="font-semibold text-gray-700">
                                {{ order.payment_method?.toUpperCase() }}
                            </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Total Amount</span>
              <span class="font-bold text-[#2E7D32]">
                                {{ settings.formatPrice(order.total_amount) }}
                            </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Shipping To</span>
              <span class="font-semibold text-gray-700 text-right">
                                {{ order.shipping_address?.name }},
                                {{ order.shipping_address?.city }}
                            </span>
            </div>

            <div class="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span class="text-gray-500">Status</span>
              <span class="badge-green">{{ order.status }}</span>
            </div>

          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-2 justify-center">

            <router-link v-if="auth.isLoggedIn"
                         :to="`/account/orders/${route.params.number}`"
                         class="bg-[#2E7D32] hover:bg-[#256428] text-white px-3 py-1 rounded-lg transition flex items-center justify-center gap-2">

              <Package class="w-4 h-4"/>
              Track Order
            </router-link>

            <router-link to="/shop"
                         class="border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-lg transition">
              Continue Shopping
            </router-link>

            <button
                @click="downloadImage"
                class="border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-lg  transition flex items-center justify-center gap-2">
              <Download class="w-4 h-4"/>
              Save as Image
            </button>

          </div>

          <!-- Footer -->
          <p class="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
            <Mail class="w-4 h-4"/>
            A confirmation email has been sent to
            {{ order?.shipping_address?.email || auth.userEmail }}
          </p>

        </div>

      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import {useAuthStore} from '@/stores/authStore'
import {useSettingsStore} from '@/stores/settings'
import {orderApi} from '@/services/orderService'
import {Check, Package, Mail, Download} from 'lucide-vue-next'
import html2canvas from "html2canvas"

const route = useRoute()
const auth = useAuthStore()
const settings = useSettingsStore()

const order = ref(null)
const downloadArea = ref(null)

// same order details to image
async function downloadImage() {
  const element = downloadArea.value

  const canvas = await html2canvas(element, {
    scale: 2, // high quality
    useCORS: true
  })

  const image = canvas.toDataURL("image/png")

  const link = document.createElement("a")
  link.href = image
  link.download = `order-${route.params.number}.png`
  link.click()
}

onMounted(async () => {
  try {
    const res = await orderApi.show(route.params.number)
    order.value = res.data.data
  } catch {
  }
})
</script>