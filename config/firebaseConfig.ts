import { FirebaseOptions } from 'firebase/app';

const apiKey = import.meta.env.VITE_API_KEY
const appId = import.meta.env.VITE_APP_ID
const messagingSenderId = import.meta.env.VITE_MESSAGING_SENDER_ID
const authDomain = import.meta.env.VITE_AUTH_DOMAIN

export const firebaseConfig: FirebaseOptions = {
    apiKey,
    appId,
    messagingSenderId,
    projectId: "helio-89b78",
    storageBucket: "helio-89b78.appspot.com",
    authDomain,
}