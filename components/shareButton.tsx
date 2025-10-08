// ShareButton.tsx
import React from "react";
import { Platform, Share, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { usePathname } from "expo-router";
import { useTheme } from "@/context/themeContext";
import { useToast } from "@/context/toastContext";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string; // optional override
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className }) => {
    const { showToast } = useToast();
    const { colors } = useTheme();
    const pathname = usePathname() ?? "/";

    // 1) get web base URL from env/config (recommended to set via app config)
    const webBase =
        (process.env.EXPO_PUBLIC_APP_URL as string | undefined) ||
        (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_APP_URL ||
        "https://yourapp.example.com";

    const webBaseClean = webBase.replace(/\/$/, ""); // remove trailing slash
    const webUrl = `${webBaseClean}${pathname}`;

    // 2) deep link using custom scheme "helio://"
    const deepLink = Linking.createURL(pathname, { scheme: "helio" });

    // allow explicit override
    const topUrl = url ?? webUrl;

    const handleShare = async () => {
        const messageParts = [
            title ? `${title}` : undefined,
            text ? `${text}` : undefined,
            // web URL first for Android/WhatsApp to preview link.
            topUrl,
            // include deep link so recipients can open in-app if they have it
            deepLink && deepLink !== topUrl ? `افتح في التطبيق: ${deepLink}` : undefined,
        ].filter(Boolean);
        const fullMessage = messageParts.join("\n\n");

        try {
            await Share.share(
                {
                    title,
                    message: fullMessage,
                    // iOS uses url field
                    url: Platform.OS === "ios" ? topUrl : undefined,
                },
                { dialogTitle: title || "مشاركة" }
            );
        } catch (err) {
            console.error("Share error:", err);
            try {
                await Clipboard.setStringAsync(topUrl);
                showToast("فشلت المشاركة، تم نسخ الرابط بدلاً من ذلك.", "success");
            } catch {
                showToast("فشل المشاركة والنسخ.", "error");
            }
        }
    };

    return (
        <TouchableOpacity
            onPress={handleShare}
            className={`flex flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg w-full ${className ?? ""}`}
            style={{ backgroundColor: colors.muted }}
            accessibilityRole="button"
            accessibilityLabel="مشاركة"
        >
            <Ionicons name="share-social" size={22} color="#fff" />
            <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: "#fff" }}>مشاركة</Text>
        </TouchableOpacity>
    );
};

export default ShareButton;
