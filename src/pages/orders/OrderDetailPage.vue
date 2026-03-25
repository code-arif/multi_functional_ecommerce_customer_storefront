<template>
    <div class="max-w-5xl">
        <PageHeader :title="`Order #${order?.order_number || ''}`"
            :subtitle="order ? formatDate(order.created_at) : ''">
            <button @click="$router.push('/orders')" class="btn-ghost">← Orders</button>
        </PageHeader>

        <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div v-for="i in 4" :key="i" class="skeleton h-40 rounded-xl" />
        </div>

        <div v-else-if="order" class="space-y-6">
            <!-- Status Bar -->
            <div class="card p-5 flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <StatusBadge :value="order.status" class="text-sm px-3 py-1.5" />
                    <span class="text-gray-400 text-sm">→</span>
                    <div class="flex items-center gap-2">
                        <select v-model="newStatus" class="input-sm w-36">
                            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <input v-model="statusComment" class="input-sm w-48" placeholder="Optional note..." />
                        <button @click="updateStatus" :disabled="updatingStatus || newStatus === order.status"
                            class="btn-primary text-xs py-1.5 px-3">
                            {{ updatingStatus ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-3 ml-auto">
                    <div class="text-right">
                        <p class="text-xs text-gray-400">Payment</p>
                        <StatusBadge :value="order.payment_status" />
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">Total</p>
                        <p class="font-black text-[#2E7D32] text-lg">৳{{ Number(order.total_amount).toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Order Items (left 2/3) -->
                <div class="lg:col-span-2 space-y-5">
                    <div class="card overflow-hidden">
                        <div class="p-4 border-b border-gray-100">
                            <h3 class="font-bold text-gray-900">Items Ordered</h3>
                        </div>
                        <table class="w-full">
                            <tbody>
                                <tr v-for="item in order.items" :key="item.id" class="table-row">
                                    <td class="table-cell">
                                        <div class="flex items-center gap-3">
                                            <img v-if="item.product_image" :src="`/storage/${item.product_image}`"
                                                class="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                                            <div v-else
                                                class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-xl">
                                                📦</div>
                                            <div>
                                                <p class="font-semibold text-gray-900 text-sm">{{ item.product_name }}
                                                </p>
                                                <p v-if="item.product_sku" class="text-xs text-gray-400">SKU: {{
                                                    item.product_sku }}</p>
                                                <p v-if="item.variant_attributes" class="text-xs text-gray-500">
                                                    {{Object.entries(item.variant_attributes || {}).map(([k, v]) =>
                                                        `${k}:
                                                    ${v}`).join(', ')}}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="table-cell text-center text-sm text-gray-600">× {{ item.quantity }}</td>
                                    <td class="table-cell text-right font-semibold text-gray-900">৳{{
                                        Number(item.subtotal).toLocaleString() }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Totals -->
                        <div class="p-4 border-t border-gray-100 space-y-2">
                            <div class="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>৳{{
                                Number(order.subtotal).toLocaleString() }}</span></div>
                            <div v-if="order.discount_amount > 0" class="flex justify-between text-sm text-green-700">
                                <span>Discount{{ order.coupon_code ? ` (${order.coupon_code})` : '' }}</span><span>−৳{{
                                    Number(order.discount_amount).toLocaleString() }}</span>
                            </div>
                            <div class="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>{{
                                order.shipping_charge > 0 ? `৳${Number(order.shipping_charge).toLocaleString()}` :
                                    'FREE' }}</span></div>
                            <div class="flex justify-between font-black text-gray-900 border-t border-gray-100 pt-2">
                                <span>Total</span><span class="text-[#2E7D32]">৳{{
                                    Number(order.total_amount).toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tracking -->
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-4">Shipping & Tracking</h3>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="label">Tracking Number</label>
                                <input v-model="trackingNumber" class="input" placeholder="e.g. BD123456789" />
                            </div>
                            <div>
                                <label class="label">Shipping Carrier</label>
                                <input v-model="shippingCarrier" class="input" placeholder="e.g. Sundarban Courier" />
                            </div>
                        </div>
                        <div class="mt-3"><label class="label">Admin Note</label>
                            <textarea v-model="adminNote" rows="2" class="input" placeholder="Internal note..." />
                        </div>
                        <button @click="saveTracking" :disabled="savingTracking" class="btn-primary mt-3 text-sm">
                            {{ savingTracking ? 'Saving...' : 'Save Tracking Info' }}
                        </button>
                    </div>

                    <!-- Status History -->
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-4">Status History</h3>
                        <div class="space-y-3">
                            <div v-for="h in order.status_history || []" :key="h.created_at"
                                class="flex items-start gap-3">
                                <div class="w-2 h-2 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                                <div>
                                    <p class="text-sm font-semibold text-gray-800">
                                        <span v-if="h.old_status">{{ h.old_status }} → </span>{{ h.new_status }}
                                    </p>
                                    <p v-if="h.comment" class="text-xs text-gray-500">{{ h.comment }}</p>
                                    <p class="text-[11px] text-gray-400 mt-0.5">{{ formatDate(h.created_at) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right sidebar: customer + shipping -->
                <div class="space-y-5">
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-3">Customer</h3>
                        <div class="text-sm space-y-1.5 text-gray-600">
                            <p class="font-semibold text-gray-900">{{ order.shipping_name }}</p>
                            <p v-if="order.shipping_email">📧 {{ order.shipping_email }}</p>
                            <p>📞 {{ order.shipping_phone }}</p>
                            <div v-if="order.user" class="pt-2 border-t border-gray-100 mt-2">
                                <p class="text-xs text-gray-400 mb-1">Account</p>
                                <router-link :to="`/users/${order.user.id}`"
                                    class="text-[#2E7D32] text-xs font-semibold hover:underline">View Customer
                                    →</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-3">Shipping Address</h3>
                        <address class="not-italic text-sm text-gray-600 space-y-1">
                            <p>{{ order.shipping_address?.address_line1 }}</p>
                            <p v-if="order.shipping_address?.address_line2">{{ order.shipping_address.address_line2 }}
                            </p>
                            <p>{{ order.shipping_address?.city }}<span v-if="order.shipping_address?.state">, {{
                                order.shipping_address.state }}</span></p>
                            <p>{{ order.shipping_address?.country }}</p>
                        </address>
                    </div>
                    <div class="card p-5">
                        <h3 class="font-bold text-gray-900 mb-3">Payment</h3>
                        <div class="text-sm space-y-1.5">
                            <div class="flex justify-between"><span class="text-gray-500">Method</span><span
                                    class="font-semibold uppercase">{{ order.payment_method }}</span></div>
                            <div class="flex justify-between"><span class="text-gray-500">Status</span>
                                <StatusBadge :value="order.payment_status" />
                            </div>
                            <div v-if="order.payment?.transaction_id" class="flex justify-between"><span
                                    class="text-gray-500">TXN ID</span><span class="text-xs font-mono">{{
                                        order.payment.transaction_id }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { orderApi } from '@/api'

const route = useRoute(), toast = useToast()
const order = ref(null), loading = ref(true)
const newStatus = ref(''), statusComment = ref(''), updatingStatus = ref(false)
const trackingNumber = ref(''), shippingCarrier = ref(''), adminNote = ref(''), savingTracking = ref(false)
const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

function formatDate(d) { return d ? new Date(d).toLocaleString('en-BD', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '' }

async function loadOrder() {
    loading.value = true
    try {
        const res = await orderApi.show(route.params.id)
        order.value = res.data.data
        newStatus.value = order.value.status
        trackingNumber.value = order.value.tracking_number || ''
        shippingCarrier.value = order.value.shipping_carrier || ''
        adminNote.value = order.value.admin_note || ''
    } finally { loading.value = false }
}

async function updateStatus() {
    updatingStatus.value = true
    try {
        await orderApi.updateStatus(route.params.id, { status: newStatus.value, comment: statusComment.value, notify_customer: true })
        toast.success('Order status updated.')
        statusComment.value = ''
        loadOrder()
    } finally { updatingStatus.value = false }
}

async function saveTracking() {
    savingTracking.value = true
    try {
        await orderApi.updateStatus(route.params.id, { status: order.value.status, tracking_number: trackingNumber.value, shipping_carrier: shippingCarrier.value, notify_customer: false })
        await orderApi.updateNote(route.params.id, { admin_note: adminNote.value })
        toast.success('Tracking info saved.')
    } finally { savingTracking.value = false }
}

onMounted(loadOrder)
</script>