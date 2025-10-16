import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import { collection, getCountFromServer } from "firebase/firestore";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ar } from "date-fns/locale"; // for Arabic month names (optional)

export async function getUsersNumber() {
    const ref = collection(db, FIREBASE_DOCS.USERS);
    const snapshot = await getCountFromServer(ref);
    return snapshot.data().count;
}

