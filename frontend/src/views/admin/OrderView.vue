<script setup>
import { ref } from 'vue'
import DefaultLayout from '@/layouts/admin/DefaultLayout.vue'
import TableOrder from '@/components/admin/Tables/TableOrder.vue'

import ExportReceipt from '@/components/admin/ExportReceipt.vue'

const orders = ref([
  {
    id: 'ORD001',
    customerName: 'John Doe',
    orderDate: '2024-11-02',
    total: 1500000,
    status: 'pending',
    exportDate: new Date(),
    customerAddress: 'Customer Address',
    receiver: 'John Smith',
    reason: 'Export to customer',
    items: [
      { id: 1, code: 'P001', name: 'T-Shirt', price: 300000, quantity: 2 },
      { id: 2, code: 'P002', name: 'Jeans', price: 900000, quantity: 1 },
    ],
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    orderDate: '2024-11-02',
    total: 2000000,
    status: 'completed',
    exportDate: new Date(),
    customerAddress: 'Customer Address',
    receiver: 'John Smith',
    reason: 'Export to customer',
    items: [
      {
        id: 3,
        code: 'P003',
        name: 'Sports Shoes',
        price: 2000000,
        quantity: 1,
      },
    ],
  },
])

const orderStatuses = ref([
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
])

const selectedOrder = ref(null)
const showModal = ref(false)
const showDeleteModal = ref(false)
const orderToDelete = ref(null)

// Methods
const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const handleViewDetails = order => {
  selectedOrder.value = { ...order }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedOrder.value = null
}

const handleDeleteClick = order => {
  orderToDelete.value = order
  showDeleteModal.value = true
}

const deleteOrder = async () => {
  try {
    // Call API to delete order
    // await axios.delete(`/api/orders/${orderToDelete.value.id}`)

    // Update UI
    orders.value = orders.value.filter(
      order => order.id !== orderToDelete.value.id,
    )

    // Close modal
    cancelDelete()

    // Show success message
    alert('Order deleted successfully')
  } catch (error) {
    console.error('Error deleting order:', error)
    alert('Error occurred while deleting order')
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  orderToDelete.value = null
}

const updateOrderStatus = async order => {
  try {
    // Call API to update status
    // await axios.patch(`/api/orders/${order.id}`, {
    //   status: order.status
    // })

    // Update UI
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value[index] = { ...order }
    }

    // Show success message
    alert('Status updated successfully')
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error occurred while updating status')
  }
}
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
            <h3 class="text-lg font-medium">
              Order Details - {{ selectedOrder?.id }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>

          <div v-if="selectedOrder">
            <!-- Order Information -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="font-semibold">Customer:</p>
                <p>{{ selectedOrder.customerName }}</p>
              </div>
              <div>
                <p class="font-semibold">Order Date:</p>
                <p>{{ selectedOrder.orderDate }}</p>
              </div>
              <div>
                <p class="font-semibold">Status:</p>
                <select
                  v-model="selectedOrder.status"
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
                <p>{{ formatCurrency(selectedOrder.total) }}</p>
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
                      Quantity
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
                    <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ formatCurrency(item.price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ formatCurrency(item.price * item.quantity) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mt-6">
            <h3 class="text-lg font-medium mb-3">Export Receipt Preview</h3>

            <ExportReceipt :selectedOrder="selectedOrder" />
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
                Are you sure you want to delete order {{ orderToDelete?.id }}?
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
