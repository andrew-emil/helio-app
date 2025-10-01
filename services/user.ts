import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { FIREBASE_DOCS } from "@/constants/firebaseConstants";


export async function saveUserProfile(
    uid: string,
    data: { username?: string; email?: string; imageUrl: string | null; }
) {
    try {
        const userRef = doc(db, FIREBASE_DOCS.USERS, uid);
        await setDoc(userRef, { ...data, createdAt: Date.now() }, { merge: true });
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
}

export async function getUserProfile(uid: string) {
    try {
        const snap = await getDoc(doc(db, FIREBASE_DOCS.USERS, uid));
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}
