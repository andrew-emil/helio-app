import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { db } from "@/services/firebase/firebase";
import { AdvertisementsDocData, NewsDocData, NotificatioDocData, PropertyDocData, ServiceDocData } from "@/types/firebaseDocs.type";
import { UserProfileData } from "@/types/user.type";
import { doc, DocumentData, DocumentReference, FirestoreDataConverter, WithFieldValue } from "firebase/firestore";


export const createConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
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
    news: (uid: string) => getTypedDocRef<NewsDocData>(FIREBASE_DOCS.NEWS, uid),
    notification: (uid: string) => getTypedDocRef<NotificatioDocData>(FIREBASE_DOCS.NOTIFICATIONS, uid),
    service: (categoryId: string, uid: string) =>
        doc(db, FIREBASE_DOCS.SERVICES, categoryId, "items", uid).withConverter(
            createConverter<ServiceDocData>()
        ),
    advertisment: (uid: string) => getTypedDocRef<AdvertisementsDocData>(FIREBASE_DOCS.ADVERTISMENTS, uid),
    property: (uid: string) => getTypedDocRef<PropertyDocData>(FIREBASE_DOCS.PROPERTIES, uid),
} as const;