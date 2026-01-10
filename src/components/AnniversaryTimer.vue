<template>
    <div class="card border-0 shadow-sm p-4 rounded-4 text-center mb-4 glass-card">
        <h5 class="text-secondary mb-3">เรารักกันมาแล้ว...</h5>

        <div class="d-flex justify-content-center mb-4">
            <SelectButton v-model="viewMode" :options="options" optionLabel="label" optionValue="value"
                aria-label="View Mode" />
        </div>

        <div class="row g-2 justify-content-center">
            <div v-for="(val, unit) in displayData" :key="unit"
                :class="viewMode === 'total' ? 'col-3' : 'col-4 col-md-2'">
                <div class="timer-box p-2 rounded-3 shadow-sm border border-white">
                    <div class="fw-bold text-pink" :class="viewMode === 'total' ? 'fs-2' : 'fs-3'">
                        {{ val }}
                    </div>
                    <div class="text-muted x-small">{{ unit }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import SelectButton from 'primevue/selectbutton';
import moment from 'moment';
import { useAnniversaryStore } from '@/stores/Anniversary';
const store = useAnniversaryStore()


const viewMode = ref('detailed');
const options = ref([
    { label: 'Years', value: 'detailed' },
    { label: 'Days', value: 'total' }
]);

const now = ref(moment());
let timer = null;

const displayData = computed(() => {
    const end = now.value;
    const start = store.getANVDate;

    if (viewMode.value === 'total') {
        const totalDays = end.diff(start, 'days');
        const hours = end.hours();
        const minutes = end.minutes();
        const seconds = end.seconds();

        return {
            'วัน': String(totalDays).padStart(2, '0'),
            'ชม.': String(hours).padStart(2, '0'),
            'นาที': String(minutes).padStart(2, '0'),
            'วินาที': String(seconds).padStart(2, '0')
        };
    } else {
        const duration = moment.duration(end.diff(start));

        return {
            'ปี': duration.years(),
            'เดือน': duration.months(),
            'วัน': duration.days(),
            // 'ชม.': duration.hours(),
            // 'นาที': duration.minutes(),
            // 'วินาที': duration.seconds()
        };
    }
});

onMounted(() => {
    timer = setInterval(() => {
        now.value = moment();
    }, 1000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
}

.text-pink {
    color: #d53f8c;
}

.timer-box {
    background: rgba(255, 255, 255, 0.5);
    transition: transform 0.2s ease;
}

.timer-box:hover {
    transform: translateY(-3px);
}

.x-small {
    font-size: 0.75rem;
    font-weight: 500;
}

/* ปรับแต่ง PrimeVue SelectButton */
:deep(.p-selectbutton .p-button.p-highlight) {
    background: #d53f8c;
    border-color: #d53f8c;
    color: white;
}
</style>