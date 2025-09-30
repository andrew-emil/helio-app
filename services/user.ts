import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

export async function saveUserProfile(uid: string, data: { username?: string; email?: string; }) {
    const userRef = doc(db, FIREBASE_DOCS.USERS, uid)
    await setDoc(userRef, { ...data }, { merge: true });
}

export async function getUserProfile(uid: string) {
    const snap = await getDoc(doc(db, FIREBASE_DOCS.USERS, uid));
    return snap.exists() ? snap.data() : null;
}