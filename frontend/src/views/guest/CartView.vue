<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from 'vue-router';
import { useCartStore } from "@/stores/cart";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import categoryServices from "@/services/categoryServices";
import { useOrderStore } from "@/stores/order";
import { nextTick } from 'vue'; // Thêm nextTick để đảm bảo render

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

// Computed values for order summary
const subtotal = computed(() => cartStore.totalPrice);
const shipping = ref(30000);
const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + shipping.value + tax.value);

// State for success message
const showSuccessMessage = ref(false);

// Cart item actions
const updateItemQuantity = async (item, newQuantity) => {
    console.log(`Updating quantity for item ${String(item._id)} to ${newQuantity}, current items:`, cartStore.items);
    if (newQuantity > 0) {
        cartStore.updateQuantity(String(item._id), newQuantity);
    } else {
        console.log(`Removing item ${String(item._id)} as quantity is 0`);
        cartStore.removeItem(String(item._id));
        console.log(`Cart items after remove:`, cartStore.items);
        showSuccessMessage.value = true;
        await nextTick(); // Đảm bảo render trước khi setTimeout
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 10000); // Tăng thời gian hiển thị lên 10 giây
    }
};

const removeFromCart = async (itemId) => {
    console.log(`Removing item ${String(itemId)}, current items:`, cartStore.items);
    cartStore.removeItem(String(itemId));
    console.log(`Cart items after remove:`, cartStore.items);
    showSuccessMessage.value = true;
    await nextTick(); // Đảm bảo render trước khi setTimeout
    setTimeout(() => {
        showSuccessMessage.value = false;
    }, 10000); // Tăng thời gian hiển thị lên 10 giây
};

const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
};

const proceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", cartStore.items);
    orderStore.addItems(cartStore.items);
    router.push("/checkout");
};

const categories = ref([]);
const fetchCategory = async () => {
    await categoryServices
        .gets()
        .then((response) => {
            categories.value = response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });
};
onBeforeMount(() => {
    fetchCategory();
});

const findcategory = (id) => {
    return categories.value.find((c) => String(c._id) === String(id))?.title;
};

function formatVND(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid input: Amount must be a number");
    }
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
</script>

<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            <!-- Success Message with specific class -->
            <div v-if="showSuccessMessage" class="fixed top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg success-message z-50">
                Deleted product successful
            </div>

            <div class="flex flex-col lg:flex-row gap-5">
                <!-- Cart Items -->
                <div class="lg:w-8/12">
                    <div class="bg-white p-6 shadow-xl border rounded-lg">
                        <table class="w-full table-auto" v-if="cartStore.items.length">
                            <thead>
                                <tr class="text-left text-gray-700 border-b">
                                    <th class="py-2">Product</th>
                                    <th class="py-2">Price</th>
                                    <th class="py-2">Quantity</th>
                                    <th class="py-2">Total</th>
                                    <th class="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in cartStore.items" :key="item.id" class="border-b">
                                    <td class="py-4">
                                        <div class="flex items-center">
                                            <img :src="item.images[0].image_url" :alt="item.name"
                                                class="w-16 h-16 object-cover rounded mr-4" />
                                            <div>
                                                <h2 class="text-lg font-bold">{{ item.name }}</h2>
                                                <p class="text-gray-600">
                                                    Category: {{ findcategory(item.category) }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <div>
                                            <p class="text-lg font-semibold">
                                                {{ formatVND(item.price) }}
                                            </p>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <div class="flex items-center space-x-2">
                                            <button @click="updateItemQuantity(item, item.quantity - 1)"
                                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 quantity-decrease">
                                                <font-awesome-icon icon="minus" class="size-3" />
                                            </button>
                                            <input type="number" :value="item.quantity" @change="(e) =>
                                                updateItemQuantity(item, parseInt(e.target.value))
                                                " class="w-16 text-center p-2 border border-gray-300 rounded"
                                                min="0" />
                                            <button @click="updateItemQuantity(item, item.quantity + 1)"
                                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 quantity-increase">
                                                <font-awesome-icon icon="plus" class="size-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td class="py-4 font-semibold">
                                        {{ formatVND(item.price * item.quantity) }}
                                    </td>
                                    <td class="py-4">
                                        <button @click="removeFromCart(item._id)"
                                            class="text-red-500 hover:text-red-700 remove-button">
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="text-center py-8 text-gray-500">
                            Your cart is empty
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="lg:w-4/12">
                    <div class="bg-white p-6 shadow-xl border rounded-lg">
                        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <p class="text-gray-600">Subtotal</p>
                                <p class="text-gray-600">{{ formatVND(subtotal) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Shipping</p>
                                <p class="text-gray-600">{{ formatVND(shipping) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Tax (5%)</p>
                                <p class="text-gray-600">{{ formatVND(tax) }}</p>
                            </div>
                            <div class="pt-3 border-t">
                                <div class="flex justify-between text-lg font-bold total-container">
                                    <p>Total</p>
                                    <p class="total-value">{{ formatVND(total) }}</p>
                                </div>
                            </div>
                        </div>
                        <button @click="proceedToCheckout"
                            class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            :disabled="!cartStore.items.length">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<style scoped>
.fixed {
    position: fixed;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
}

.success-message {
    z-index: 50; /* Đảm bảo phần tử hiển thị trên cùng */
}

.quantity-increase, .quantity-decrease, .remove-button {
    /* Đảm bảo các class này có thể được test script nhận diện */
}

.total-container {
    /* Class cho phần tử Total */
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>