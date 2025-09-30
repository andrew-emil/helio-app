import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { Text } from "react-native";

export default function CustomError({ message }: { message: string }) {
    const { themeMode } = useTheme();

    return <Text className={`${themeMode === 'dark' ? 'text-red-400' : 'text-red-600'} text-sm mt-1`}
        style={{ fontFamily: FONTS_CONSTANTS.bold }}>
        {message}
    </Text>
}