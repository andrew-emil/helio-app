import { UserProfileData } from "@/types/user.type";
import { dbRefs } from "@/utils/firebaseUtils";
import { getDoc, setDoc } from "firebase/firestore";

export async function saveUserProfile(uid: string, data: UserProfileData) {
    try {
        const userRef = dbRefs.users(uid);

        await setDoc(userRef, { ...data, createdAt: Date.now() }, { merge: true });
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
}

export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
    try {
        const userRef = dbRefs.users(uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}