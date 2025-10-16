import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import { CityAgencyDoc } from "@/types/firebaseDocs";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function addCityServiceGuide(cityService: CityAgencyDoc){
    try {
        const ref = collection(db, FIREBASE_DOCS.CITY_AGENCY)
        await addDoc(ref, cityService)
    } catch (error){
        console.error(error)
        throw error
    }
}

export async function getAllCityAgency(): Promise<CityAgencyDoc[]> {
    const ref = collection(db, FIREBASE_DOCS.CITY_AGENCY)
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(data => data.data()) as CityAgencyDoc[]
}