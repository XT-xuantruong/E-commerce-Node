<script setup>
import { ref, computed } from "vue";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

// Form validation schema
const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    address: yup.string().required("Address is required"),
    address2: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip code is required"),
    country: yup.string().required("Country is required"),
});

// Initial form values
const initialValues = {
    fullName: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
};

// Form handling with proper field registration
const { handleSubmit, resetForm, setFieldValue, values, errors } = useForm({
    validationSchema: schema,
    initialValues,
});

// Cart items data
const cartItems = ref([
    {
        id: 1,
        name: "Fresh Melon Juice",
        quantity: 1,
        price: 14.0,
        image: "/api/placeholder/50/50",
    },
    {
        id: 2,
        name: "Melon Juice Premium",
        quantity: 1,
        price: 12.0,
        image: "/api/placeholder/50/50",
    },
]);

// Computed values for order summary
const subtotal = computed(() => {
    return cartItems.value.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
});

const shipping = ref(5.0);
const taxRate = 0.05;
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const onSubmit = handleSubmit((values) => {
    console.log("Form submitted:", values);
    // Here you would typically make an API call to process the order
});

// Handle input changes
const handleInputChange = (field, event) => {
    setFieldValue(field, event.target.value);
};

// PayPal payment handling
const handlePayPalPayment = () => {
    console.log("Processing PayPal payment...");
};
</script>

<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6">Checkout</h1>

            <div class="flex flex-wrap lg:flex-nowrap gap-6">
                <!-- Checkout Form -->
                <div class="w-full lg:w-2/3">
                    <div class="bg-white p-6 shadow-lg rounded-lg">
                        <h2 class="text-xl font-bold mb-4">Shipping Address</h2>

                        <form @submit="onSubmit" class="space-y-4">
                            <!-- Full Name -->
                            <div>
                                <label for="fullName" class="block text-gray-700 font-bold mb-2">
                                    Full Name
                                </label>
                                <input :value="values.fullName" @input="handleInputChange('fullName', $event)"
                                    type="text" id="fullName"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    :class="{ 'border-red-500': errors.fullName }" placeholder="Enter your full name" />
                                <p v-if="errors.fullName" class="mt-1 text-red-500 text-sm">
                                    {{ errors.fullName }}
                                </p>
                            </div>

                            <!-- Email -->
                            <div>
                                <label for="email" class="block text-gray-700 font-bold mb-2">
                                    Email
                                </label>
                                <input :value="values.email" @input="handleInputChange('email', $event)" type="email"
                                    id="email"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    :class="{ 'border-red-500': errors.email }" placeholder="Enter your email" />
                                <p v-if="errors.email" class="mt-1 text-red-500 text-sm">
                                    {{ errors.email }}
                                </p>
                            </div>

                            <!-- Address fields -->
                            <div class="space-y-4">
                                <div>
                                    <label for="address" class="block text-gray-700 font-bold mb-2">
                                        Address Line 1
                                    </label>
                                    <input :value="values.address" @input="handleInputChange('address', $event)"
                                        type="text" id="address"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.address }"
                                        placeholder="Street address or P.O. Box" />
                                    <p v-if="errors.address" class="mt-1 text-red-500 text-sm">
                                        {{ errors.address }}
                                    </p>
                                </div>

                                <div>
                                    <label for="address2" class="block text-gray-700 font-bold mb-2">
                                        Address Line 2 (Optional)
                                    </label>
                                    <input :value="values.address2" @input="handleInputChange('address2', $event)"
                                        type="text" id="address2"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Apartment, suite, unit, etc." />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="city" class="block text-gray-700 font-bold mb-2">
                                            City
                                        </label>
                                        <input :value="values.city" @input="handleInputChange('city', $event)"
                                            type="text" id="city"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.city }" placeholder="City" />
                                        <p v-if="errors.city" class="mt-1 text-red-500 text-sm">
                                            {{ errors.city }}
                                        </p>
                                    </div>

                                    <div>
                                        <label for="state" class="block text-gray-700 font-bold mb-2">
                                            State/Province
                                        </label>
                                        <input :value="values.state" @input="handleInputChange('state', $event)"
                                            type="text" id="state"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.state }" placeholder="State/Province" />
                                        <p v-if="errors.state" class="mt-1 text-red-500 text-sm">
                                            {{ errors.state }}
                                        </p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="zip" class="block text-gray-700 font-bold mb-2">
                                            Zip Code
                                        </label>
                                        <input :value="values.zip" @input="handleInputChange('zip', $event)" type="text"
                                            id="zip"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.zip }" placeholder="Zip/Postal Code" />
                                        <p v-if="errors.zip" class="mt-1 text-red-500 text-sm">
                                            {{ errors.zip }}
                                        </p>
                                    </div>

                                    <div>
                                        <label for="country" class="block text-gray-700 font-bold mb-2">
                                            Country
                                        </label>
                                        <input :value="values.country" @input="handleInputChange('country', $event)"
                                            type="text" id="country"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.country }" placeholder="Country" />
                                        <p v-if="errors.country" class="mt-1 text-red-500 text-sm">
                                            {{ errors.country }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="w-full lg:w-1/3">
                    <div class="bg-white p-6 shadow-lg rounded-lg">
                        <h2 class="text-xl font-bold mb-4">Order Summary</h2>

                        <!-- Cart Items -->
                        <div class="space-y-4 mb-6">
                            <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <img :src="item.image" :alt="item.name"
                                        class="w-12 h-12 object-cover rounded mr-4" />
                                    <div>
                                        <p class="text-gray-700 font-bold">{{ item.name }}</p>
                                        <p class="text-gray-500">Quantity: {{ item.quantity }}</p>
                                    </div>
                                </div>
                                <p class="text-gray-700">${{ item.price.toFixed(2) }}</p>
                            </div>
                        </div>

                        <!-- Order Details -->
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between">
                                <p class="text-gray-600">Subtotal</p>
                                <p class="text-gray-600">${{ subtotal.toFixed(2) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Shipping</p>
                                <p class="text-gray-600">${{ shipping.toFixed(2) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Tax</p>
                                <p class="text-gray-600">${{ tax.toFixed(2) }}</p>
                            </div>
                        </div>

                        <hr class="my-4" />

                        <div class="flex justify-between text-lg font-bold mb-6">
                            <p>Total</p>
                            <p>${{ total.toFixed(2) }}</p>
                        </div>

                        <!-- Payment Section -->
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <p class="text-gray-600">Payment Method</p>
                                <p class="text-gray-700 font-bold">PayPal</p>
                            </div>

                            <button @click="handlePayPalPayment"
                                class="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex justify-center items-center space-x-2">
                                <span>Pay with PayPal</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
