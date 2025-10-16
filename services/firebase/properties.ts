import { db } from "@/config/firebase";
import { FIREBASE_DOCS } from "@/constants/firebase.constants";
import { PropertyDocData } from "@/types/firebaseDocs";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

/**
 * Fetch one property document by ID
 */
export const getPropertyById = async (
    id: string
): Promise<PropertyDocData | null> => {
    try {
        const ref = doc(db, FIREBASE_DOCS.PROPERTIES, id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as PropertyDocData;
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        throw error;
    }
};

/**
 * Fetch all property documents
 */
export const getAllProperties = async (): Promise<PropertyDocData[]> => {
    try {
        const ref = collection(db, FIREBASE_DOCS.PROPERTIES);
        const snapshot = await getDocs(ref);

        return snapshot.docs.map(
            (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as PropertyDocData)
        );
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};

/**
 * Add a new property
 */
export const addProperty = async (
    propertyData: Omit<PropertyDocData, "id">
): Promise<string> => {
    try {
        const ref = collection(db, FIREBASE_DOCS.PROPERTIES);
        const newDoc = await addDoc(ref, {
            ...propertyData,
            createdAt: propertyData.createdAt ?? new Date(),
        });
        return newDoc.id;
    } catch (error) {
        console.error("Error adding property:", error);
        throw error;
    }
};

/**
 * Update an existing property
 */
export const updateProperty = async (
    id: string,
    propertyData: Partial<Omit<PropertyDocData, "id">>
): Promise<void> => {
    try {
        const ref = doc(db, FIREBASE_DOCS.PROPERTIES, id);
        await updateDoc(ref, propertyData);
    } catch (error) {
        console.error("Error updating property:", error);
        throw error;
    }
};

/**
 * Delete a property by ID
 */
export const deleteProperty = async (id: string): Promise<void> => {
    try {
        const ref = doc(db, FIREBASE_DOCS.PROPERTIES, id);
        await deleteDoc(ref);
    } catch (error) {
        console.error("Error deleting property:", error);
        throw error;
    }
};
