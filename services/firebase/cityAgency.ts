import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { CityAgencyDoc } from "@/types/firebaseDocs.type";


export async function getAllCityAgency(): Promise<CityAgencyDoc[]> {
    const ref = collection(db, FIREBASE_DOCS.CITY_AGENCY)
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(data => data.data()) as CityAgencyDoc[]
}