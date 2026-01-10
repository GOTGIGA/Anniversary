<template>
    <div class="d-flex align-items-center justify-content-center">
        <div class="card glass-card p-4 p-md-5 text-center shadow-lg border-0 mx-3">
            <div class="mb-4">
                <span class="display-1">❤️</span>
            </div>
            <h2 class="font-handwriting text-pink mb-3">จำได้ไหมว่า...</h2>
            <p class="text-muted mb-4">เราเริ่มคบกันวันที่เท่าไหร่กันน้าาา ?</p>
            <div class="mb-4">
                <DatePicker input-class="form-control text-center" v-model="selectedDate" dateFormat="dd MM yy"
                    placeholder="เลือกวันที่ของเรา" class="w-100" :touchUI="true" />
            </div>

            <Button label="ยืนยันคำตอบ ❤️" class="p-button-rounded p-button-pink w-100 py-3 shadow"
                @click="checkAnswer" />

            <transition name="fade">
                <p v-if="error" class="text-danger mt-3 small">{{ errorValue }}
                </p>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAnniversaryStore } from '@/stores/Anniversary';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import moment from 'moment';

const store = useAnniversaryStore()
const router = useRouter();
const selectedDate = ref(null);
const error = ref(false);
const errorCount = ref(0);
const errorMassage = ref([{ num: 1, massage: 'คำตอบไม่ถูกนะ ( อย่าให้มีครั้งที่ 2 )' }, { num: 2, massage: 'คำตอบไม่ถูกนะ ( อย่าให้มีครั้งที่ 3 )' }, { num: 3, massage: 'คำตอบไม่ถูกนะ ( ครั้งที่ 4 นี่ไม่ควร )' }])

const errorValue = computed(() => {
    if (errorCount.value) {
        if (errorMassage.value.find(a => a.num == errorCount.value)?.massage) {
            return errorMassage.value.find(a => a.num == errorCount.value).massage
        } else {
            return 'คำตอบไม่ถูกต้อง จุ๊บหลายๆทีเพื่อขอคำตอบ'
        }
    } else {
        return 'เลือกคำตอบก่อนน้องสาวววว'

    }
})
const checkAnswer = () => {
    if (selectedDate.value) {
        if (moment(selectedDate.value).format('DD/MM/YYYY') === moment(store.getANVDate).format('DD/MM/YYYY')) {
            router.push('/home');
        } else {
            error.value = true;
            errorCount.value++
            setTimeout(() => error.value = false, 5000);
        }
    } else {
        error.value = true;
    }
};
</script>

<style scoped>
.glass-card {
    max-width: 500px;
    min-width: 40vw;
    /* ปรับให้โปร่งแสงขึ้นเล็กน้อยเพื่อให้เข้ากับพื้นหลังหลัก */
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.text-pink {
    color: #d53f8c;
}

.p-button-pink {
    background: #ed64a6;
    border: none;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.p-button-pink:hover {
    background: #ed64a6 !important;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(255, 87, 168, 0.532);
}

.p-button-pink:active {
    transform: translateY(-1px);
}

/* CSS สำหรับหัวใจเต้น (Heartbeat) */
.display-1 {
    display: inline-block;
    animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>