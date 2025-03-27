<script setup>
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import orderServices from "@/services/orderServices";
import paymentServices from "@/services/paymentServices";
import { ref, onBeforeMount, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { loadScript } from "@paypal/paypal-js";

const route = useRoute();
const order = ref({});
const paypalLoaded = ref(false);
const paymentData = ref({});

const fetchOrder = async () => {
  try {
    console.log("Fetching order with ID:", route.query.order);
    const orderResponse = await orderServices.get(route.query.order);
    order.value = orderResponse.data.data;
    console.log("Order data:", order.value);

    // Fetch payment data only if order_id exists
    if (order.value.order_id) {
      const paymentResponse = await paymentServices.getByOrder(order.value.order_id);
      paymentData.value = paymentResponse.data.data[0] || {};
      console.log("Payment data:", paymentData.value);
    } else {
      console.warn("Order ID not found, skipping payment data fetch");
      paymentData.value = {};
    }
  } catch (error) {
    console.error("Error fetching order or payment data:", error);
    order.value = {};
    paymentData.value = {};
  }
};

const initializePayPal = async () => {

  try {
    const paypal = await loadScript({
      clientId:
        "Aem6xwjgD1G7OqUTRqYpigsFQs4r5B6jBDB_l4WGZKjtaacDq7CvY_p5yJFD3cV5xRsN6iOqvy03c4Ag",
    });
    console.log("PayPal SDK loaded:", paypal);

    const paypalContainer = document.getElementById("paypal-button-container");
    if (paypal && paypalContainer) {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            if (
              !order.value.order_id ||
              !order.value.items ||
              !order.value.items.length
            ) {
              console.log("Order data incomplete:", order.value);
              throw new Error("Order data is not fully loaded");
            }
            const usdAmount = totalUSD.value;
            if (usdAmount === "0.00") {
              throw new Error("Invalid order amount");
            }
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: usdAmount,
                    currency_code: "USD",
                  },
                  description: `Order #${order.value.order_id}`,
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const paypalOrder = await actions.order.capture();
              const paymentStatus = paypalOrder.status === "COMPLETED" ? "completed" : "pending";
              await paymentServices.status(paymentData.value.payment_id, paymentStatus);
              await fetchOrder(); // Refetch both order and payment data
            } catch (error) {
              console.error("Payment failed:", error);
              if (error.name === "INSTRUMENT_DECLINED") {
                alert("Your payment was declined. Please try another payment method.");
              } else {
                alert("Something went wrong. Please try again.");
              }
            }
          },
          onCancel: () => {
            alert("Payment was cancelled");
          },
          onError: (err) => {
            console.error("PayPal Error:", err);
            alert("Payment failed: " + err.message);
          },
        })
        .render("#paypal-button-container");
      paypalLoaded.value = true;
      console.log("PayPal Buttons rendered successfully");
    } else {
      console.error("PayPal container not found in DOM or SDK not loaded");
    }
  } catch (error) {
    console.error("PayPal initialization failed:", error);
    paypalLoaded.value = false;
  }
};

// Watch payment status to initialize PayPal when needed
watch(
  () => paymentData.value.payment_status,
  (newStatus) => {
    console.log("status", newStatus);
    
    if (newStatus === "failed") {
      console.log("Payment status is Pending, initializing PayPal...");
      initializePayPal();
    }
  },
  { immediate: false }
);

onBeforeMount(() => {
  fetchOrder();
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const totalUSD = computed(() => {
  if (!order.value.total_amount || isNaN(order.value.total_amount)) return "0.00";
  return (order.value.total_amount / 23000).toFixed(2);
});

const formatPrice = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Order Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Order Details</h1>
              <p class="mt-2 text-sm text-gray-600">
                Ordered on {{ formatDate(order.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Status and Payment -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Payment Status</p>
              <div class="mt-1 flex items-center">
                <span
                  :class="{
                    'px-2 py-1 text-sm font-semibold rounded-full': true,
                    'bg-yellow-100 text-yellow-800': paymentData.payment_status === 'pending',
                    'bg-green-100 text-green-800': paymentData.payment_status === 'completed',
                    'bg-red-100 text-red-800': paymentData.payment_status === 'failed',
                  }"
                >
                  {{ paymentData.payment_status || "Loading..." }}
                </span>
              </div>
            </div>
            <div v-if="paymentData.paid_at" class="text-right">
              <p class="text-sm font-medium text-gray-600">Payment Date</p>
              <p class="mt-1 text-gray-900">{{ formatDate(paymentData.paid_at) }}</p>
            </div>
          </div>

          <!-- PayPal Button Container -->
          <div v-if="paymentData.payment_status === 'failed'" class="mt-4">
            <div id="paypal-button-container" class="max-w-md mx-auto"></div>
            <p v-if="!paypalLoaded" class="text-sm text-gray-500 text-center mt-2">
              Loading payment options...
            </p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div v-if="order.items && order.items.length" class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.product_id"
              class="flex items-center space-x-4"
            >
              <img
                :src="item.product.images[0].image_url"
                :alt="item.product.name"
                class="w-16 h-16 object-cover rounded-md"
              />
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ item.product.name }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Quantity: {{ item.quantity }}
                </p>
              </div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.price) }}
              </p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">No items found.</p>
        </div>

        <!-- Shipping Address -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div class="text-sm text-gray-600">
            <p class="font-medium text-gray-900">{{ order.recipient_name || "N/A" }}</p>
            <p>{{ order.shipping_address || "N/A" }}</p>
            <p class="mt-2">Phone: {{ order.recipient_phone || "N/A" }}</p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="px-6 py-4">
          <div class="space-y-2">
            <div class="pt-4 mt-4">
              <div class="flex justify-between">
                <p class="text-lg font-semibold">Total:</p>
                <p class="text-lg font-semibold">
                  {{ formatPrice(order.total_amount) }}
                </p>
              </div>
              <p class="text-sm text-gray-500 mt-1 text-right">
                ≈ ${{ totalUSD }} USD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>