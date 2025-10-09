import { BusesExternalDocData, BusesInternalDoc } from "@/types/firebaseDocs.type";
import { collection, documentId, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { FIREBASE_DOCS } from "@/constants/firebaseConstants";

export async function getAllBusesExternal(): Promise<BusesExternalDocData[]> {
    const ref = collection(db, FIREBASE_DOCS.BUSES_EXTERNAL)
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(d => d.data()) as BusesExternalDocData[] ?? null
}

export async function getAllBusesInternal(): Promise<BusesInternalDoc | null> {
    const colRef = collection(db, FIREBASE_DOCS.BUSES_INTERNAL);

    // 1) Prefer ordering by createdAt (most common)
    try {
        const q = query(colRef, orderBy("createdAt", "desc"), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) return snap.docs[0].data() as BusesInternalDoc;
    } catch {
        // ignore and fall back (e.g. if no createdAt field exists or orderBy fails)
    }

    // 2) Fallback: order by document id (sometimes roughly chronological)
    const q2 = query(colRef, orderBy(documentId(), "desc"), limit(1));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) return snap2.docs[0].data() as BusesInternalDoc;

    
    return null;
}