import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", () => {
  // Retrieve items from localStorage or initialize an empty array
  const items = ref(JSON.parse(localStorage.getItem("cartItems")) || []);

  // Computed property to get the total price
  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  // Add item to the cart
  function addItem(newItem) {
    const existingItem = items.value.find((item) => item.id === newItem.id);
    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      items.value.push({ ...newItem, quantity: newItem.quantity || 1 });
    }
  }

  function updateQuantity(itemId, quantity) {
    const item = items.value.find((item) => item.id === itemId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        removeItem(itemId);
      }
    }
  }
  // Remove item from the cart by ID
  function removeItem(itemId) {
    items.value = items.value.filter((item) => item.id !== itemId);
  }

  // Clear the cart
  function clearCart() {
    items.value = [];
  }

  // Watch for changes to the cart items and update localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem("cartItems", JSON.stringify(newItems));
    },
    { deep: true }
  );

  return { items, totalPrice, updateQuantity, addItem, removeItem, clearCart };
});
