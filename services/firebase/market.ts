import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { Market } from "@/types/firebaseDocs.type";
import { createConverter } from "@/utils/firebaseUtils";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllItems() {
    const ref = collection(db, FIREBASE_DOCS.MARKET).withConverter(createConverter<Market>());
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => doc.data());
}

export async function addItemToMarket(item: Market) {
    const ref = collection(db, FIREBASE_DOCS.MARKET)
    await addDoc(ref, item)
}