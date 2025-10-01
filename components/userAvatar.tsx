import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";

export default function UserAvatar() {
    const { user } = useUser()
    const { colors } = useTheme()

    if (user?.imageUrl) {
        return (
            <Image
                source={{ uri: user.imageUrl }}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: colors.surface,
                }}
            />
        )
    } else {
        return (
            <View
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary, // fallback background
                }}
            >
                <Ionicons name="person" size={32} color={colors.background} />
            </View>
        )
    }


}