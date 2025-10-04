import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { groupBySyubCategories } from '../../utils/groupBySubcategories';
import { db } from "./firebase";
import { dbRefs } from "@/utils/firebaseUtils";

export type ServicesByCategory = Record<
    string,
    { subCategory: string; services: ServiceDocData[] }[]
>;

export async function fetchAllServices(): Promise<ServicesByCategory> {
    const servicesCol = collection(db, FIREBASE_DOCS.SERVICES);
    const categoriesSnap = await getDocs(servicesCol);

    const results: ServicesByCategory = {};

    for (const categoryDoc of categoriesSnap.docs) {
        const categoryId = categoryDoc.id;

        // fetch items for this category
        const itemsCol = collection(db, FIREBASE_DOCS.SERVICES, categoryId, "items");
        const itemsSnap = await getDocs(itemsCol);

        // group items by subCategory
        const grouped = groupBySyubCategories(itemsSnap)

        // transform into array of { subCategory, services }
        results[categoryId] = Object.entries(grouped).map(([subCategory, services]) => ({
            subCategory,
            services,
        }));
    }

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