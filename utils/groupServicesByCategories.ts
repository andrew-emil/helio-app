
import { ServiceDocData } from "@/types/firebaseDocs";
import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";

export function groupBySubCategories(itemsSnap: QuerySnapshot<DocumentData>): Record<string, ServiceDocData[]> {
    const grouped: Record<string, ServiceDocData[]> = {};

    for (const itemDoc of itemsSnap.docs) {
        const data = itemDoc.data();
        const service: ServiceDocData = {
            id: itemDoc.id,
            createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            subCategory: data.subCategory ?? data.subcategory ?? "uncategorized",
            ...data
        } as ServiceDocData;

        const key = service.subCategory ?? "uncategorized";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(service);
    }

    return grouped;
}
