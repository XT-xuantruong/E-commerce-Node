<template>
    <div @click="navigateToCategory(category.category_id)" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer
                    border-2 border-transparent hover:border-blue-600">
        <h3 class="text-lg text-blue-600 font-semibold text-center">{{ category.name }}</h3>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
})

console.log(props.category);

const navigateToCategory = (slug) => {
    router.push(`/category/${slug}`)
}
</script>