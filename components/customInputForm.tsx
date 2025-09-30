import { useTheme } from "@/context/themeContext";
import { TextInput, TextInputProps } from "react-native";

export default function CustomInputForm(props: TextInputProps) {
    const { colors } = useTheme();

    return <TextInput
        {...props}
        style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderRadius: 8,
            padding: 12,
            marginVertical: 6,
            borderWidth: 1,
            borderColor: colors.background,
            textAlign: "right",
        }}
        placeholderTextColor={colors.text}
    />;
}