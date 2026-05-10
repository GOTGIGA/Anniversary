<template>
    <div class="text-center mb-5">
        <div class="memory-heading-row d-flex justify-content-center align-items-center flex-wrap gap-2 gap-md-3 mb-4">
            <span class="text-muted text-decoration-underline memory-title fs-4">
                ความทรงจำของเรา
            </span>
            <router-link
                to="/gallery-admin"
                class="gallery-admin-link"
                aria-label="จัดการแกลเลอรี่"
            >
                <i class="pi pi-cog"></i>
            </router-link>
        </div>

        <div v-if="loadError" class="text-danger small mb-3">
            {{ loadErrorMessage }}
        </div>
        <div v-else-if="loading" class="text-muted py-5">
            <i class="pi pi-spin pi-spinner fs-3"></i>
            <p class="mt-2 mb-0">กำลังโหลดความทรงจำ...</p>
        </div>
        <div v-else-if="photoList.length === 0" class="text-muted py-4">
            ยังไม่มีรูปที่เลือกแสดงหน้าหลัก — ไปที่หน้าจัดการแกลเลอรี่แล้วติ๊ก "แสดงหน้าหลัก"
        </div>

        <div v-else class="d-flex justify-content-center flex-wrap gap-4 card-scene">
            <div
                v-for="(photo, index) in photoList"
                :key="`${photo.galleryId}_${photo.photoId}`"
                class="photo-container"
                :class="['tilt-' + ((index % 3) + 1), { 'is-flipped': photo.isFlipped }]"
            >
                <div class="card-inner">
                    <div class="card-front polaroid-frame">
                        <p-image
                            :src="photo.path"
                            alt="Our memory"
                            preview
                            imageClass="memory-img"
                            :pt="{
                                toolbar: {
                                    class: 'start-50  d-flex justify-content-center ',
                                    style: 'top: 90vh; left: 50%; transform: translateX(-50%);',
                                },
                            }"
                        />

                        <button class="flip-btn" type="button" @click.stop="toggleFlip(photo)">
                            <i class="pi pi-sync"></i>
                        </button>
                    </div>

                    <div class="card-back d-flex align-items-center justify-content-center">
                        <div class="back-content">
                            <span class="back-emoji">{{ photo.emoji }}</span>
                            <p class="back-text">{{ photo.desc }}</p>
                        </div>

                        <button class="flip-btn" type="button" @click.stop="toggleFlip(photo)">
                            <i class="pi pi-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PImage from 'primevue/image';
import { fetchHomeGalleryPhotos } from '@/services/galleryService.js';

const photoList = ref([]);
const loading = ref(true);
const loadError = ref(false);
const loadErrorMessage = ref('');

function formatGalleryLoadError(e) {
    const code = e?.code || '';
    const msg = String(e?.message || e || '');
    if (!import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim()) {
        return 'ไม่พบ VITE_FIREBASE_DATABASE_URL — ตั้งใน .env / .env.production หรือ GitHub Secrets แล้ว build ใหม่';
    }
    if (!import.meta.env.VITE_FIREBASE_API_KEY?.trim()) {
        return 'ไม่พบ VITE_FIREBASE_API_KEY — ตั้งค่า Firebase Web App ให้ครบแล้ว build ใหม่';
    }
    if (code === 'PERMISSION_DENIED' || msg.includes('permission_denied')) {
        return 'Firebase ปฏิเสธการอ่านข้อมูล — ตรวจ Realtime Database Rules ให้ galleryPhotos อ่านได้แบบสาธารณะ (.read: true)';
    }
    return `โหลดรูปไม่สำเร็จ — ${msg || 'ตรวจการเชื่อมต่อและค่า VITE_FIREBASE_*'}`;
}

onMounted(async () => {
    loading.value = true;
    loadError.value = false;
    loadErrorMessage.value = '';
    try {
        photoList.value = await fetchHomeGalleryPhotos();
    } catch (e) {
        console.error('PhotoGallery load error:', e);
        loadError.value = true;
        loadErrorMessage.value = formatGalleryLoadError(e);
        photoList.value = [];
    } finally {
        loading.value = false;
    }
});

const toggleFlip = (photo) => {
    photo.isFlipped = !photo.isFlipped;
};
</script>

<style scoped>
.memory-heading-row {
    justify-content: center;
}

.gallery-admin-link {
    display: inline-block;
    font-size: 0.7rem;
    font-style: normal;
    color: rgba(213, 63, 140, 0.35);
    text-decoration: none;
    letter-spacing: 0.02em;
    flex-shrink: 0;
}

.gallery-admin-link:hover {
    color: rgba(213, 63, 140, 0.55);
    text-decoration: underline;
}

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
