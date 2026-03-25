<template>
  <div>
    <PageHeader title="Reports & Analytics" subtitle="Detailed sales and performance data" />

    <!-- Date range -->
    <div class="card p-4 mb-6 flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <label class="label mb-0">From</label>
        <input v-model="filters.from" type="date" class="input-sm w-36" />
      </div>
      <div class="flex items-center gap-2">
        <label class="label mb-0">To</label>
        <input v-model="filters.to" type="date" class="input-sm w-36" />
      </div>
      <div class="flex items-center gap-2">
        <label class="label mb-0">Period</label>
        <select v-model="filters.period" class="input-sm w-28">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <button @click="loadAll" class="btn-primary text-sm py-1.5 px-4">Apply</button>
      <div class="flex gap-2 ml-auto">
        <button v-for="preset in presets" :key="preset.label" @click="applyPreset(preset)" class="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#2E7D32] hover:text-[#2E7D32] transition">{{ preset.label }}</button>
      </div>
    </div>

    <!-- Summary stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="stat-card">
        <div class="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center"><span class="text-xl">💰</span></div>
        <div><p class="label mb-0">Total Revenue</p><p class="text-xl font-black text-gray-900">৳{{ totalRevenue.toLocaleString() }}</p></div>
      </div>
      <div class="stat-card">
        <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center"><span class="text-xl">📦</span></div>
        <div><p class="label mb-0">Total Orders</p><p class="text-xl font-black text-gray-900">{{ totalOrders.toLocaleString() }}</p></div>
      </div>
      <div class="stat-card">
        <div class="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center"><span class="text-xl">💳</span></div>
        <div><p class="label mb-0">Avg Order Value</p><p class="text-xl font-black text-gray-900">৳{{ avgOrderValue.toLocaleString() }}</p></div>
      </div>
      <div class="stat-card">
        <div class="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center"><span class="text-xl">👥</span></div>
        <div><p class="label mb-0">New Customers</p><p class="text-xl font-black text-gray-900">{{ totalNewCustomers }}</p></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="card p-5">
        <h3 class="font-bold text-gray-900 mb-4">Revenue Over Time</h3>
        <div class="h-64"><canvas ref="revenueRef" /></div>
      </div>
      <!-- Customer Growth -->
      <div class="card p-5">
        <h3 class="font-bold text-gray-900 mb-4">Customer Growth</h3>
        <div class="h-64"><canvas ref="customerRef" /></div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="card overflow-hidden">
      <div class="p-4 border-b border-gray-100"><h3 class="font-bold text-gray-900">Top Selling Products</h3></div>
      <table class="w-full">
        <thead class="bg-gray-50"><tr>
          <th class="table-header">#</th>
          <th class="table-header">Product</th>
          <th class="table-header">Units Sold</th>
          <th class="table-header">Revenue</th>
        </tr></thead>
        <tbody>
          <tr v-if="loadingTop"><td colspan="4" class="text-center py-8 text-gray-400 text-sm">Loading...</td></tr>
          <tr v-else v-for="(p, i) in topProducts" :key="p.product_id" class="table-row">
            <td class="table-cell w-12 text-center font-bold text-gray-400 text-sm">{{ i+1 }}</td>
            <td class="table-cell font-semibold text-gray-900 text-sm">{{ p.product_name }}</td>
            <td class="table-cell text-sm text-gray-700">{{ p.total_sold }}</td>
            <td class="table-cell font-bold text-[#2E7D32]">৳{{ Number(p.total_revenue).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import PageHeader from '@/components/common/PageHeader.vue'
import { reportApi } from '@/api'
Chart.register(...registerables)

const filters = ref({ from: new Date(Date.now()-30*24*60*60*1000).toISOString().slice(0,10), to: new Date().toISOString().slice(0,10), period: 'daily' })
const salesData=ref([]), customerData=ref([]), topProducts=ref([]), loadingTop=ref(true)
const revenueRef=ref(null), customerRef=ref(null)
let revChart=null, custChart=null

const totalRevenue = computed(() => Math.round(salesData.value.reduce((s,d)=>s+parseFloat(d.revenue||0),0)))
const totalOrders  = computed(() => salesData.value.reduce((s,d)=>s+parseInt(d.total_orders||0),0))
const avgOrderValue= computed(() => totalOrders.value>0 ? Math.round(totalRevenue.value/totalOrders.value) : 0)
const totalNewCustomers = computed(() => customerData.value.reduce((s,d)=>s+parseInt(d.new_customers||0),0))

const presets = [
  { label:'7 days',  days:7 },
  { label:'30 days', days:30 },
  { label:'90 days', days:90 },
]
function applyPreset(p) {
  filters.value.from = new Date(Date.now()-p.days*24*60*60*1000).toISOString().slice(0,10)
  filters.value.to   = new Date().toISOString().slice(0,10)
  loadAll()
}

function buildChart(canvasRef, labels, data, label, color, chartRef) {
  if (chartRef) chartRef.destroy()
  if (!canvasRef) return null
  return new Chart(canvasRef, {
    type:'bar',
    data:{ labels, datasets:[{ label, data, backgroundColor: color+'33', borderColor:color, borderWidth:2, borderRadius:4 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false},ticks:{font:{size:10},maxTicksLimit:10}}, y:{grid:{color:'#F3F4F6'},ticks:{font:{size:10}}} } }
  })
}

async function loadAll() {
  const [salesRes, custRes, topRes] = await Promise.allSettled([
    reportApi.sales(filters.value),
    reportApi.customerGrowth(),
    reportApi.topProducts({ from:filters.value.from, to:filters.value.to, limit:10 }),
  ])
  if (salesRes.status==='fulfilled') {
    salesData.value = salesRes.value.data.data || []
    revChart = buildChart(revenueRef.value, salesData.value.map(d=>d.date), salesData.value.map(d=>d.revenue), 'Revenue', '#2E7D32', revChart)
  }
  if (custRes.status==='fulfilled') {
    customerData.value = custRes.value.data.data || []
    custChart = buildChart(customerRef.value, customerData.value.map(d=>d.month), customerData.value.map(d=>d.new_customers), 'New Customers', '#3B82F6', custChart)
  }
  if (topRes.status==='fulfilled') { topProducts.value = topRes.value.data.data||[]; loadingTop.value=false }
}
onMounted(loadAll)
</script>