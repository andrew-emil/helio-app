import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { dbRefs } from "@/utils/firebaseUtils";
import { groupBySubCategories } from "@/utils/groupBySubcategories";

// types
export type ServicesByCategoryArray = Record<string, { subCategory: string; services: ServiceDocData[] }[]>;

export async function fetchAllServicesGroupedArray(): Promise<ServicesByCategoryArray> {
    const servicesCol = collection(db, FIREBASE_DOCS.SERVICES);
    const categoriesSnap = await getDocs(servicesCol);

    const results: ServicesByCategoryArray = {};

    // fetch items per category in parallel
    await Promise.all(categoriesSnap.docs.map(async (categoryDoc) => {
        const categoryId = categoryDoc.id;
        const itemsCol = collection(db, FIREBASE_DOCS.SERVICES, categoryId, "items");
        const itemsSnap = await getDocs(itemsCol);

        const grouped = groupBySubCategories(itemsSnap);
        // convert grouped map -> array of { subCategory, services }
        results[categoryId] = Object.entries(grouped).map(([subCategory, services]) => ({
            subCategory,
            services,
        }));
    }));

    return results;
}


export async function fetchServiceById(categoryId: string, id: string) {
    const docRef = dbRefs.service(categoryId, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        throw new Error(`Service not found: category=${categoryId}, id=${id}`);
    }

    return snapshot.data(); // typed as ServiceDocData
}