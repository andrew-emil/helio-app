import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { auth } from "@/services/firebase/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession()

export default function GoogleLoginButton() {
    const { colors } = useTheme()
    //TODO: go to google console and set up OAuth consent screen and add the redirect URI
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "1000535805893-4enc061p1ggl84l48pkg6vklha1en29s.apps.googleusercontent.com",
        iosClientId: "1000535805893-i6235dk2quem4jc4edofumgtdk4bleqk.apps.googleusercontent.com",
        androidClientId: "1000535805893-4enc061p1ggl84l48pkg6vklha1en29s.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            if (authentication?.idToken) {
                const credential = GoogleAuthProvider.credential(authentication.idToken);
                signInWithCredential(auth, credential)
                    .then((userCredential) => {
                        console.log("User signed in with Google:", userCredential.user);
                    })
                    .catch((error) => {
                        console.error("Error signing in with Google:", error);
                    });
            }
        }
    }, [response]);

    return (
        <TouchableOpacity
            className={`flex-row items-center justify-center border border-gray-300 p-3 rounded-lg w-[85%]`}
            disabled={!request}
            onPress={() => promptAsync()}
            style={{ backgroundColor: colors.surface }}
        >
            <Text className={`mx-1 text-lg`} style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.medium }}>
                تسجيل الدخول باستخدام Google
            </Text>
            <Ionicons name="logo-google" size={22} color="#DB4437" />
        </TouchableOpacity>
    );
}