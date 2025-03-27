<script setup>
import { onBeforeMount, ref, watch } from "vue";
import DefaultLayout from "@/layouts/admin/DefaultLayout.vue";
import TableOrder from "@/components/admin/Tables/TableOrder.vue";
import orderServices from "@/services/orderServices";
import { useAdminStore } from "@/stores/admin";
import userServices from "@/services/userServices";

const orders = ref([]);
const selectedOrder = ref({});
const selectedStatus = ref("");

const orderStatuses = ref([
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "canceled", label: "Canceled" },
]);

const showModal = ref(false);
const showDeleteModal = ref(false);
const orderToDelete = ref(null);

// Đồng bộ selectedStatus khi selectedOrder thay đổi (dùng cho modal)
watch(
  selectedOrder,
  (newOrder) => {
    console.log("SelectedOrder changed:", newOrder);
    selectedStatus.value = newOrder?.status || "";
    console.log("Updated selectedStatus:", selectedStatus.value);
  },
  { deep: true }
);

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleViewDetails = (order) => {
  selectedOrder.value = { ...order };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = {};
};

const handleDeleteClick = (order) => {
  orderToDelete.value = order;
  showDeleteModal.value = true;
};

const deleteOrder = async () => {
  try {
    await orderServices.delete(orderToDelete.value.order_id);
    orders.value = orders.value.filter(
      (order) => order.order_id !== orderToDelete.value.order_id
    );
    cancelDelete();
    alert("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    alert("Error occurred while deleting order");
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  orderToDelete.value = null;
};

const updateOrderStatus = async (order) => {
  console.log("Updating Order ID:", order.order_id);
  console.log("New Status:", order.status); // Sử dụng order.status từ TableOrder

  if (!order.status) {
    alert("Please select a valid status before updating.");
    return;
  }

  try {
    await orderServices.cancel(order.order_id, order.status); // Gửi status từ order

    // Cập nhật danh sách đơn hàng
    const index = orders.value.findIndex((o) => o.order_id === order.order_id);
    if (index !== -1) {
      orders.value[index] = { ...order }; // Cập nhật toàn bộ order
    }

    alert("Status updated successfully");
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
};

onBeforeMount(async () => {
  const access = useAdminStore().admin.access;
  const response = await orderServices.gets();
  const orderList = response.data.data;
  console.log(orderList);

  for (const element of orderList) {
    const userResponse = await userServices.getme(access);
    element.name = userResponse.data.data.name;
  }
  orders.value = orderList;
});
</script>

<template>
  <DefaultLayout>
    <div class="p-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold">Order List</h2>
      </div>

      <TableOrder
        :orders="orders"
        :order-statuses="orderStatuses"
        @update-status="updateOrderStatus"
        @view-details="handleViewDetails"
        @delete-order="handleDeleteClick"
      />

      <!-- Order Details Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Order Details</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="text-2xl">×</span>
            </button>
          </div>

          <div v-if="selectedOrder">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="font-semibold">Customer:</p>
                <p>{{ selectedOrder.recipient_name }}</p>
              </div>
              <div>
                <p class="font-semibold">Order Date:</p>
                <p>{{ formatDate(selectedOrder.created_at) }}</p>
              </div>
              <div>
                <p class="font-semibold">Status:</p>
                <select
                  v-model="selectedStatus"
                  @change="updateOrderStatus(selectedOrder)"
                  class="mt-1 text-sm rounded-md dark:border-strokedark dark:bg-boxdark border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option
                    v-for="status in orderStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
              </div>
              <div>
                <p class="font-semibold">Total Amount:</p>
                <p>{{ formatCurrency(selectedOrder.total_amount) }}</p>
              </div>
            </div>

            <!-- Product Details -->
            <div>
              <h4 class="font-semibold mb-2">Product List:</h4>
              <table
                class="min-w-full divide-y divide-gray-200 dark:border-strokedark dark:bg-boxdark"
              >
                <thead
                  class="bg-gray-50 dark:border-strokedark dark:bg-boxdark"
                >
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider"
                    >
                      Unit Price
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white dark:text-white divide-y dark:border-strokedark dark:bg-boxdark divide-gray-200"
                >
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ item.product.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ item.product.stock }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ formatCurrency(item.price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{
                        formatCurrency(item.product.price * item.product.stock)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white"
        >
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Confirm Deletion
            </h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete order?
              </p>
            </div>
            <div class="items-center px-4 py-3">
              <button
                @click="deleteOrder"
                class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
              >
                Delete
              </button>
              <button
                @click="cancelDelete"
                class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>