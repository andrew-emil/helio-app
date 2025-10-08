import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { PropertyDocData } from "@/types/firebaseDocs.type";
import { createConverter, dbRefs } from "@/utils/firebaseUtils";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Fetch one property doc by id
export const getPropertyById = async (id: string): Promise<PropertyDocData | null> => {
    const ref = dbRefs.property(id);
    const snapshot = await getDoc(ref);
    console.log(snapshot.data())
    return snapshot.data() ?? null
};

// Fetch all properties
export const getAllProperties = async (): Promise<PropertyDocData[]> => {
    const ref = collection(db, FIREBASE_DOCS.PROPERTIES).withConverter(createConverter<PropertyDocData>());
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => doc.data());
};