<template>
    <DefaultLayout>
        <div class="container-app py-8">
            <h1 class="text-2xl font-black text-gray-900 mb-8">Shopping Cart</h1>

            <div v-if="cart.isEmpty" class="text-center py-20">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span class="text-5xl">🛒</span>
                </div>
                <h2 class="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p class="text-gray-400 mb-8">Add some products to get started!</p>
                <router-link to="/shop" class="btn-primary px-8 py-3">Browse Shop</router-link>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2 space-y-4">
                    <div v-for="item in cart.items" :key="item.id" class="card p-4 flex gap-4">
                        <router-link :to="`/product/${item.product?.slug}`" class="shrink-0">
                            <img :src="item.product?.thumbnail_url || ''" :alt="item.product?.name"
                                class="w-20 h-20 object-cover rounded-xl bg-gray-100" />
                        </router-link>
                        <div class="flex-1 min-w-0">
                            <router-link :to="`/product/${item.product?.slug}`">
                                <p
                                    class="font-semibold text-gray-800 text-sm hover:text-[#2E7D32] transition line-clamp-2">
                                    {{ item.product?.name }}</p>
                            </router-link>
                            <div v-if="item.variant?.attributes" class="flex flex-wrap gap-1 mt-1">
                                <span v-for="(val, key) in item.variant.attributes" :key="key"
                                    class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ key }}: {{
                                    val }}</span>
                            </div>
                            <p class="text-[#2E7D32] font-bold text-sm mt-1">{{ settings.formatPrice(item.unit_price) }}
                            </p>
                        </div>
                        <div class="flex flex-col items-end justify-between shrink-0">
                            <!-- Qty control -->
                            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button @click="cart.updateItem(item.id, item.quantity - 1)" :disabled="item.quantity <= 1"
                                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-sm">−</button>
                                <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
                                <button @click="cart.updateItem(item.id, item.quantity + 1)"
                                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-sm">+</button>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-gray-900">{{ settings.formatPrice(item.line_total) }}</p>
                                <button @click="cart.removeItem(item.id)"
                                    class="text-xs text-red-400 hover:text-red-600 transition mt-1">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="card p-5 sticky top-24 space-y-4">
                        <h3 class="font-bold text-gray-900 text-lg">Order Summary</h3>

                        <!-- Coupon -->
                        <div>
                            <p class="text-sm font-semibold text-gray-700 mb-2">Coupon Code</p>
                            <div v-if="cart.coupon"
                                class="flex items-center justify-between bg-green-pale rounded-xl px-3 py-2">
                                <span class="text-sm font-bold text-[#2E7D32]">{{ cart.coupon.code }}</span>
                                <button @click="cart.removeCoupon()"
                                    class="text-xs text-red-500 hover:text-red-600 transition">Remove</button>
                            </div>
                            <div v-else class="flex gap-2">
                                <input v-model="couponCode" @keyup.enter="applyCoupon" type="text"
                                    placeholder="Enter coupon..." class="input py-2 text-sm" />
                                <button @click="applyCoupon" :disabled="applyingCoupon"
                                    class="btn-primary py-2 px-4 text-sm shrink-0">Apply</button>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-4 space-y-3">
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span><span class="font-semibold">{{ settings.formatPrice(cart.subtotal)
                                    }}</span>
                            </div>
                            <div v-if="cart.discount > 0" class="flex justify-between text-sm text-green-700">
                                <span>Discount</span><span class="font-semibold">−{{ settings.formatPrice(cart.discount)
                                    }}</span>
                            </div>
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span class="font-semibold" :class="shippingFree ? 'text-green-700' : ''">
                                    {{ shippingFree ? 'FREE' : settings.formatPrice(settings.shippingCharge) }}
                                </span>
                            </div>
                            <div
                                class="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                                <span>Total</span>
                                <span class="text-[#2E7D32]">{{ settings.formatPrice(cart.total +
                                    (shippingFree?0:settings.shippingCharge)) }}</span>
                            </div>
                        </div>

                        <router-link to="/checkout" class="btn-primary w-full justify-center py-3.5">
                            Proceed to Checkout →
                        </router-link>
                        <router-link to="/shop"
                            class="block text-center text-sm text-gray-500 hover:text-[#2E7D32] transition">
                            ← Continue Shopping
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
const cart = useCartStore(), settings = useSettingsStore()
const couponCode = ref(''), applyingCoupon = ref(false)
const shippingFree = computed(() => cart.subtotal >= settings.freeShippingOver)
async function applyCoupon() {
    if (!couponCode.value.trim()) return
    applyingCoupon.value = true
    await cart.applyCoupon(couponCode.value.trim())
    couponCode.value = ''
    applyingCoupon.value = false
}
</script>