import { UserStorage } from "@/services/storage/userStoage";
import { getUserProfile } from "@/services/firebase/user";
import { UserData } from "@/types/userContext.type";
import { User } from "firebase/auth";

export async function saveUserData(firebaseUser: User, setUser: (userData: UserData | null) => Promise<void>) {
    const profile = await getUserProfile(firebaseUser.uid)

    if (!profile) {
        throw Error("المتسخدم غير موجود")
    }

    // Fallbacks in case profile fields are missing
    const username = profile.username || firebaseUser.displayName || "مستخدم";
    const email = profile.email || firebaseUser.email || "";
    const imageUrl = profile.imageUrl || firebaseUser.photoURL || "";
    const createdAt = profile.createdAt

    const loggedUser = await UserStorage.setUserData(
        {
            uid: firebaseUser.uid,
            username,
            email,
            imageUrl,
            createdAt
        },
        false
    );
    if (!loggedUser) throw Error("حدث خطأ فى التسجيل")

    await setUser(loggedUser)
}