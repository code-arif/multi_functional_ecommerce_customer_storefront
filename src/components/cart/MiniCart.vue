<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="ui.miniCartOpen" class="fixed inset-0 bg-black/40 z-40" @click="ui.closeMiniCart()" />
        </Transition>
        <Transition name="slide-left">
            <div v-if="ui.miniCartOpen"
                class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl flex flex-col">

                <!-- Header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 class="font-display font-700 text-lg text-gray-900">
                        My Cart
                        <span v-if="cart.itemCount > 0" class="ml-2 text-sm font-medium text-gray-400">({{
                            cart.itemCount }})</span>
                    </h2>
                    <button @click="ui.closeMiniCart()" class="btn-icon">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>

                <!-- Empty -->
                <div v-if="cart.isEmpty" class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div class="w-20 h-20 rounded-full bg-brand-pale flex items-center justify-center">
                        <ShoppingCartIcon class="w-10 h-10 text-primary-400" />
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800 mb-1">Your cart is empty</p>
                        <p class="text-sm text-gray-500">Start adding products to your cart.</p>
                    </div>
                    <RouterLink to="/shop" @click="ui.closeMiniCart()" class="btn-primary">Browse Shop</RouterLink>
                </div>

                <!-- Items -->
                <div v-else class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    <div v-for="item in cart.items" :key="item.id" class="flex gap-3 items-start group">
                        <RouterLink :to="`/product/${item.product?.slug}`" @click="ui.closeMiniCart()" class="shrink-0">
                            <div
                                class="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                <img v-if="item.product?.thumbnail_url" :src="item.product.thumbnail_url"
                                    :alt="item.product?.name" class="w-full h-full object-cover" />
                                <PhotoIcon v-else class="w-7 h-7 text-gray-200" />
                            </div>
                        </RouterLink>
                        <div class="flex-1 min-w-0">
                            <RouterLink :to="`/product/${item.product?.slug}`" @click="ui.closeMiniCart()">
                                <p
                                    class="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-primary-700 transition-colors">
                                    {{ item.product?.name }}</p>
                            </RouterLink>
                            <div v-if="item.variant?.attributes" class="flex flex-wrap gap-1 mt-0.5">
                                <span v-for="(v, k) in item.variant.attributes" :key="k"
                                    class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ k }}: {{ v
                                    }}</span>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <!-- Qty controls -->
                                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button @click="cart.updateItem(item.id, item.quantity - 1)"
                                        :disabled="item.quantity <= 1"
                                        class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors text-sm">−</button>
                                    <span class="w-7 text-center text-xs font-bold">{{ item.quantity }}</span>
                                    <button @click="cart.updateItem(item.id, item.quantity + 1)"
                                        class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm">+</button>
                                </div>
                                <span class="text-sm font-bold text-primary-700">{{
                                    ui.formatPrice(Number(item.unit_price) * item.quantity) }}</span>
                            </div>
                        </div>
                        <button @click="cart.removeItem(item.id)"
                            class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all mt-0.5">
                            <XMarkIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="!cart.isEmpty" class="border-t border-gray-100 px-5 py-5 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Subtotal</span>
                        <span class="font-bold text-gray-900">{{ ui.formatPrice(cart.subtotal) }}</span>
                    </div>
                    <p class="text-xs text-gray-400 text-center">Shipping calculated at checkout</p>
                    <RouterLink to="/checkout" @click="ui.closeMiniCart()" class="btn-primary-lg w-full justify-center">
                        Checkout → {{ ui.formatPrice(cart.subtotal) }}
                    </RouterLink>
                    <RouterLink to="/cart" @click="ui.closeMiniCart()"
                        class="block text-center text-sm text-primary-700 font-semibold hover:underline">
                        View Full Cart
                    </RouterLink>
                </div>

            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useUiStore } from '@/stores/uiStore'
import { XMarkIcon, ShoppingCartIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const cart = useCartStore()
const ui = useUiStore()
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform .28s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>