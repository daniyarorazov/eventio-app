import React from 'react';
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getPerformance} from "firebase/performance";
import {getStorage} from "firebase/storage";
import {useAuthState} from "react-firebase-hooks/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
}
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const performance = getPerformance(app);
export const storage = getStorage(app);

export function currentStateUser() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const [user] = useAuthState(getAuth(auth));
    return user;
}

