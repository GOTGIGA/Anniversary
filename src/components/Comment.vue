<template>
    <div class="d-flex flex-column align-items-center">
        <div class="d-flex gap-2">
            <Button 
                label="บอกความรู้สึกของเธอหน่อย" 
                icon="pi pi-comment" 
                class="p-button-rounded btn-love-main shadow"
                @click="showComment = true"
            />
            <Button 
                label="ดูประวัติ" 
                icon="pi pi-history" 
                class="p-button-rounded p-button-outlined btn-love-history shadow"
                @click="showHistory = true"
            />
        </div>

        <Dialog v-model:visible="showComment" header="บอกความรู้สึกให้เค้ารู้หน่อย"
            :style="{ width: '90vw', maxWidth: '400px' }" modal>
            <div class="love-evaluation-area border-top pt-3">
                <div class="text-center m-4">
                    <h5 class="fw-bold text-pink">เธอรักเราแค่ไหน</h5>
                </div>

                <div class="d-flex justify-content-center mb-4">
                    <Rating v-model="loveData.rating" :stars="5" :cancel="false">
                        <template #onicon>
                            <i class="pi pi-heart-fill text-pink animate-pop" style="font-size: 2.5rem"></i>
                        </template>
                        <template #officon>
                            <i class="pi pi-heart text-muted" style="font-size: 2.5rem"></i>
                        </template>
                    </Rating>
                </div>

                <div class="comment-input-wrapper">
                    <label class="text-muted mb-2 ps-2 fs-5">ข้อความถึงคุณแฟน:</label>
                    <textarea v-model="loveData.message" class="form-control custom-textarea mb-3"
                        placeholder="วันนี้อยากบอกอะไรไหม..." rows="3"></textarea>

                    <Button 
                        @click="confirmSave" 
                        class="w-100 p-button-rounded btn-love-main py-2 shadow"
                        :loading="isSaving"
                        label="บันทึกความทรงจำ ❤️"
                    />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="showHistory" header="สมุดบันทึกความรักของเรา"
            :style="{ width: '95vw', maxWidth: '450px' }" modal>
            <div class="history-container p-2">
                <div v-if="historyData.length === 0" class="text-center p-5 text-muted">
                    <i class="pi pi-inbox" style="font-size: 2rem"></i>
                    <p class="mt-2">ยังไม่มีบันทึกเลยจ้า...</p>
                </div>

                <div v-for="item in historyData" :key="item.id" class="history-card mb-3 p-3 shadow-sm rounded-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="rating-display">
                            <i v-for="n in 5" :key="n"
                                :class="['pi', n <= item.heart_rating ? 'pi-heart-fill text-pink' : 'pi-heart text-muted']"
                                style="font-size: 0.8rem; margin-right: 2px;"></i>
                        </div>
                        <small class="text-muted date-text">{{ item.date }}</small>
                    </div>
                    <p class="mb-0 message-text">{{ item.message }}</p>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Rating from 'primevue/rating';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button'; // เพิ่มการ Import Button
import axios from 'axios';
import moment from 'moment';

import { useToast } from "primevue/usetoast";
const toast = useToast();
const isLoading = ref(false);
const showComment = ref(false);
const showHistory = ref(false);
const isSaving = ref(false);
const FIREBASE_URL = import.meta.env.VITE_FIREBASE_URL;

const loveData = reactive({
    rating: 0,
    message: ''
});

const historyData = ref([]);

onMounted(async () => {
    await fetchHistory();
});

const fetchHistory = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(FIREBASE_URL);
        if (response.data) {
            historyData.value = Object.values(response.data).reverse();
        }
    } catch (error) {
        console.error("Firebase Connect Error:", error);
    } finally {
        isLoading.value = false;
    }
};

const confirmSave = async () => {
    if (loveData.rating === 0) {
        toast.add({ severity: 'warn', summary: 'ลืมอะไรไปเปล่า', detail: 'เธอไม่รักเค้าหรอ! เลือกหัวใจก่อนนะ', life: 3000 });
        return;
    }

    isSaving.value = true;
    const newEntry = {
        id: Date.now().toString(),
        date: moment().format('DD/MM/YYYY HH:mm'),
        heart_rating: loveData.rating,
        message: loveData.message,
    };

    try {
        await axios.post(FIREBASE_URL, newEntry);
        toast.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ขอบคุณสำหรับความรักที่มีให้กันนะ ❤️', life: 3000 });
        loveData.message = '';
        loveData.rating = 0;
        showComment.value = false;
        fetchHistory();
    } catch (error) {
        toast.add({ severity: 'warn', summary: 'Network Error', detail: 'บันทึกไม่สำเร็จ', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
/* กำหนดฟอนต์ FC Lamoon ให้ปุ่มและเนื้อหา */
* {
    font-family: 'FCLamoon', sans-serif;
}

.text-pink {
    color: #d53f8c;
}

/* ปรับแต่งปุ่มหลัก (Gradient) */
:deep(.btn-love-main) {
    background: linear-gradient(45deg, #d53f8c, #f687b3) !important;
    border: none !important;
    color: white !important;
    font-size: 1.1rem;
}

/* ปรับแต่งปุ่มประวัติ (Outlined) */
:deep(.btn-love-history) {
    border-color: #d53f8c !important;
    color: #d53f8c !important;
    font-size: 1.1rem;
}

:deep(.btn-love-history:hover) {
    background: #fff0f3 !important;
}

.custom-textarea {
    border: 2px solid #fff0f3;
    border-radius: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.5);
    font-size: 1.1rem;
}

/* History Styles */
.history-container {
    max-height: 400px;
    overflow-y: auto;
}

.history-card {
    background: #fff;
    border-left: 5px solid #d53f8c;
    transition: 0.2s;
}

.history-card:hover {
    transform: scale(1.02);
}

.date-text {
    font-size: 0.8rem;
}

.message-text {
    font-size: 1.1rem; /* ปรับขนาดฟอนต์ไทยให้อ่านง่ายขึ้น */
    color: #4a5568;
    line-height: 1.4;
}

.animate-pop {
    animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

/* ปรับหัวข้อ Dialog */
:deep(.p-dialog-title) {
    font-family: 'FCLamoon', sans-serif;
    font-weight: bold;
    color: #d53f8c;
}
</style>