import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { saveUserProfile } from "./user";
// Register new user
export async function register(
    email: string,
    password: string,
    username: string
) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Update Firebase Auth profile
        await updateProfile(user, { displayName: username });

        // Save user profile in Firestore
        await saveUserProfile(user.uid, { username, email });

        return user;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}

// Login with email & password
export async function login(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

// Login with Google
export async function loginWithGoogle(idToken: string) {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCred = await signInWithCredential(auth, credential);
        const user = userCred.user;

        // Save Firestore profile (creates if missing, updates if exists)
        await saveUserProfile(user.uid, {
            username: user.displayName || "Anonymous",
            email: user.email || "",
        });

        return user;
    } catch (error) {
        console.error("Google login failed:", error);
        throw error;
    }
}

// Logout
export async function logout() {
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
}