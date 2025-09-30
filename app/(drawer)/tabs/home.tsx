import { useTheme } from '@/context/themeContext';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { themeMode, colors } = useTheme();


    return (
        <SafeAreaView
            className={`${themeMode === "light" ? "screen" : "screen-dark"}`}>
            <Text style={{ color: colors.text, fontFamily: "CairoBold" }}>الرئيسية</Text>
        </SafeAreaView>
    );
}
