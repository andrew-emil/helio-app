import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import { ServiceDocData } from "@/types/firebaseDocs";
import { groupBySubCategories } from "@/utils/groupServicesByCategories";
import { collection, getDocs } from "firebase/firestore";

export type ServicesByCategoryArray = Record<string, { subCategory: string; services: ServiceDocData[] }[]>;

export async function getAllServices(): Promise<ServicesByCategoryArray> {
    const servicesCol = collection(db, FIREBASE_DOCS.SERVICES);
    const categoriesSnap = await getDocs(servicesCol);

    const results: ServicesByCategoryArray = {};

    // fetch items per category in parallel
    await Promise.all(categoriesSnap.docs.map(async (categoryDoc) => {
        const categoryId = categoryDoc.id;
        const itemsCol = collection(db, FIREBASE_DOCS.SERVICES, categoryId, "items");
        const itemsSnap = await getDocs(itemsCol);

        const grouped = groupBySubCategories(itemsSnap);

        results[categoryId] = Object.entries(grouped).map(([subCategory, services]) => ({
            subCategory,
            services,
        }));
    }));

    return results;
}