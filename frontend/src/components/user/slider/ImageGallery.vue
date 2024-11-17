<template>
    <div class="image-gallery flex flex-col justify-center items-center">
        <!-- Main Image Display with Fixed Size -->
        <div class="main-image-wrapper">
            <img :src="currentImage" alt="Main Product Image" class="main-image" />
        </div>

        <!-- Thumbnail Images with Next/Prev buttons -->
        <div class="thumbnails flex items-center mt-4 space-x-2">
            <!-- Prev Button -->
            <button @click="prevThumbnails" class="text-gray-500 hover:text-gray-900 p-1" :disabled="startIndex === 0">
                <font-awesome-icon icon="chevron-left" />
            </button>

            <!-- Thumbnails Display -->
            <div class="flex space-x-2 overflow-hidden">
                <div v-for="(image, index) in visibleThumbnails" :key="index" :class="[
                    'thumbnail',
                    index + startIndex === currentIndex ? 'border border-red-500' : '',
                ]" @click="selectImage(index + startIndex)">
                    <img :src="image" alt="Thumbnail" class="thumbnail-image" />
                </div>
            </div>

            <!-- Next Button -->
            <button @click="nextThumbnails" class="text-gray-500 hover:text-gray-900 p-1"
                :disabled="startIndex + thumbnailsToShow >= images.length">
                <font-awesome-icon icon="chevron-right" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, defineProps } from "vue";

const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
});

const currentIndex = ref(0);
const currentImage = ref(props.images[0]);
let interval = null;

// Thumbnails display settings
const startIndex = ref(0);
const thumbnailsToShow = 5; // Show 5 thumbnails at a time

const visibleThumbnails = computed(() =>
    props.images.slice(startIndex.value, startIndex.value + thumbnailsToShow)
);

function selectImage(index) {
    currentIndex.value = index;
    currentImage.value = props.images[index];
}

function startAutoSlide() {
    interval = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % props.images.length;
        currentImage.value = props.images[currentIndex.value];
    }, 5000); // Change image every 5 seconds
}

function nextThumbnails() {
    if (startIndex.value + thumbnailsToShow < props.images.length) {
        startIndex.value += 1;
    }
}

function prevThumbnails() {
    if (startIndex.value > 0) {
        startIndex.value -= 1;
    }
}

onMounted(() => {
    startAutoSlide();
});

onBeforeUnmount(() => {
    clearInterval(interval);
});
</script>

<style scoped>
/* Main Image Styles */
.main-image-wrapper {
    width: 400px;
    /* Fixed width */
    height: 320px;
    /* Fixed height */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin: auto;
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Maintain aspect ratio and fill the box */
    transition: transform 0.3s ease-in-out;
}

/* Thumbnail Styles */
.thumbnail {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    transition: border 0.2s ease;
}

.thumbnail-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 0.3s ease;
}

.thumbnail-image:hover {
    transform: scale(1.05);
    border: 2px solid red;
}
</style>
