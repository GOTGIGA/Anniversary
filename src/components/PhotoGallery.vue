<template>
    <div class="text-center mb-5">
        <p class="text-muted text-decoration-underline mb-4 memory-title fs-4">
            ความทรงจำของเรา
        </p>

        <div class="d-flex justify-content-center flex-wrap gap-4 card-scene">
            <div v-for="(photo, index) in photoList" :key="index" class="photo-container"
                :class="['tilt-' + (index % 3 + 1), { 'is-flipped': photo.isFlipped }]">

                <div class="card-inner">
                    <div class="card-front polaroid-frame">
                        <p-image :src="photo.path" alt="Our memory" preview imageClass="memory-img" :pt="{
                            toolbar: {
                                class: 'start-50  d-flex justify-content-center ',
                                style: 'top: 90vh; left: 50%; transform: translateX(-50%);'
                            }
                        }" />

                        <button class="flip-btn" @click.stop="toggleFlip(index)">
                            <i class="pi pi-sync"></i>
                        </button>
                    </div>

                    <div class="card-back d-flex align-items-center justify-content-center">
                        <div class="back-content">
                            <span class="back-emoji">{{ photo.emoji }}</span>
                            <p class="back-text">{{ photo.desc }}</p>
                        </div>

                        <button class="flip-btn" @click.stop="toggleFlip(index)">
                            <i class="pi pi-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PImage from 'primevue/image';
import photo1 from '@/assets/IMG_20241116_063645.jpg';
import photo2 from '@/assets/IMG_20250213_114505.jpg';
import photo3 from '@/assets/image3.jpg';
import photo4 from '@/assets/image4.jpg';
import photo5 from '@/assets/Graduation.jpg';
import photo6 from '@/assets/Graduation2.jpg';
import photo7 from '@/assets/image7.jpg'
const photoList = ref([
    { emoji: '🏝️🌊', desc: 'เกาะช้างงงง', path: photo1, isFlipped: false },
    { emoji: '🏝️🌊', desc: 'เกาะกูด มันกูดมากตอนมีเธอ', path: photo2, isFlipped: false },
    { emoji: '🏝️🌊', desc: 'ตกหลุมรักภาพนี้มาก ❤️', path: photo3, isFlipped: false },
    { emoji: '🏝️🌊', desc: 'เกาะล้านนน', path: photo4, isFlipped: false },
    { emoji: '🎓', desc: 'ปริญญาใจ', path: photo5, isFlipped: false },
    { emoji: '🎓', desc: 'ปริญญาใจ', path: photo6, isFlipped: false },
    { emoji: '❤️', desc: 'สมัยรุ่นๆ เลยนะน้องง', path: photo7, isFlipped: false },
]);

const toggleFlip = (index) => {
    photoList.value[index].isFlipped = !photoList.value[index].isFlipped;
};
</script>

<style scoped>
.card-scene {
    perspective: 1000px;
}

.photo-container {
    width: 160px;
    height: 200px;
    position: relative;
    transition: transform 0.5s ease;
    transform-style: preserve-3d;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
}

.is-flipped .card-inner {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
}

.card-back {
    transform: rotateY(180deg);
    background: #fff5f7;
    justify-content: center;
    align-items: center;
    border: 1px solid #fed7e2;
}

.flip-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(237, 100, 166, 0.1);
    color: #ed64a6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 10;
}

.flip-btn:hover {
    background: #ed64a6;
    color: white;
    transform: scale(1.1);
}

.back-emoji {
    font-size: 2rem;
}

.back-text {
    font-size: 1rem;
    color: #ed64a6;
    margin-top: 5px;
}

:deep(.memory-img) {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 2px;
}

.tilt-1 {
    transform: rotate(-2deg);
}

.tilt-2 {
    transform: rotate(3deg);
}

.tilt-3 {
    transform: rotate(-1.5deg);
}

.photo-container:hover {
    z-index: 1001;
}
</style>