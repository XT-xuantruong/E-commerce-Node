<template>
  <div>
    <!-- Modal Trigger Button -->
    <button type="button" @click="openModal"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
      Add Product
    </button>

    <!-- Modal Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      @click="closeModal">
      <!-- Modal Content -->
      <div class="bg-white dark:bg-boxdark w-full max-w-3xl mx-4 rounded-lg shadow-lg" @click.stop>
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Product
          </h3>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Product Name</label>
                <input type="text" v-model="productData.name" required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter product name" />
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Category</label>
                <select v-model="productData.category_id" required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white">
                  <option value="">Chọn danh mục</option>
                  <option v-for="category in categories" :value="category.category_id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" v-model="productData.stock" required min="1"
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter quantity" />
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Price</label>
                <input type="number" v-model="productData.price" required min="0"
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter price" />
              </div>
            </div>

            <!-- Product Images -->
            <div class="space-y-2">
              <label class="block text-sm font-medium">Product Images</label>
              <div>
                <input type="file" accept="image/*" multiple @change="handleImagesUpload"
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none dark:text-gray-400 dark:bg-meta-4 dark:border-strokedark dark:placeholder-gray-500" />
              </div>

              <!-- Preview các ảnh đã chọn -->
              <div class="flex flex-wrap gap-4 mt-4">
                <div v-for="(image, index) in imagePreviews" :key="index"
                  class="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img :src="image" class="w-full h-full object-cover" />
                  <button @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Product Description -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-1">Product Description</label>
              <textarea v-model="productData.description" rows="4"
                class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="Enter product description"></textarea>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-4">
          <button @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button @click="handleSubmit" :disabled="isSubmitting"
            class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-50">
            {{ isSubmitting ? "Processing..." : "Add Product" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import categoryServices from '@/services/categoryServices';

const emit = defineEmits(["add-product"]);

const isOpen = ref(false);
const isSubmitting = ref(false);
const categories = ref([]);

const productData = reactive({
  name: "",
  category_id: "",
  stock: 1,
  price: 0,
  images: [], // Lưu file gốc
  description: "",
});


const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(productData, {
    name: "",
    category_id: "",
    stock: 1,
    price: 0,
    images: [],
    description: "",
  });
};

const handleImagesUpload = (event) => {
  const files = event.target.files;
  if (files && files.length) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        productData.images.push(e.target.result); // Lưu URL preview
      };
      reader.readAsDataURL(file);
    });
  }
};

const removeImage = (index) => {
  productData.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!productData.name || !productData.category_id || !productData.stock || !productData.price) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    isSubmitting.value = true;
    emit("add-product", { ...productData });
    closeModal();
  } catch (error) {
    console.error("Error adding product:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const fetchCategory = async () => {
  try {
    const response = await categoryServices.gets();
    categories.value = response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
  }
};

onBeforeMount(() => {
  fetchCategory();
});
</script>