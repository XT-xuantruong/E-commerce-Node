<template>
  <DefaultLayout>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Admin Management</h1>

      <div class="mb-8 p-6 rounded-lg shadow dark:bg-boxdark dark:text-white">
        <h2 class="text-xl font-semibold mb-4">Add Admin</h2>
        <form @submit.prevent="saveAdmin">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                v-model="admin.fullName"
                placeholder="Enter full name"
                class="w-full border rounded p-2 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium mb-1 dark:bg-boxdark dark:text-white"
                >Phone Number</label
              >
              <input
                type="text"
                v-model="admin.phoneNumber"
                placeholder="Enter phone number"
                class="w-full border rounded p-2 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                v-model="admin.email"
                placeholder="Enter email"
                class="w-full border rounded p-2 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                v-model="admin.username"
                placeholder="Enter username"
                class="w-full border rounded p-2 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium mb-1">Info</label>
              <textarea
                v-model="admin.info"
                placeholder="Enter additional information"
                class="w-full border rounded p-2 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                rows="3"
              ></textarea>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium mb-1">Avatar</label>
              <input
                type="file"
                @change="handleFileUpload"
                class="w-full border rounded p-2"
                accept="image/*"
              />
              <img
                v-if="admin.avatar"
                :src="admin.avatar"
                class="mt-2 h-20 w-20 rounded-full object-cover"
                alt="Preview"
              />
            </div>
          </div>

          <div class="mt-6">
            <h3 class="font-semibold mb-3">Permissions</h3>
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="category in permissionCategories"
                :key="category.name"
                class="p-4 rounded"
              >
                <h4 class="font-semibold mb-2">{{ category.name }}</h4>
                <div class="space-y-2">
                  <div
                    v-for="permission in category.permissions"
                    :key="permission.name"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      v-model="permission.selected"
                      :id="permission.name"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label :for="permission.name" class="ml-2 text-sm">
                      {{ permission.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex gap-4">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              Save Admin
            </button>
            <button
              type="button"
              @click="resetForm"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div
        class="bg-white p-6 rounded-lg shadow dark:bg-boxdark dark:text-white"
      >
        <h2 class="text-xl font-semibold mb-4">Admin List</h2>
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:bg-boxdark dark:text-white"
          >
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Avatar
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Full Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Permissions
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:text-white"
            >
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    :src="user.avatar"
                    :alt="user.fullName"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium">
                    {{ user.fullName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ user.username }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    {{ user.phoneNumber }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="permission in user.permissions"
                      :key="permission.name"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ permission.name }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="editUser(user)"
                    class="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    <svg
                      class="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                        fill=""
                      />
                      <path
                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <svg
                      class="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                        fill=""
                      />
                      <path
                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                        fill=""
                      />
                      <path
                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                        fill=""
                      />
                      <path
                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/admin/DefaultLayout.vue'
import { ref, reactive, onMounted } from 'vue'

const admin = reactive({
  fullName: '',
  phoneNumber: '',
  email: '',
  username: '',
  info: '',
  avatar: '',
})

// Permission categories
const permissionCategories = reactive([
  {
    name: 'Product Management',
    permissions: [
      { name: 'Create Product', selected: false },
      { name: 'Edit Product', selected: false },
      { name: 'Delete Product', selected: false },
      { name: 'View Products', selected: false },
    ],
  },
  {
    name: 'Order Management',
    permissions: [
      { name: 'View Orders', selected: false },
      { name: 'Edit Orders', selected: false },
      { name: 'Delete Orders', selected: false },
      { name: 'Process Orders', selected: false },
    ],
  },
  {
    name: 'User Management',
    permissions: [
      { name: 'View Users', selected: false },
      { name: 'Edit Users', selected: false },
      { name: 'Delete Users', selected: false },
      { name: 'Manage Roles', selected: false },
    ],
  },
])

// Demo users data
const users = ref([
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'vanan@example.com',
    phoneNumber: '0912345678',
    username: 'vanan',
    info: 'Quản lý sản phẩm chính',
    avatar: '/api/placeholder/40/40',
    permissions: [
      { name: 'Create Product' },
      { name: 'Edit Product' },
      { name: 'View Orders' },
    ],
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    email: 'ttbinh@example.com',
    phoneNumber: '0923456789',
    username: 'ttbinh',
    info: 'Quản lý đơn hàng',
    avatar: '/api/placeholder/40/40',
    permissions: [
      { name: 'View Orders' },
      { name: 'Edit Orders' },
      { name: 'Delete Orders' },
    ],
  },
  {
    id: 3,
    fullName: 'Lê Hoàng Công',
    email: 'hoangcong@example.com',
    phoneNumber: '0934567890',
    username: 'hoangcong',
    info: 'Quản trị viên cấp cao',
    avatar: '/api/placeholder/40/40',
    permissions: [
      { name: 'Create Product' },
      { name: 'Edit Product' },
      { name: 'Delete Product' },
      { name: 'View Orders' },
      { name: 'Edit Orders' },
      { name: 'Delete Orders' },
    ],
  },
  {
    id: 4,
    fullName: 'Phạm Thị Dung',
    email: 'phamdung@example.com',
    phoneNumber: '0945678901',
    username: 'phamdung',
    info: 'Quản lý sản phẩm',
    avatar: '/api/placeholder/40/40',
    permissions: [
      { name: 'Create Product' },
      { name: 'Edit Product' },
      { name: 'View Orders' },
    ],
  },
])

// File upload handler
const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      admin.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Save admin handler
const saveAdmin = () => {
  const selectedPermissions = permissionCategories.flatMap(category =>
    category.permissions
      .filter(permission => permission.selected)
      .map(permission => ({ name: permission.name })),
  )

  const adminData = {
    ...admin,
    permissions: selectedPermissions,
  }

  // Simulate API call
  console.log('Saving admin:', adminData)
  // In real application, you would make an API call here
  users.value.push({
    ...adminData,
    id: users.value.length + 1,
    avatar: admin.avatar || '/api/placeholder/40/40',
  })

  resetForm()
}

// Reset form
const resetForm = () => {
  Object.keys(admin).forEach(key => {
    admin[key] = ''
  })

  permissionCategories.forEach(category => {
    category.permissions.forEach(permission => {
      permission.selected = false
    })
  })
}

// Edit user
const editUser = user => {
  // Fill the form with user data
  Object.keys(admin).forEach(key => {
    admin[key] = user[key]
  })

  // Set permissions
  permissionCategories.forEach(category => {
    category.permissions.forEach(permission => {
      permission.selected = user.permissions.some(
        p => p.name === permission.name,
      )
    })
  })
}

// Delete user
const confirmDelete = user => {
  if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
    users.value = users.value.filter(u => u.id !== user.id)
  }
}

// Lifecycle hooks
onMounted(() => {
  // In real application, you would fetch users here
  console.log('Component mounted')
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
