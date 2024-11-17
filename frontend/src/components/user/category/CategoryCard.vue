<template>
    <div @click="navigateToCategory(category.slug)" class="relative rounded-lg overflow-hidden cursor-pointer group">
        <img :src="category.image" :alt="category.name"
            class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200">
        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h3 class="text-white font-semibold text-lg">{{ category.name }}</h3>
        </div>
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

const navigateToCategory = (slug) => {
    router.push(`/category/${slug}/`)
}
</script>