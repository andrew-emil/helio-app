import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function useFontsLoader() {
    const [fontsLoaded, fontError] = useFonts({
        CairoRegular: require("@/assets/fonts/Cairo-Regular.ttf"),
        CairoBold: require("@/assets/fonts/Cairo-Bold.ttf"),
        CairoMedium: require("@/assets/fonts/Cairo-Medium.ttf"),
        CairoSemiBold: require("@/assets/fonts/Cairo-SemiBold.ttf"),
    });

    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        const prepare = async () => {
            try {
                if (fontsLoaded || fontError) {
                    await SplashScreen.hideAsync();
                    setAppReady(true);
                }
            } catch (e) {
                console.warn(e);
                setAppReady(true); // Continue even if there's an error
            }
        };

        prepare();
    }, [fontsLoaded, fontError]);

    return appReady;
}
