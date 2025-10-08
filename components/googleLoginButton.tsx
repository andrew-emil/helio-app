import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { loginWithGoogle } from "@/services/firebase/firebaseAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession()

const redirectUri = AuthSession.makeRedirectUri({
    preferLocalhost: true
});


export default function GoogleLoginButton() {
    const { colors } = useTheme()
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: "620244432889-pb2v6t55per2vithg52udvaqljj5a8fv.apps.googleusercontent.com",
        androidClientId: "620244432889-5qotrklh25qlqb7rgq6b6ca7dglh5reo.apps.googleusercontent.com",
        iosClientId: "620244432889-5qotrklh25qlqb7rgq6b6ca7dglh5reo.apps.googleusercontent.com",
        redirectUri,
    }
);

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            loginWithGoogle(id_token)
                .then(user => {
                    console.log("Google signed in:", user.email);
                })
                .catch(err => {
                    console.error("Google login error:", err);
                });
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