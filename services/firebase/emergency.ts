import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { EmerengyDocData } from "@/types/firebaseDocs.type";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";


export default async function getAllEmergencies() {
    const emergencyRef = collection(db, FIREBASE_DOCS.EMERGENCIES)
    const snapshot = await getDocs(emergencyRef)

    const emergencies: EmerengyDocData[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
            id: data.id ?? "",
            name: data.name,
            phone: data.phone,
            type: data.type
        };
    });

    return filterEmergencies(emergencies)
}

function filterEmergencies(emergencies: EmerengyDocData[]) {
    const nationalEmergency = emergencies.filter(em => em.type === 'national')
    const cityEmergemcy = emergencies.filter(em => em.type === 'city')

    return { nationalEmergency, cityEmergemcy }
}