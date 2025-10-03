import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { NotificatioDocData } from "@/types/firebaseDocs.type";
import { createConverter } from "@/utils/firebaseUtils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Fetch all notification
export const getAllNotifications = async (): Promise<NotificatioDocData[]> => {
    const ref = collection(db, FIREBASE_DOCS.NOTIFICATIONS).withConverter(createConverter<NotificatioDocData>());
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
    return data
};