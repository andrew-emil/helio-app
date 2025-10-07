import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { RatingDocData } from "@/types/firebaseDocs.type";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addRating = async (
    categoryName: string,
    serviceId: string,
    ratingData: RatingDocData
) => {
    console.log("Category:", categoryName, "Service:", serviceId);

    const ratingsRef = collection(db, FIREBASE_DOCS.SERVICES, categoryName, "items", serviceId, FIREBASE_DOCS.RATINGS);
    await addDoc(ratingsRef, ratingData);

    // Optional: Update average rating
    const snapshot = await getDocs(ratingsRef);
    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const serviceRef = doc(db, FIREBASE_DOCS.SERVICES, categoryName, "items", serviceId);
    await updateDoc(serviceRef, {
        avgRating: avg,
        ratingCount: ratings.length
    });
};

export async function getServiceRatings(serviceId: string, categoryName: string): Promise<RatingDocData[]> {
    try {
        const ratingsRef = collection(db, FIREBASE_DOCS.SERVICES, categoryName, "items", serviceId, FIREBASE_DOCS.RATINGS);
        const snapshot = await getDocs(ratingsRef);

        const ratings: RatingDocData[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                id: data.id ?? "",
                userId: data.userId,
                userName: data.userName,
                rating: data.rating,
                comment: data.comment ?? "",
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            };
        });

        // Sort by date (newest first)
        ratings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return ratings;
    } catch (error) {
        console.error("Error getting service ratings:", error);
        return [];
    }
}