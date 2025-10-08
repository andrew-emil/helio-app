import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { JobDocData } from "@/types/firebaseDocs.type";
import { createConverter } from "@/utils/firebaseUtils";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllJobs() {
    const ref = collection(db, FIREBASE_DOCS.JOBS).withConverter(createConverter<JobDocData>());
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((doc) => doc.data());
    return data.filter(job => job.status === 'approved')
}

export async function addJob(item: JobDocData) {
    const ref = collection(db, FIREBASE_DOCS.JOBS)
    await addDoc(ref, item)
}