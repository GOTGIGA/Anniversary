<template>
    <div class="text-center">
        <Button v-if="!isOpen" label="กดตรงนี้สิ" icon="pi pi-heart"
            class="p-button-rounded p-button-lg p-button-pink shadow-lg px-5 py-3" @click="handleOpen" />

        <div v-else ref="letterRef" class="card border-0 glass-card p-4 text-start mt-4 shadow-sm animate-fade">
            <h3 class="font-handwriting text-pink mb-3">ถึง คนเก่งของเค้า...</h3>
            <p class="text-dark opacity-75">
                ขอบคุณที่อยู่ข้างกันมาตลอดนะ ขอบคุณที่คอยเป็นกำลังใจให้ในทุกๆ เรื่อง
                อยากบอกว่ารักเธอมากๆ และจะรักให้มากขึ้นในทุกๆ วันที่ผ่านไปเลย
                ขอให้เรามีกันแบบนี้ไปนานๆ นะ
            </p>
            <div class="text-end font-handwriting fs-2 text-pink">- รักที่สุดเลย -</div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import Button from 'primevue/button';
import confetti from 'canvas-confetti';

const isOpen = ref(false);
const letterRef = ref(null);

const handleOpen = async () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    isOpen.value = true;
    await nextTick();
    letterRef.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.p-button-pink {
    background-color: #ed64a6 !important;
    border-color: #ed64a6 !important;
}

.p-button-pink:hover {
    background-color: #d53f8c !important;
}

.text-pink {
    color: #d53f8c;
}

.glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
}

.animate-fade {
    animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>