import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export default function HamburgerButton() {
    const navigation = useNavigation();
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="ml-4"
        >
            <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
    );
}
