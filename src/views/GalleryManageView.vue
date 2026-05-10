<template>
    <div class="container py-4" style="max-width: 720px">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h1 class="h4 text-pink mb-0">จัดการแกลเลอรี่</h1>
            <router-link to="/home" class="btn btn-sm btn-outline-secondary rounded-pill">กลับหน้าหลัก</router-link>
        </div>

        <div v-if="authLoading" class="text-muted text-center py-5">
            <i class="pi pi-spin pi-spinner fs-4"></i>
            <p class="mt-2 mb-0 small">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>

        <div v-else-if="!user" class="card shadow-sm border-0 rounded-4 p-4 glass-panel">
            <p class="text-muted small mb-3">เข้าสู่ระบบด้วย Google (เฉพาะบัญชีที่ตั้งค่าในระบบ)</p>
            <button type="button" class="btn btn-google rounded-pill w-100 py-2" :disabled="signingIn" @click="signInGoogle">
                <span v-if="signingIn"><i class="pi pi-spin pi-spinner me-2"></i></span>
                <i v-else class="pi pi-google me-2"></i>
                เข้าสู่ระบบด้วย Google
            </button>
            <p v-if="authError" class="text-danger small mt-3 mb-0">{{ authError }}</p>
        </div>

        <div v-else-if="!allowed" class="card shadow-sm border-0 rounded-4 p-4 glass-panel">
            <p class="text-danger mb-2">บัญชี <strong>{{ user.email }}</strong> ไม่มีสิทธิ์จัดการแกลเลอรี่</p>
            <button type="button" class="btn btn-outline-secondary rounded-pill" @click="doSignOut">ออกจากระบบ</button>
        </div>

        <template v-else>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <span class="text-muted small">{{ user.email }}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" @click="doSignOut">ออกจากระบบ</button>
            </div>

            <div class="card shadow-sm border-0 rounded-4 p-3 mb-4 glass-panel">
                <div class="d-flex flex-wrap gap-2 align-items-end justify-content-between">
                    <div class="flex-grow-1" style="min-width: 200px">
                        <label class="form-label small text-muted mb-1">แกลเลอรี่</label>
                        <select v-model="selectedGalleryId" class="form-select rounded-pill" @change="onGalleryChange">
                            <option disabled value="">— เลือกแกลเลอรี่ —</option>
                            <option v-for="g in galleries" :key="g.id" :value="g.id">{{ g.name }}</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-pink rounded-pill" @click="showCreateGallery = true">
                        + แกลเลอรี่ใหม่
                    </button>
                </div>
            </div>

            <div v-if="!selectedGalleryId" class="text-muted text-center py-5">เลือกแกลเลอรี่เพื่อจัดการรูป</div>

            <template v-else>
                <div class="card shadow-sm border-0 rounded-4 p-3 mb-4 glass-panel">
                    <h2 class="h6 text-pink mb-3">อัปโหลดรูป</h2>
                    <input ref="fileRef" type="file" accept="image/*" class="form-control mb-3" @change="onFilePick" />
                    <div class="row g-2 mb-3">
                        <div class="col-md-4">
                            <label class="form-label small text-muted mb-0">emoji</label>
                            <input v-model="uploadForm.emoji" type="text" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small text-muted mb-0">ลำดับ</label>
                            <input v-model.number="uploadForm.order" type="number" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-4 d-flex align-items-end">
                            <div class="form-check mb-2">
                                <input id="uh" v-model="uploadForm.showOnHome" type="checkbox" class="form-check-input" />
                                <label class="form-check-label" for="uh">แสดงหน้าหลัก</label>
                            </div>
                        </div>
                    </div>
                    <label class="form-label small text-muted mb-0">คำบรรยายด้านหลังการ์ด</label>
                    <textarea v-model="uploadForm.desc" class="form-control rounded-3 mb-3" rows="2"></textarea>
                    <button
                        type="button"
                        class="btn btn-pink rounded-pill w-100"
                        :disabled="!pendingFile || uploading"
                        @click="doUpload"
                    >
                        <span v-if="uploading"><i class="pi pi-spin pi-spinner me-2"></i></span>
                        อัปโหลด
                    </button>
                </div>

                <div class="card shadow-sm border-0 rounded-4 p-3 glass-panel">
                    <h2 class="h6 text-pink mb-3">รูปในแกลเลอรี่นี้</h2>
                    <div v-if="photosLoading" class="text-muted py-4 text-center">
                        <i class="pi pi-spin pi-spinner"></i>
                    </div>
                    <div v-else-if="photoEntries.length === 0" class="text-muted small">ยังไม่มีรูป</div>
                    <div v-else class="d-flex flex-column gap-3">
                        <div
                            v-for="row in photoEntries"
                            :key="row.photoId"
                            class="border rounded-4 p-3 bg-white bg-opacity-50"
                        >
                            <div class="row g-2 align-items-start">
                                <div class="col-auto">
                                    <img :src="row.downloadURL" alt="" class="thumb rounded-2" />
                                </div>
                                <div class="col">
                                    <div class="row g-2">
                                        <div class="col-sm-4">
                                            <label class="mini-label">emoji</label>
                                            <input v-model="row.edit.emoji" type="text" class="form-control form-control-sm rounded-3" />
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="mini-label">ลำดับ</label>
                                            <input
                                                v-model.number="row.edit.order"
                                                type="number"
                                                class="form-control form-control-sm rounded-3"
                                            />
                                        </div>
                                        <div class="col-sm-4 d-flex align-items-end pb-1">
                                            <div class="form-check">
                                                <input
                                                    :id="'sh-' + row.photoId"
                                                    v-model="row.edit.showOnHome"
                                                    type="checkbox"
                                                    class="form-check-input"
                                                />
                                                <label class="form-check-label small" :for="'sh-' + row.photoId">แสดงหน้าหลัก</label>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <label class="mini-label">คำบรรยาย</label>
                                            <textarea v-model="row.edit.desc" class="form-control form-control-sm rounded-3" rows="2"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex gap-2 mt-2 flex-wrap">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-primary rounded-pill"
                                            :disabled="row.saving"
                                            @click="saveRow(row)"
                                        >
                                            บันทึก
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-danger rounded-pill"
                                            :disabled="row.saving"
                                            @click="removeRow(row)"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>

        <Dialog v-model:visible="showCreateGallery" header="แกลเลอรี่ใหม่" modal :style="{ width: '90vw', maxWidth: '400px' }">
            <label class="form-label">ชื่อแกลเลอรี่</label>
            <input v-model="newGalleryName" type="text" class="form-control rounded-3 mb-3" placeholder="เช่น ทริปเกาะ" />
            <button type="button" class="btn btn-pink rounded-pill w-100" :disabled="creatingGallery" @click="createGalleryConfirm">
                สร้าง
            </button>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/firebase.js';
import {
    fetchGalleriesList,
    createGallery,
    fetchPhotosInGallery,
    uploadGalleryPhoto,
    updateGalleryPhotoMeta,
    deleteGalleryPhoto,
} from '@/services/galleryService.js';

const toast = useToast();

const authLoading = ref(true);
const signingIn = ref(false);
const authError = ref('');
const user = ref(null);

const galleries = ref([]);
const selectedGalleryId = ref('');
const photosLoading = ref(false);
const photoRows = ref([]);

const showCreateGallery = ref(false);
const newGalleryName = ref('');
const creatingGallery = ref(false);

const fileRef = ref(null);
const pendingFile = ref(null);
const uploading = ref(false);
const uploadForm = ref({
    emoji: '📷',
    desc: '',
    order: 0,
    showOnHome: true,
});

const photoEntries = computed(() => photoRows.value);

function parseAdminEmails() {
    const raw = import.meta.env.VITE_GALLERY_ADMIN_EMAILS ?? '';
    return raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
}

const allowed = computed(() => {
    const email = user.value?.email;
    if (!email) return false;
    const list = parseAdminEmails();
    if (!list.length) return false;
    return list.includes(email.toLowerCase());
});

let unsubAuth = null;

async function signInGoogle() {
    authError.value = '';
    const list = parseAdminEmails();
    if (!list.length) {
        authError.value = 'ยังไม่ได้ตั้งค่า VITE_GALLERY_ADMIN_EMAILS ใน .env';
        return;
    }
    signingIn.value = true;
    try {
        const auth = getFirebaseAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error(e);
        const code = e?.code || '';
        if (code === 'auth/popup-closed-by-user') {
            authError.value = 'ปิดหน้าต่างล็อกอินก่อนจบ';
        } else if (code === 'auth/popup-blocked') {
            authError.value = 'เบราว์เซอร์บล็อกป๊อปอัป — อนุญาตป๊อปอัปสำหรับไซต์นี้';
        } else if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
            authError.value =
                'ยังไม่ได้เปิด Firebase Authentication — ไปที่ Firebase Console → Authentication → เริ่มต้นใช้งาน แล้วเปิด Sign-in แบบ Google';
        } else {
            authError.value = e?.message || String(e);
        }
    } finally {
        signingIn.value = false;
    }
}

async function doSignOut() {
    try {
        await signOut(getFirebaseAuth());
    } catch (e) {
        console.error(e);
    }
    galleries.value = [];
    selectedGalleryId.value = '';
    photoRows.value = [];
}

async function loadGalleries() {
    try {
        galleries.value = await fetchGalleriesList();
        if (galleries.value.length && !selectedGalleryId.value) {
            selectedGalleryId.value = galleries.value[0].id;
            await loadPhotos();
        }
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'โหลดแกลเลอรี่ไม่สำเร็จ', detail: String(e.message || e), life: 4000 });
    }
}

async function loadPhotos() {
    if (!selectedGalleryId.value) return;
    photosLoading.value = true;
    try {
        const map = await fetchPhotosInGallery(selectedGalleryId.value);
        photoRows.value = Object.entries(map).map(([photoId, data]) => ({
            photoId,
            downloadURL: data.downloadURL,
            storagePath: data.storagePath,
            edit: {
                emoji: data.emoji ?? '📷',
                desc: data.desc ?? '',
                order: Number(data.order) || 0,
                showOnHome: Boolean(data.showOnHome),
            },
            saving: false,
        }));
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'โหลดรูปไม่สำเร็จ', detail: String(e.message || e), life: 4000 });
        photoRows.value = [];
    } finally {
        photosLoading.value = false;
    }
}

function onGalleryChange() {
    loadPhotos();
}

async function createGalleryConfirm() {
    const name = newGalleryName.value.trim();
    if (!name) {
        toast.add({ severity: 'warn', summary: 'ใส่ชื่อแกลเลอรี่', life: 2500 });
        return;
    }
    creatingGallery.value = true;
    try {
        const g = await createGallery(name);
        galleries.value = await fetchGalleriesList();
        selectedGalleryId.value = g.id;
        showCreateGallery.value = false;
        newGalleryName.value = '';
        await loadPhotos();
        toast.add({ severity: 'success', summary: 'สร้างแกลเลอรี่แล้ว', life: 2500 });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'สร้างไม่สำเร็จ', detail: String(e.message || e), life: 4000 });
    } finally {
        creatingGallery.value = false;
    }
}

function onFilePick(e) {
    const f = e.target.files?.[0];
    pendingFile.value = f || null;
}

async function doUpload() {
    if (!pendingFile.value || !selectedGalleryId.value) return;
    uploading.value = true;
    try {
        await uploadGalleryPhoto(selectedGalleryId.value, pendingFile.value, {
            emoji: uploadForm.value.emoji,
            desc: uploadForm.value.desc,
            order: uploadForm.value.order,
            showOnHome: uploadForm.value.showOnHome,
        });
        pendingFile.value = null;
        if (fileRef.value) fileRef.value.value = '';
        await loadPhotos();
        toast.add({ severity: 'success', summary: 'อัปโหลดแล้ว', life: 2500 });
    } catch (e) {
        console.error(e);
        toast.add({
            severity: 'error',
            summary: 'อัปโหลดไม่สำเร็จ',
            detail: String(e.message || e),
            life: 5000,
        });
    } finally {
        uploading.value = false;
    }
}

async function saveRow(row) {
    row.saving = true;
    try {
        await updateGalleryPhotoMeta(selectedGalleryId.value, row.photoId, row.edit);
        toast.add({ severity: 'success', summary: 'บันทึกแล้ว', life: 2000 });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'บันทึกไม่สำเร็จ', detail: String(e.message || e), life: 4000 });
    } finally {
        row.saving = false;
    }
}

async function removeRow(row) {
    if (!confirm('ลบรูปนี้?')) return;
    row.saving = true;
    try {
        await deleteGalleryPhoto(selectedGalleryId.value, row.photoId, row.storagePath);
        photoRows.value = photoRows.value.filter((r) => r.photoId !== row.photoId);
        toast.add({ severity: 'success', summary: 'ลบแล้ว', life: 2000 });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'ลบไม่สำเร็จ', detail: String(e.message || e), life: 4000 });
    } finally {
        row.saving = false;
    }
}

onMounted(() => {
    const auth = getFirebaseAuth();
    unsubAuth = onAuthStateChanged(auth, async (u) => {
        user.value = u;
        authLoading.value = false;
        galleries.value = [];
        selectedGalleryId.value = '';
        photoRows.value = [];
        if (u?.email && parseAdminEmails().includes(u.email.toLowerCase())) {
            await loadGalleries();
        }
    });
});

onUnmounted(() => {
    if (typeof unsubAuth === 'function') unsubAuth();
});
</script>

<style scoped>
.text-pink {
    color: #d53f8c;
}

.btn-pink {
    background: #ed64a6;
    border: none;
    color: #fff;
}

.btn-pink:hover {
    background: #d53f8c;
    color: #fff;
}

.btn-pink:disabled {
    opacity: 0.6;
}

.btn-google {
    background: #fff;
    border: 1px solid #dadce0;
    color: #3c4043;
    font-weight: 500;
}

.btn-google:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #dadce0;
    color: #3c4043;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
}

.thumb {
    width: 72px;
    height: 72px;
    object-fit: cover;
}

.mini-label {
    font-size: 0.7rem;
    color: #888;
    display: block;
    margin-bottom: 2px;
}
</style>
