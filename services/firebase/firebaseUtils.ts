
import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { UserProfileData } from "@/types/user.type";
import { doc, DocumentData, DocumentReference, FirestoreDataConverter, WithFieldValue } from "firebase/firestore";
import { db } from "./firebase";


const createConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
    toFirestore(data: WithFieldValue<T>) {
        return data;
    },
    fromFirestore(snapshot, options): T {
        const data = snapshot.data(options);
        return data as T;
    }
});


const getTypedDocRef = <T extends DocumentData>(collectionPath: string, uid: string): DocumentReference<T> => {
    return doc(db, collectionPath, uid).withConverter(createConverter<T>());
};


export const dbRefs = {
    users: (uid: string) => getTypedDocRef<UserProfileData>(FIREBASE_DOCS.USERS, uid),
} as const;