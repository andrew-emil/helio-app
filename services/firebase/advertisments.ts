import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { AdvertisementsDocData } from "@/types/firebaseDocs.type";
import { createConverter, dbRefs } from "@/utils/firebaseUtils";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Fetch one Advertisement doc by id
export const getAdvertisementById = async (id: string): Promise<AdvertisementsDocData | undefined> => {
    const ref = dbRefs.advertisment(id);
    const snapshot = await getDoc(ref);
    return snapshot.data()
};

// Fetch all Advertisements
export const getAllAdvertisements = async (): Promise<AdvertisementsDocData[]> => {
    const ref = collection(db, FIREBASE_DOCS.NEWS).withConverter(createConverter<AdvertisementsDocData>());
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => doc.data());
};