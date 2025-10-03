import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { NewsDocData } from "@/types/firebaseDocs.type";
import { createConverter, dbRefs } from "@/utils/firebaseUtils";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Fetch one news doc by id
export const getNewsById = async (id: string): Promise<NewsDocData | null> => {
    const ref = dbRefs.news(id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? { id, ...snapshot.data() } : null;
};

// Fetch all news
export const getAllNews = async (): Promise<NewsDocData[]> => {
    const ref = collection(db, FIREBASE_DOCS.NEWS).withConverter(createConverter<NewsDocData>());
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => doc.data());
};