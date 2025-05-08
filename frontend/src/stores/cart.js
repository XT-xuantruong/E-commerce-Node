import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  persist: {
    enabled: true,
    strategies: [
      {
        key: "cart",
        storage: localStorage,
      },
    ],
  },
  state: () => ({
    items: [],
  }),
  getters: {
    totalPrice(state) {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  actions: {
    addItem(newItem) {
      const existingItem = this.items.find((item) => String(item._id) === String(newItem._id));
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        this.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
    },
    updateQuantity(itemId, quantity) {
      const id = String(itemId); // Chuẩn hóa kiểu dữ liệu
      console.log(`Updating quantity for item ${id} to ${quantity}`);
      const item = this.items.find((item) => String(item._id) === id);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          console.log(`Quantity is 0, removing item ${id}`);
          this.removeItem(id);
        }
      } else {
        console.error(`Item with id ${id} not found in cart`);
      }
    },
    removeItem(itemId) {
      const id = String(itemId); // Chuẩn hóa kiểu dữ liệu
      console.log(`Removing item ${id}`);
      const initialLength = this.items.length;
      this.items = this.items.filter((item) => String(item._id) !== id);
      if (this.items.length === initialLength) {
        console.error(`Item with id ${id} not found in cart for removal`);
      }
    },
    clearCart() {
      this.items = [];
    },
  },
});