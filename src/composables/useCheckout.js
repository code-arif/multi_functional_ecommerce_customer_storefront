import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { parseErrors } from "@/utils/helpers";

export function useCheckout() {
  const router = useRouter();
  const orders = useOrderStore();
  const cart = useCartStore();
  const auth = useAuthStore();
  const ui = useUiStore();

  const errors = ref({});

  const form = reactive({
    shipping_name: auth.userName || "",
    shipping_phone: "",
    shipping_email: auth.userEmail || "",
    shipping_address_line1: "",
    shipping_address_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "Bangladesh",
    payment_method: "cod",
    customer_note: "",
  });

  const shippingFree = computed(
    () => Number(cart.subtotal) >= ui.freeShippingOver,
  );

  const shippingCost = computed(() =>
    shippingFree.value ? 0 : ui.shippingCharge,
  );

  const orderTotal = computed(() =>
    Math.max(0, Number(cart.total) + shippingCost.value),
  );

  function fillFromAddress(addr) {
    form.shipping_name = addr.recipient_name || "";
    form.shipping_phone = addr.phone || "";
    form.shipping_email = addr.email || form.shipping_email;
    form.shipping_address_line1 = addr.address_line1 || "";
    form.shipping_address_line2 = addr.address_line2 || "";
    form.shipping_city = addr.city || "";
    form.shipping_state = addr.state || "";
    form.shipping_postal_code = addr.postal_code || "";
    form.shipping_country = addr.country || "Bangladesh";
  }

  async function submit() {
    errors.value = {};
    try {
      const order = await orders.placeOrder({ ...form });
      cart.resetCart();
      router.push({
        name: "order-success",
        params: { orderNumber: order.order_number },
      });
    } catch (e) {
      errors.value = parseErrors(e);
    }
  }

  return {
    form,
    errors,
    shippingFree,
    shippingCost,
    orderTotal,
    placing: computed(() => orders.placing),
    fillFromAddress,
    submit,
  };
}
