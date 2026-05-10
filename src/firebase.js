import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

function firebaseConfig() {
    const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    };
    const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    if (measurementId) {
        config.measurementId = measurementId;
    }
    return config;
}
/** Init เมื่อเรียก getFirebaseApp ครั้งแรก (หน้าแรกโหลดรูป / จัดการแกลเลอรี่ / Storage) */
export function getFirebaseApp() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig());
    }
    return getApps()[0];
}

export function getFirebaseStorage() {
    return getStorage(getFirebaseApp());
}

export function getFirebaseAuth() {
    return getAuth(getFirebaseApp());
}
