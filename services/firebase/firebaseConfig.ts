import { FirebaseOptions } from 'firebase/app';

const apiKey = process.env.EXPO_PUBLIC_API_KEY as string
const appId = process.env.EXPO_PUBLIC_APP_ID as string
const messagingSenderId = process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID as string
const authDomain = process.env.EXPO_PUBLIC_AUTH_DOMAIN as string

export const firebaseConfig: FirebaseOptions = {
    apiKey,
    appId,
    messagingSenderId,
    projectId: "helio-89b78",
    storageBucket: "helio-89b78.appspot.com",
    authDomain,
}