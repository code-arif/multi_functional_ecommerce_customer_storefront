<template>
    <div class="space-y-6">
        <PageHeader title="Dashboard" :subtitle="`Welcome back, ${auth.userName}! Here's what's happening.`" />

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Today's Revenue" :value="stats.today_sales" icon="CurrencyDollarIcon" prefix="৳"
                iconBg="bg-green-100" iconColor="text-green-700" />
            <StatCard label="Monthly Revenue" :value="stats.monthly_sales" icon="ChartBarIcon" prefix="৳"
                iconBg="bg-blue-100" iconColor="text-blue-700" />
            <StatCard label="Total Orders" :value="stats.total_orders" icon="ShoppingCartIcon" iconBg="bg-purple-100"
                iconColor="text-purple-700" />
            <StatCard label="Pending Orders" :value="stats.pending_orders" icon="ClockIcon" iconBg="bg-yellow-100"
                iconColor="text-yellow-700" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Total Customers" :value="stats.total_customers" icon="UsersIcon" iconBg="bg-indigo-100"
                iconColor="text-indigo-700" />
            <StatCard label="Active Products" :value="stats.total_products" icon="CubeIcon" iconBg="bg-teal-100"
                iconColor="text-teal-700" />
            <StatCard label="Low Stock Items" :value="stats.low_stock_products" icon="ExclamationCircleIcon"
                iconBg="bg-red-100" iconColor="text-red-700" />
            <StatCard label="This Month Sales" :value="stats.revenue_this_month" icon="BanknotesIcon" prefix="৳"
                iconBg="bg-emerald-100" iconColor="text-emerald-700" />
        </div>

        <!-- Charts row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Revenue chart -->
            <div class="card p-5 lg:col-span-2">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="font-bold text-gray-900">Revenue (Last 30 Days)</h3>
                    <select v-model="chartPeriod" @change="loadChart" class="input-sm w-28">
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div class="h-56">
                    <canvas ref="revenueChartRef" />
                </div>
            </div>

            <!-- Orders by status (doughnut) -->
            <div class="card p-5">
                <h3 class="font-bold text-gray-900 mb-5">Orders by Status</h3>
                <div class="h-48 flex items-center justify-center">
                    <canvas ref="statusChartRef" />
                </div>
                <div class="mt-4 space-y-2">
                    <div v-for="(count, status) in ordersByStatus" :key="status"
                        class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-2.5 h-2.5 rounded-full"
                                :style="`background:${statusColors[status] || '#9CA3AF'}`" />
                            <span class="text-gray-600 capitalize">{{ status }}</span>
                        </div>
                        <span class="font-semibold text-gray-900">{{ count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom row: Recent orders + Top products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Orders -->
            <div class="card overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 class="font-bold text-gray-900">Recent Orders</h3>
                    <router-link to="/orders" class="text-xs text-[#2E7D32] font-semibold hover:underline">View All
                        →</router-link>
                </div>
                <div v-if="loadingOrders" class="p-6 text-center text-gray-400 text-sm">Loading...</div>
                <table v-else class="w-full">
                    <tbody>
                        <tr v-for="order in recentOrders" :key="order.id" class="table-row cursor-pointer"
                            @click="$router.push(`/orders/${order.id}`)">
                            <td class="table-cell">
                                <p class="font-semibold text-gray-900 text-xs">#{{ order.order_number }}</p>
                                <p class="text-gray-400 text-[11px]">{{ order.shipping_name }}</p>
                            </td>
                            <td class="table-cell">
                                <StatusBadge :value="order.status" />
                            </td>
                            <td class="table-cell text-right font-bold text-[#2E7D32]">৳{{
                                Number(order.total_amount).toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Top Products -->
            <div class="card overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 class="font-bold text-gray-900">Top Selling Products</h3>
                    <router-link to="/reports" class="text-xs text-[#2E7D32] font-semibold hover:underline">Full Report
                        →</router-link>
                </div>
                <div v-if="loadingTop" class="p-6 text-center text-gray-400 text-sm">Loading...</div>
                <table v-else class="w-full">
                    <tbody>
                        <tr v-for="(p, i) in topProducts" :key="p.product_id" class="table-row">
                            <td class="table-cell w-8 text-center">
                                <span class="text-xs font-bold"
                                    :class="i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-300'">
                                    {{ ['🥇', '🥈', '🥉'][i] || `#${i + 1}` }}
                                </span>
                            </td>
                            <td class="table-cell flex-1">
                                <p class="font-semibold text-gray-800 text-xs line-clamp-1">{{ p.product_name }}</p>
                                <p class="text-gray-400 text-[11px]">{{ p.total_sold }} sold</p>
                            </td>
                            <td class="table-cell text-right">
                                <p class="font-bold text-gray-900 text-xs">৳{{ Number(p.total_revenue).toLocaleString()
                                    }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { dashboardApi, reportApi, orderApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
Chart.register(...registerables)

const auth = useAuthStore()
const stats = ref({})
const ordersByStatus = ref({})
const recentOrders = ref([]), topProducts = ref([])
const loadingOrders = ref(true), loadingTop = ref(true)
const revenueChartRef = ref(null), statusChartRef = ref(null)
const chartPeriod = ref('daily')
let revenueChart = null, statusChart = null

const statusColors = {
    pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6',
    shipped: '#6366F1', delivered: '#10B981', cancelled: '#EF4444',
}

async function loadStats() {
    const res = await dashboardApi.stats()
    stats.value = res.data.data
}

async function loadChart() {
    const res = await reportApi.sales({ period: chartPeriod.value })
    const data = res.data.data || []
    const labels = data.map(d => d.date)
    const revenue = data.map(d => parseFloat(d.revenue || 0))

    if (revenueChart) revenueChart.destroy()
    if (!revenueChartRef.value) return

    revenueChart = new Chart(revenueChartRef.value, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Revenue (৳)',
                data: revenue,
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46,125,50,0.08)',
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2E7D32',
                pointRadius: 3,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
                y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 10 } } }
            }
        }
    })
}

async function loadStatusChart() {
    const res = await reportApi.ordersByStatus()
    ordersByStatus.value = res.data.data || {}
    const labels = Object.keys(ordersByStatus.value)
    const data = Object.values(ordersByStatus.value)
    const colors = labels.map(l => statusColors[l] || '#9CA3AF')

    if (statusChart) statusChart.destroy()
    if (!statusChartRef.value) return

    statusChart = new Chart(statusChartRef.value, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '72%',
            plugins: { legend: { display: false } }
        }
    })
}

async function loadRecentOrders() {
    loadingOrders.value = true
    const res = await orderApi.list({ per_page: 6, sort: 'latest' })
    recentOrders.value = res.data.data || []
    loadingOrders.value = false
}

async function loadTopProducts() {
    loadingTop.value = true
    const res = await reportApi.topProducts({ limit: 6 })
    topProducts.value = res.data.data || []
    loadingTop.value = false
}

onMounted(async () => {
    await Promise.allSettled([loadStats(), loadChart(), loadStatusChart(), loadRecentOrders(), loadTopProducts()])
})
</script>