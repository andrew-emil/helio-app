import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { saveUserProfile } from "../user";
import { auth } from "./firebase";

export async function register(
    email: string,
    password: string,
    username: string
) {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    await updateProfile(userCredential.user, { displayName: username });
    const user = userCredential.user;

    await Promise.all([
        updateProfile(user, { displayName: username }),
        saveUserProfile(user.uid, { username, email }),
    ]);

    return user;
}

// Login
export async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    return userCredential.user;
}

// Logout
export async function logout() {
    await auth.signOut();
    return true;
}
