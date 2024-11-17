<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router'
import { useCartStore } from "@/stores/cart";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
const router = useRouter()
const cartStore = useCartStore();

// Computed values for order summary
const subtotal = computed(() => cartStore.totalPrice);
const shipping = computed(() => (cartStore.totalItems > 0 ? 5.0 : 0));
const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + shipping.value + tax.value);
const totalSavings = computed(() => cartStore.totalSavings);

// Cart item actions
const updateItemQuantity = (item, newQuantity) => {
    cartStore.updateQuantity(item.id, newQuantity);
};

const removeFromCart = (itemId) => {
    cartStore.removeItem(itemId);
};

const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
};

const proceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", cartStore.items);
    router.push("/checkout")
};
</script>

<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>

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
                                            <img :src="item.thumbnail" :alt="item.name"
                                                class="w-16 h-16 object-cover rounded mr-4" />
                                            <div>
                                                <h2 class="text-lg font-bold">{{ item.name }}</h2>
                                                <p class="text-gray-600">
                                                    Category: {{ item.category }}
                                                </p>
                                                <div class="flex items-center mt-1">
                                                    <font-awesome-icon icon="star" class="text-amber-300" />
                                                    <span class="ml-1 text-sm text-gray-600">{{
                                                        item.rating
                                                        }}</span>
                                                    <span class="ml-2 text-sm text-gray-500">{{
                                                        item.unit
                                                        }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <div>
                                            <p class="text-lg font-semibold">
                                                ${{
                                                    calculateDiscountedPrice(
                                                        item.price,
                                                        item.discount
                                                    ).toFixed(2)
                                                }}
                                            </p>
                                            <p v-if="item.discount" class="text-sm">
                                                <span class="line-through text-gray-500">${{ item.price.toFixed(2)
                                                    }}</span>
                                                <span class="ml-2 text-green-600">-{{ item.discount }}%</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="py-4">
                                        <div class="flex items-center space-x-2">
                                            <button @click="updateItemQuantity(item, item.quantity - 1)"
                                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                                                <font-awesome-icon icon="minus" class="size-3" />
                                            </button>
                                            <input type="number" :value="item.quantity" @change="(e) =>
                                                updateItemQuantity(item, parseInt(e.target.value))
                                                " class="w-16 text-center p-2 border border-gray-300 rounded"
                                                min="1" />
                                            <button @click="updateItemQuantity(item, item.quantity + 1)"
                                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                                                <font-awesome-icon icon="plus" class="size-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td class="py-4 font-semibold">
                                        ${{
                                            (
                                                calculateDiscountedPrice(item.price, item.discount) *
                                                item.quantity
                                            ).toFixed(2)
                                        }}
                                    </td>
                                    <td class="py-4">
                                        <button @click="removeFromCart(item.id)"
                                            class="text-red-500 hover:text-red-700">
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
                                <p class="text-gray-600">${{ subtotal.toFixed(2) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Shipping</p>
                                <p class="text-gray-600">${{ shipping.toFixed(2) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Tax (5%)</p>
                                <p class="text-gray-600">${{ tax.toFixed(2) }}</p>
                            </div>
                            <div v-if="totalSavings > 0" class="flex justify-between text-green-600">
                                <p>Total Savings</p>
                                <p>-${{ totalSavings.toFixed(2) }}</p>
                            </div>
                            <div class="pt-3 border-t">
                                <div class="flex justify-between text-lg font-bold">
                                    <p>Total</p>
                                    <p>${{ total.toFixed(2) }}</p>
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
