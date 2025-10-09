import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";

interface Props {
    height?: number;
    width?: number;
    avatar?: string;
}

export default function UserAvatar({ width = 70, height = 70, avatar }: Props) {
    const { colors } = useTheme();
    const { user } = useUser();

    if (avatar) {
        return (
            <Image
                source={{ uri: avatar }}
                style={{
                    width,
                    height,
                    borderRadius: 35,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: colors.border,
                }}
            />
        );
    } else if (user?.imageUrl) {
        return (
            <Image
                source={{ uri: user.imageUrl }}
                style={{
                    width,
                    height,
                    borderRadius: 35,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: colors.border,
                }}
            />
        );
    } else {
        return (
            <View
                style={{
                    width,
                    height,
                    borderRadius: 35,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary,
                }}
            >
                <Ionicons name="person" size={32} color={colors.background} />
            </View>
        );
    }
}
