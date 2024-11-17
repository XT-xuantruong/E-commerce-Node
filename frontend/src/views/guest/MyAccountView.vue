<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab);
watch(
    () => route.query.tab,
    (newTab) => {
        activeTab.value = newTab || "profile";
    }
);

// Profile Data
const profileData = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null,
});

// Orders Data
const orders = ref([
    {
        id: "#ORD-2024-001",
        date: "2024-03-15",
        total: 129.99,
        status: "Delivered",
        items: [
            { name: "Product 1", quantity: 2, price: 49.99 },
            { name: "Product 2", quantity: 1, price: 30.01 },
        ],
    },
    {
        id: "#ORD-2024-002",
        date: "2024-03-10",
        total: 89.99,
        status: "Processing",
        items: [{ name: "Product 3", quantity: 1, price: 89.99 }],
    },
]);

// Notifications Settings
const notificationSettings = ref({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    newslatter: true,
});

// Wishlist Items
const wishlistItems = ref([
    {
        id: 1,
        name: "Premium Headphones",
        price: 199.99,
        image: "/api/placeholder/100/100",
        inStock: true,
    },
    {
        id: 2,
        name: "Wireless Mouse",
        price: 49.99,
        image: "/api/placeholder/100/100",
        inStock: false,
    },
]);

// Addresses
const addresses = ref([
    {
        id: 1,
        type: "Home",
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        isDefault: true,
    },
    {
        id: 2,
        type: "Office",
        name: "John Doe",
        street: "456 Business Ave",
        city: "New York",
        state: "NY",
        zip: "10002",
        isDefault: false,
    },
]);

// Form Handling
const handleProfileUpdate = async (event) => {
    event.preventDefault();
    // Implement profile update logic
    console.log("Updating profile:", profileData.value);
};

const handleNotificationUpdate = () => {
    // Implement notification settings update logic
    console.log("Updating notifications:", notificationSettings.value);
};

const removeFromWishlist = (itemId) => {
    wishlistItems.value = wishlistItems.value.filter(
        (item) => item.id !== itemId
    );
};

const addNewAddress = () => {
    // Implement add address logic
    console.log("Adding new address");
};

const removeAddress = (addressId) => {
    addresses.value = addresses.value.filter((addr) => addr.id !== addressId);
};

const setDefaultAddress = (addressId) => {
    addresses.value = addresses.value.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
    }));
};
// Method to set the active tab
function showTab(tabName) {
    activeTab.value = tabName;
    router.push({ query: { ...route.query, tab: tabName } });
}
</script>

<template>
    <DefaultLayout>
        <div class="container mx-auto flex mt-8">
            <!-- Sidebar for Tabs -->
            <div class="w-1/4 border-r pr-4">
                <h2 class="text-lg font-bold mb-4">Account Settings</h2>
                <ul class="space-y-2">
                    <li>
                        <button class="tab-link text-left w-full py-2 px-4 hover:bg-gray-200"
                            :class="{ 'bg-gray-200': activeTab === 'profile' }" @click="showTab('profile')">
                            <font-awesome-icon icon="id-card" class="mx-2 size-4" />
                            Profile
                        </button>
                    </li>
                    <li>
                        <button class="tab-link text-left w-full py-2 px-4 hover:bg-gray-200"
                            :class="{ 'bg-gray-200': activeTab === 'address' }" @click="showTab('address')">
                            <font-awesome-icon icon="map-marker-alt" class="mx-2 size-4" />
                            Address
                        </button>
                    </li>
                    <li>
                        <button class="tab-link text-left w-full py-2 px-4 hover:bg-gray-200"
                            :class="{ 'bg-gray-200': activeTab === 'notification' }" @click="showTab('notification')">
                            <font-awesome-icon icon="bell" class="text-gray-600 mx-2 size-4" />

                            Notifications
                        </button>
                    </li>
                    <li>
                        <button class="tab-link text-left w-full py-2 px-4 hover:bg-gray-200"
                            :class="{ 'bg-gray-200': activeTab === 'orders' }" @click="showTab('orders')">
                            <font-awesome-icon icon="clipboard-list" class="text-gray-600 mx-2 size-4" />
                            Orders
                        </button>
                    </li>
                    <li>
                        <button class="tab-link text-left w-full py-2 px-4 hover:bg-gray-200"
                            :class="{ 'bg-gray-200': activeTab === 'wishlist' }" @click="showTab('wishlist')">
                            <font-awesome-icon :icon="['far', 'heart']" class="mx-2 size-4" />
                            Wishlist
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Tab Content -->
            <div class="w-3/4 pl-4">
                <!-- Profile Tab -->
                <div v-show="activeTab === 'profile'" class="tab-content">
                    <h2 class="text-xl font-bold mb-4">Profile Information</h2>
                    <form @submit="handleProfileUpdate" class="space-y-6">
                        <div class="flex items-center space-x-6 mb-6">
                            <img :src="profileData.avatar || '/api/placeholder/100/100'" alt="Profile"
                                class="w-24 h-24 rounded-full object-cover" />
                            <button type="button" class="text-blue-500 hover:text-blue-600">
                                Change Photo
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">First Name</label>
                                <input type="text" v-model="profileData.firstName"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label class="block text-gray-700 font-medium mb-2">Last Name</label>
                                <input type="text" v-model="profileData.lastName"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label class="block text-gray-700 font-medium mb-2">Email</label>
                                <input type="email" v-model="profileData.email"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label class="block text-gray-700 font-medium mb-2">Phone</label>
                                <input type="tel" v-model="profileData.phone"
                                    class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                            Save Changes
                        </button>
                    </form>
                </div>

                <!-- Orders Tab -->
                <div v-show="activeTab === 'orders'" class="tab-content">
                    <h2 class="text-xl font-bold mb-4">My Orders</h2>
                    <div class="space-y-4">
                        <div v-for="order in orders" :key="order.id"
                            class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h3 class="font-medium">Order {{ order.id }}</h3>
                                    <p class="text-sm text-gray-500">{{ order.date }}</p>
                                </div>
                                <div class="flex items-center">
                                    <span :class="{
                                        'px-3 py-1 rounded-full text-sm': true,
                                        'bg-green-100 text-green-800':
                                            order.status === 'Delivered',
                                        'bg-blue-100 text-blue-800':
                                            order.status === 'Processing',
                                    }">
                                        {{ order.status }}
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div v-for="item in order.items" :key="item.name" class="flex justify-between text-sm">
                                    <span>{{ item.quantity }}x {{ item.name }}</span>
                                    <span>${{ item.price.toFixed(2) }}</span>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t flex justify-between items-center">
                                <span class="font-medium">Total: ${{ order.total.toFixed(2) }}</span>
                                <button class="text-blue-500 hover:text-blue-600">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notifications Tab -->
                <div v-show="activeTab === 'notification'" class="tab-content">
                    <h2 class="text-xl font-bold mb-4">Notification Preferences</h2>
                    <div class="space-y-6">
                        <div v-for="(value, key) in notificationSettings" :key="key"
                            class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium capitalize">
                                    {{ key.replace(/([A-Z])/g, " $1").trim() }}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    Receive notifications about {{ key.toLowerCase() }}
                                </p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="notificationSettings[key]" class="sr-only peer"
                                    @change="handleNotificationUpdate" />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500">
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Wishlist Tab -->
                <div v-show="activeTab === 'wishlist'" class="tab-content">
                    <h2 class="text-xl font-bold mb-4">My Wishlist</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="item in wishlistItems" :key="item.id" class="border rounded-lg p-4 flex space-x-4">
                            <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded" />
                            <div class="flex-1">
                                <h3 class="font-medium">{{ item.name }}</h3>
                                <p class="text-lg font-bold text-blue-600">
                                    ${{ item.price.toFixed(2) }}
                                </p>
                                <p class="text-sm" :class="item.inStock ? 'text-green-600' : 'text-red-600'">
                                    {{ item.inStock ? "In Stock" : "Out of Stock" }}
                                </p>
                                <div class="mt-2 space-x-2">
                                    <button class="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                                        :disabled="!item.inStock">
                                        Add to Cart
                                    </button>
                                    <button @click="removeFromWishlist(item.id)"
                                        class="text-red-500 hover:text-red-600 text-sm">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Addresses Tab -->
                <div v-show="activeTab === 'address'" class="tab-content">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">My Addresses</h2>
                        <button @click="addNewAddress"
                            class="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                            <PlusCircle class="w-5 h-5" />
                            <span>Add New Address</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="address in addresses" :key="address.id" class="border rounded-lg p-4 relative"
                            :class="{ 'border-blue-500': address.isDefault }">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <span class="inline-block px-2 py-1 mr-2 bg-gray-100 rounded text-sm">
                                        {{ address.type }}
                                    </span>
                                    <span v-if="address.isDefault"
                                        class="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                                        Default
                                    </span>
                                </div>
                                <div class="space-x-2">
                                    <button class="text-gray-500 hover:text-gray-700">
                                        Edit
                                    </button>
                                    <button @click="removeAddress(address.id)" class="text-red-500 hover:text-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <p class="font-medium">{{ address.name }}</p>
                                <p>{{ address.street }}</p>
                                <p>{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
                            </div>

                            <div class="mt-4 flex items-center" v-if="!address.isDefault">
                                <button @click="setDefaultAddress(address.id)"
                                    class="text-blue-500 hover:text-blue-600 text-sm">
                                    Set as Default
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
