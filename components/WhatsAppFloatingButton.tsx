import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { AccessibilityRole, Linking, TouchableOpacity, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    phone?: string; // in international format, e.g. "201040303547"
    size?: number;
    testID?: string;
};

const DEFAULT_PHONE = "201040303547";

const WhatsAppFab: React.FC<Props> = ({ phone = DEFAULT_PHONE, size = 56, testID }) => {
    const insets = useSafeAreaInsets();

    const openWhatsApp = useCallback(async () => {
        const plainNumber = phone.replace(/\D/g, ""); // remove any non-digits
        // prefer native app scheme
        const appUrl = `whatsapp://send?phone=${plainNumber}`;
        const webUrl = `https://wa.me/${plainNumber}`;

        try {
            const supported = await Linking.canOpenURL(appUrl);
            if (supported) {
                await Linking.openURL(appUrl);
            } else {
                // fallback to web url which opens WhatsApp Web or prompts install
                await Linking.openURL(webUrl);
            }
        } catch (err) {
            // final fallback (should rarely happen)
            try {
                await Linking.openURL(webUrl);
            } catch {
                // ignore or show toast
                console.warn("Can't open WhatsApp", err);
            }
        }
    }, [phone]);

    // compute bottom position considering safe area
    const bottomOffset = Math.max(16, insets.bottom + 8);

    return (
        <TouchableOpacity
            testID={testID}
            accessibilityRole={"button" as AccessibilityRole}
            accessibilityLabel="Contact us on WhatsApp"
            activeOpacity={0.85}
            onPress={openWhatsApp}
            className="absolute left-4"
            style={{
                bottom: bottomOffset,
                width: size,
                height: size,
                borderRadius: size / 2,
                // nativewind shadow may differ by platform; small inline shadow helps on Android
                elevation: 6,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons
                name="logo-whatsapp"
                size={Math.round(size * 0.5)}
                color="#ffffff"
                className="bg-[#25D366] w-full h-full rounded-full flex items-center justify-center"
            />
        </TouchableOpacity>
    );
};

export default WhatsAppFab;
