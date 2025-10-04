import { ServiceDocData } from "@/types/firebaseDocs.type";
import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";

export function groupBySyubCategories(itemsSnap: QuerySnapshot<DocumentData, DocumentData>): Record<string, ServiceDocData[]> {
    const grouped: Record<string, ServiceDocData[]> = {};

    for (const itemDoc of itemsSnap.docs) {
        const data = itemDoc.data() as DocumentData;
        const service: ServiceDocData = {
            id: itemDoc.id,
            createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            subCategory: data.subCategory ?? data.subcategory ?? "uncategorized",
            address: data.address ?? "",
            category: data.category,
            description: data.description ?? "",
            externalLink: data.externalLink ?? "",
            imageUrl: data.imageUrl ?? "",
            name: data.name ?? "",
            phone: data.phone ?? "",
            secondPhone: data.secondPhone ?? "",
            whatsapp: data.whatsapp ?? "",
            workTime: data.workTime ?? "",
        };

        if (!grouped[service.subCategory]) {
            grouped[service.subCategory] = [];
        }
        grouped[service.subCategory].push(service);
    }
    return grouped

}