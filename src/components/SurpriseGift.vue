<template>
    <div class="text-center my-2">
        <Button label="ของขวัญสุดพิเศษ ❤️" icon="pi pi-gift"
            class="p-button-rounded p-button-lg p-button-gradient shadow-lg px-5 py-3 pulse-animation"
            @click="showSurprise" />

        <Dialog v-model:visible="visible" modal header="Surprise! 🎉" :style="{ width: '90vw', maxWidth: '450px' }"
            class="custom-dialog" :draggable="false">
            <div class="text-center p-3">
                <div class="reward-image-container mb-4">
                    <img :src="airpod4" alt="Gift for you" class="img-fluid rounded-4 shadow" />
                </div>

                <h4 class="font-handwriting text-pink mb-2">เค้ามีของจะให้ด้วยนะ!</h4>
                <p class="text-muted mb-4 small">รอรับได้เลย ของกำลังเดินทางไปหาแล้วจ้าาาา </p>

                <a :href="shopeeTrackingUrl" target="_blank"
                    class="btn-shopee d-flex align-items-center justify-content-center gap-2">
                    <i class="pi pi-truck"></i>
                    ติดตามพัสดุ (Shopee)
                </a>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import confetti from 'canvas-confetti';
import airpod4 from '@/assets/apple-airpods4.webp';
const visible = ref(false);

const shopeeTrackingUrl = 'https://shopee.co.th/user/purchase/order/221756681269841?type=6';

const showSurprise = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff0000', '#ffa500', '#ffc0cb']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff0000', '#ffa500', '#ffc0cb']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // 2. แสดง Dialog
    visible.value = true;
};
</script>

<style scoped>
/* สไตล์ปุ่มแบบ Gradient ไล่สีชมพู */
.p-button-gradient {
    background: linear-gradient(45deg, #f687b3, #d53f8c) !important;
    border: none !important;
    transition: transform 0.3s ease;
}

.p-button-gradient:hover {
    transform: scale(1.05);
}

/* เอฟเฟกต์ปุ่มเต้นเบาๆ ดึงดูดสายตา */
.pulse-animation {
    animation: heartBeat 2s infinite;
}

.reward-image-container {
    position: relative;
    display: inline-block;
    padding: 10px;
    /* เอฟเฟกต์รูปเด้งขึ้นตอนเปิด */
    animation: zoomInAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.reward-image-container img {
    border: 8px solid white;
    max-height: 250px;
    object-fit: cover;
    /* เอฟเฟกต์ลอยขึ้นลงเบาๆ */
    animation: floaty 3s ease-in-out infinite;
    transition: transform 0.3s ease;
}

.reward-image-container img:hover {
    transform: rotate(3deg) scale(1.05);
}

/* เอฟเฟกต์แสงรัศมีด้านหลังรูป (Glow) */
.reward-image-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(213, 63, 140, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
    transform: translate(-50%, -50%);
    z-index: -1;
    animation: pulseGlow 2s ease-in-out infinite;
}

/* Animation: รูปเด้งขยายออกมา */
@keyframes zoomInAppear {
    0% {
        transform: scale(0) rotate(-10deg);
        opacity: 0;
    }

    70% {
        transform: scale(1.1) rotate(5deg);
    }

    100% {
        transform: scale(1) rotate(0);
        opacity: 1;
    }
}

/* Animation: รูปลอยเบาๆ */
@keyframes floaty {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-15px);
    }
}

/* Animation: แสงวิบวับรอบๆ */
@keyframes pulseGlow {

    0%,
    100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
    }
}

/* ตกแต่งปุ่ม Shopee ให้เด่นขึ้น */
.btn-shopee {
    background: linear-gradient(135deg, #ee4d2d 0%, #ff7337 100%);
    color: white;
    text-decoration: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(238, 77, 45, 0.4);
    transition: all 0.3s ease;
    border: none;
    margin-top: 10px;
}

.btn-shopee:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(238, 77, 45, 0.6);
    background: linear-gradient(135deg, #d73211 0%, #ee4d2d 100%);
    color: white;
}

@keyframes heartBeat {
    0% {
        transform: scale(1);
    }

    14% {
        transform: scale(1.1);
    }

    28% {
        transform: scale(1);
    }

    42% {
        transform: scale(1.1);
    }

    70% {
        transform: scale(1);
    }
}

/* สไตล์ปุ่ม Shopee */
.btn-shopee {
    background-color: #ee4d2d;
    /* สีส้ม Shopee */
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: bold;
    transition: background 0.3s ease;
}

.btn-shopee:hover {
    background-color: #d73211;
    color: white;
}

.text-pink {
    color: #d53f8c;
}

.reward-image-container img {
    border: 5px solid white;
}

/* ปรับแต่ง Dialog นิดหน่อย */
:deep(.p-dialog-header) {
    background: #fff5f7;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

:deep(.p-dialog-content) {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}
</style>