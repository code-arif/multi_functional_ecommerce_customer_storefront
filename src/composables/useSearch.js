import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchService } from "@/services/searchService";
import { debounce } from "@/utils/helpers";

export function useSearch() {
  const route = useRoute();
  const router = useRouter();

  const query = ref(route.query.q || "");
  const products = ref([]);
  const pagination = ref(null);
  const loading = ref(false);
  const suggestions = ref([]);
  const showSuggestions = ref(false);
  const filters = ref({
    category: route.query.category || "",
    brand: route.query.brand || "",
    min_price: route.query.min_price || "",
    max_price: route.query.max_price || "",
    rating: route.query.rating || "",
    in_stock: route.query.in_stock || "",
    sort: route.query.sort || "",
    page: route.query.page || 1,
  });

  async function search() {
    loading.value = true;
    try {
      const params = { q: query.value, ...filters.value };
      // Remove empty params
      Object.keys(params).forEach((k) => {
        if (!params[k]) delete params[k];
      });
      const res = await searchService.search(params);
      products.value = res.data.data || [];
      pagination.value = res.data.pagination;
    } finally {
      loading.value = false;
    }
  }

  const fetchSuggestions = debounce(async (q) => {
    if (!q || q.length < 2) {
      suggestions.value = [];
      return;
    }
    try {
      const res = await searchService.suggestions(q);
      suggestions.value = res.data.data || [];
    } catch {
      suggestions.value = [];
    }
  }, 280);

  function onQueryInput(val) {
    query.value = val;
    fetchSuggestions(val);
    showSuggestions.value = true;
  }

  function closeSuggestions() {
    showSuggestions.value = false;
  }

  function goSearch() {
    closeSuggestions();
    router.push({ name: "search", query: { q: query.value } });
  }

  function applyFilter(key, val) {
    filters.value[key] = val;
    filters.value.page = 1;
    search();
  }

  function changePage(page) {
    filters.value.page = page;
    search();
  }

  function clearFilters() {
    filters.value = {
      category: "",
      brand: "",
      min_price: "",
      max_price: "",
      rating: "",
      in_stock: "",
      sort: "",
      page: 1,
    };
    search();
  }

  return {
    query,
    products,
    pagination,
    loading,
    suggestions,
    showSuggestions,
    filters,
    search,
    onQueryInput,
    closeSuggestions,
    goSearch,
    applyFilter,
    changePage,
    clearFilters,
  };
}
