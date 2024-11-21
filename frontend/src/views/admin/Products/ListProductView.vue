<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/admin/DefaultLayout.vue'
import productServices from '@/services/productServices'
import categoryServices from '@/services/categoryServices'
import Pagination from '@/components/user/pagination/Pagination.vue';

const products = ref([])
const categories = ref([])

const route = useRoute()
const router = useRouter()
const isEditModalOpen = ref(false)
const selectedProduct = ref(null)
const isSubmitting = ref(false)
const itemsPerPage = ref(5);
const currentPage = ref(parseInt(route.params.query) || 1);
const totalPages = ref(0);
const fetchProduct = async () => {
  await productServices.gets({
    limit: itemsPerPage.value,
    page: currentPage.value - 1,
  })
    .then(response => {
      products.value = response.data.data
      totalPages.value = response.data.totalPage
    })
    .catch(error => {
      console.error(error)
    })
}
const fetchCategory = async () => {
  await categoryServices.gets()
    .then(response => {
      categories.value = response.data.data
    })
    .catch(error => {
      console.error(error)
    })
}
onBeforeMount(() => {
  fetchProduct()
  fetchCategory()
})
const findcategory = (id) => {
  return categories.value.find(c => c._id == id).title
}
const openEditModal = product => {
  selectedProduct.value = { ...product }
  isEditModalOpen.value = true
}

const handleUpdateProduct = async () => {
  try {
    isSubmitting.value = true
    productServices.update(selectedProduct.value).catch(e => {
      console.log(e);
    })
    isEditModalOpen.value = false
  } catch (error) {
    console.error('Error updating product:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleThumbnailUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      selectedProduct.value.thumbnail = e.target.result
      selectedProduct.value.imageSrc = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleImagesUpload = event => {
  const files = Array.from(event.target.files)
  const remainingSlots = 8 - selectedProduct.value.images.length

  files.slice(0, remainingSlots).forEach(file => {
    const reader = new FileReader()
    reader.onload = e => {
      selectedProduct.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = index => {
  selectedProduct.value.images.splice(index, 1)
}

const deleteProduct = async (product) => {
  productServices.delete(product._id)
}

const handlePageChange = (page) => {
  currentPage.value = page;
  router.push({
    name: "listproduct",
    query: { ...route.query, page }
  });
};

watch(
  () => [route.query.page],
  async ([newPage]) => {
    if (newPage) {
      currentPage.value = parseInt(newPage);
      await fetchProduct();
    }
  },
  { immediate: true }
);
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="py-6 px-2 md:px-6 xl:px-7.5">
          <h4 class="text-xl font-bold text-black dark:text-white">Products</h4>
        </div>

        <div
          class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
          <div class="col-span-3 flex items-center">
            <p class="font-medium">Product Name</p>
          </div>
          <div class="col-span-2 hidden items-center sm:flex">
            <p class="font-medium">Category</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="font-medium">Price</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="font-medium">Amount</p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="font-medium">Actions</p>
          </div>
        </div>

        <div v-for="product in products" :key="product._id"
          class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
          <!-- Previous table rows code remains the same -->
          <div class="col-span-3 flex items-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="h-12.5 w-15 rounded-md">
                <img :src="product.image" :alt="`Product`" />
              </div>
              <p class="text-sm font-medium text-black dark:text-white">
                {{ product.name }}
              </p>
            </div>
          </div>
          <div class="col-span-2 hidden items-center sm:flex">
            <p class="text-sm font-medium text-black dark:text-white">
              {{ findcategory(product.category) }}
            </p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">
              ${{ product.price }}
            </p>
          </div>
          <div class="col-span-1 flex items-center">
            <p class="text-sm font-medium text-black dark:text-white">
              {{ product.countInStock }}
            </p>
          </div>

          <div class="col-span-1 flex items-center">
            <div class="flex items-center space-x-3.5">
              <button class="text-yellow-600 hover:text-yellow-900" @click="openEditModal(product)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                    fill="" />
                  <path
                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                    fill="" />
                </svg>
              </button>
              <button class="text-red-600 hover:text-red-900" @click="deleteProduct(product)">
                <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                    fill="" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <Pagination v-if="totalPages > 1" :total-page="totalPages" :current-page="currentPage" :max-visible-pages="5"
            @page-changed="handlePageChange" />
        </div>
      </div>

      <!-- Enhanced Edit Modal -->
      <div v-if="isEditModalOpen && selectedProduct"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div class="bg-white dark:bg-boxdark w-full max-w-3xl mx-4 rounded-lg shadow-lg" @click.stop>
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Product
            </h3>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div class="space-y-4">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="block text-sm font-medium mb-1">Product Name</label>
                  <input type="text" v-model="selectedProduct.name" required
                    class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    placeholder="Enter product name" />
                </div>

                <div class="form-control">
                  <label class="block text-sm font-medium mb-1">Category</label>
                  <select v-model="selectedProduct.category" required
                    class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white">
                    <option value="" disabled>Select category</option>
                    <option v-for="category in categories" :value="category._id">{{ category.title }}</option>
                    <!-- <option value="laptop">Laptops</option>
                    <option value="tablet">Tablets</option>
                    <option value="accessories">Accessories</option> -->
                  </select>
                </div>

                <!-- <div class="form-control">
                  <label class="block text-sm font-medium mb-1">Brand</label>
                  <select v-model="selectedProduct.brand" required
                    class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white">
                    <option value="" disabled>Select brand</option>
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="xiaomi">Xiaomi</option>
                    <option value="oppo">Oppo</option>
                  </select>
                </div> -->

                <div class="form-control">
                  <label class="block text-sm font-medium mb-1">Quantity</label>
                  <input type="number" v-model="selectedProduct.countInStock" required min="1"
                    class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    placeholder="Enter quantity" />
                </div>

                <div class="form-control">
                  <label class="block text-sm font-medium mb-1">Price</label>
                  <input type="number" v-model="selectedProduct.price" required min="0"
                    class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    placeholder="Enter price" />
                </div>
              </div>

              <!-- Product Images -->
              <div class="space-y-2">
                <label class="block text-sm font-medium">Thumbnail Image</label>
                <div class="flex items-center space-x-4">
                  <div class="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center relative">
                    <img v-if="selectedProduct.image" :src="selectedProduct.image"
                      class="w-full h-full object-cover rounded-lg" />
                    <input type="file" @change="handleThumbnailUpload" accept="image/*"
                      class="absolute inset-0 opacity-0 cursor-pointer" />
                    <div v-if="!selectedProduct.image" class="text-center text-gray-500">
                      <i class="fas fa-upload mb-2"></i>
                      <p class="text-sm">Upload image</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description Images -->
              <!-- <div class="space-y-2">
                <label class="block text-sm font-medium">Description Images</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="(image, index) in selectedProduct.images" :key="index" class="relative">
                    <img :src="image" class="w-full h-24 object-cover rounded-lg" />
                    <button @click="removeImage(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ×
                    </button>
                  </div>
                  <div v-if="selectedProduct.images.length < 8"
                    class="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center relative">
                    <input type="file" @change="handleImagesUpload" accept="image/*" multiple
                      class="absolute inset-0 opacity-0 cursor-pointer" />
                    <div class="text-center text-gray-500">
                      <i class="fas fa-plus mb-2"></i>
                      <p class="text-sm">Add images</p>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-500">Maximum 8 images</p>
              </div> -->

              <!-- Product Description -->
              <div class="form-control">
                <label class="block text-sm font-medium mb-1">Product Description</label>
                <textarea v-model="selectedProduct.description" rows="4"
                  class="w-full p-2 border rounded focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Enter product description"></textarea>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-4">
            <button @click="isEditModalOpen = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Cancel
            </button>
            <button @click="handleUpdateProduct" :disabled="isSubmitting"
              class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-50">
              {{ isSubmitting ? 'Processing...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
