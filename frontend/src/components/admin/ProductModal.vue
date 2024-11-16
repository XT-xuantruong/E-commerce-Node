<!-- ProductModal.vue -->
<template>
  <div>
    <!-- Modal Trigger Button -->
    <button
      type="button"
      @click="openModal"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Add Product
    </button>

    <!-- Modal Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      @click="closeModal"
    >
      <!-- Modal Content -->
      <div
        class="bg-white dark:bg-boxdark w-full max-w-3xl mx-4 rounded-lg shadow-lg"
        @click.stop
      >
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
                <label class="block text-sm font-medium mb-1"
                  >Product Code</label
                >
                <input
                  type="text"
                  v-model="productData.code"
                  required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter product code"
                />
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1"
                  >Product Name</label
                >
                <input
                  type="text"
                  v-model="productData.name"
                  required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Category</label>
                <select
                  v-model="productData.category"
                  required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                  <option value="" disabled>Select category</option>
                  <option value="phones">Phones</option>
                  <option value="laptop">Laptops</option>
                  <option value="tablet">Tablets</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Brand</label>
                <select
                  v-model="productData.brand"
                  required
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                  <option value="" disabled>Select brand</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="xiaomi">Xiaomi</option>
                  <option value="oppo">Oppo</option>
                </select>
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  v-model="productData.quantity"
                  required
                  min="1"
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter quantity"
                />
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  v-model="productData.price"
                  required
                  min="0"
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter price"
                />
              </div>
            </div>

            <!-- Product Images -->
            <div class="space-y-2">
              <label class="block text-sm font-medium">Thumbnail Image</label>
              <div class="flex items-center space-x-4">
                <div
                  class="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center relative"
                >
                  <img
                    v-if="productData.thumbnail"
                    :src="productData.thumbnail"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <input
                    type="file"
                    @change="handleThumbnailUpload"
                    accept="image/*"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    v-if="!productData.thumbnail"
                    class="text-center text-gray-500"
                  >
                    <i class="fas fa-upload mb-2"></i>
                    <p class="text-sm">Upload image</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description Images -->
            <div class="space-y-2">
              <label class="block text-sm font-medium"
                >Description Images</label
              >
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in productData.images"
                  :key="index"
                  class="relative"
                >
                  <img
                    :src="image"
                    class="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                <div
                  v-if="productData.images.length < 8"
                  class="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center relative"
                >
                  <input
                    type="file"
                    @change="handleImagesUpload"
                    accept="image/*"
                    multiple
                    class="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div class="text-center text-gray-500">
                    <i class="fas fa-plus mb-2"></i>
                    <p class="text-sm">Add images</p>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-500">Maximum 8 images</p>
            </div>

            <!-- Product Description -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-1"
                >Product Description</label
              >
              <textarea
                v-model="productData.description"
                rows="4"
                class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="Enter product description"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-4"
        >
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-50"
          >
            {{ isSubmitting ? 'Processing...' : 'Add Product' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['add-product'])

const isOpen = ref(false)
const isSubmitting = ref(false)

const productData = reactive({
  code: '',
  name: '',
  category: '',
  brand: '',
  quantity: 1,
  price: 0,
  thumbnail: '',
  images: [],
  description: '',
})

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(productData, {
    code: '',
    name: '',
    category: '',
    brand: '',
    quantity: 1,
    price: 0,
    thumbnail: '',
    images: [],
    description: '',
  })
}

const handleThumbnailUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      productData.thumbnail = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleImagesUpload = event => {
  const files = Array.from(event.target.files)
  const remainingSlots = 8 - productData.images.length

  files.slice(0, remainingSlots).forEach(file => {
    const reader = new FileReader()
    reader.onload = e => {
      productData.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = index => {
  productData.images.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // Add new product to the list
    emit('add-product', { ...productData })

    // Close modal and reset form
    closeModal()
  } catch (error) {
    console.error('Error adding product:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
