import { getDatabase, ref, get, push, set, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseApp, getFirebaseStorage } from '@/firebase.js';

function getDb() {
    return getDatabase(getFirebaseApp());
}

export function generatePhotoId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function extensionFromFile(file) {
    const name = file.name || '';
    const i = name.lastIndexOf('.');
    if (i === -1 || i === name.length - 1) return 'jpg';
    const ext = name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
    return ext || 'jpg';
}

/**
 * @returns {Promise<Record<string, Record<string, object>> | null>}
 */
export async function fetchGalleryPhotosTree() {
    const snapshot = await get(ref(getDb(), 'galleryPhotos'));
    const data = snapshot.val();
    return data && typeof data === 'object' ? data : null;
}

/**
 * รูปที่แสดงบนหน้าหลัก (ทุกแกลเลอรี่)
 */
export async function fetchHomeGalleryPhotos() {
    const tree = await fetchGalleryPhotosTree();
    if (!tree) return [];

    const list = [];
    for (const [galleryId, photos] of Object.entries(tree)) {
        if (!photos || typeof photos !== 'object') continue;
        for (const [photoId, raw] of Object.entries(photos)) {
            if (!raw || typeof raw !== 'object') continue;
            if (!raw.showOnHome) continue;
            list.push({
                ...raw,
                galleryId,
                photoId,
                path: raw.downloadURL,
                isFlipped: false,
            });
        }
    }
    list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return list;
}

/**
 * @returns {Promise<Array<{ id: string, name: string, createdAt: number }>>}
 */
export async function fetchGalleriesList() {
    const snapshot = await get(ref(getDb(), 'galleries'));
    const data = snapshot.val();
    if (!data || typeof data !== 'object') return [];
    return Object.entries(data)
        .map(([id, v]) => ({
            id,
            name: v?.name ?? '',
            createdAt: v?.createdAt ?? 0,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createGallery(name) {
    const payload = { name: String(name).trim(), createdAt: Date.now() };
    const galleriesRef = ref(getDb(), 'galleries');
    const newRef = push(galleriesRef);
    await set(newRef, payload);
    const id = newRef.key;
    if (!id) throw new Error('Failed to create gallery');
    return { id, ...payload };
}

/**
 * @returns {Promise<{ photoId: string, downloadURL: string, storagePath: string }>}
 */
export async function uploadGalleryPhoto(galleryId, file, { emoji, desc, order, showOnHome }) {
    const photoId = generatePhotoId();
    const ext = extensionFromFile(file);
    const storagePath = `gallery-images/${galleryId}/${photoId}.${ext}`;
    const storage = getFirebaseStorage();
    const sRef = storageRef(storage, storagePath);
    await uploadBytes(sRef, file, { contentType: file.type || undefined });
    const downloadURL = await getDownloadURL(sRef);

    const meta = {
        downloadURL,
        storagePath,
        emoji: emoji ?? '📷',
        desc: desc ?? '',
        order: Number(order) || 0,
        showOnHome: Boolean(showOnHome),
    };
    await set(ref(getDb(), `galleryPhotos/${galleryId}/${photoId}`), meta);
    return { photoId, ...meta };
}

export async function updateGalleryPhotoMeta(galleryId, photoId, patch) {
    const allowed = ['emoji', 'desc', 'order', 'showOnHome'];
    const body = {};
    for (const k of allowed) {
        if (k in patch) {
            if (k === 'order') body[k] = Number(patch[k]) || 0;
            else if (k === 'showOnHome') body[k] = Boolean(patch[k]);
            else body[k] = patch[k];
        }
    }
    await update(ref(getDb(), `galleryPhotos/${galleryId}/${photoId}`), body);
}

/**
 * @returns {Promise<Record<string, object>>}
 */
export async function fetchPhotosInGallery(galleryId) {
    const snapshot = await get(ref(getDb(), `galleryPhotos/${galleryId}`));
    const data = snapshot.val();
    return data && typeof data === 'object' ? data : {};
}

export async function deleteGalleryPhoto(galleryId, photoId, storagePath) {
    await remove(ref(getDb(), `galleryPhotos/${galleryId}/${photoId}`));
    if (storagePath) {
        try {
            const storage = getFirebaseStorage();
            await deleteObject(storageRef(storage, storagePath));
        } catch (e) {
            console.warn('Storage delete skipped:', e);
        }
    }
}
