import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useToast } from "@/context/toastContext";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Share, Text, TouchableOpacity } from "react-native";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className }) => {
    const { showToast } = useToast();
    const { colors } = useTheme()

    const handleShare = async () => {
        const urlToShare = url ?? "";
        try {
            await Share.share({
                title,
                message: `${text}\n${urlToShare}`,
                url: urlToShare, // works on iOS only
            });
        } catch (error: any) {
            console.error("Error sharing:", error);
            // fallback: copy to clipboard
            try {
                await Clipboard.setStringAsync(urlToShare);
                showToast("فشلت المشاركة، تم نسخ الرابط بدلاً من ذلك.", "success");
            } catch {
                showToast("فشل المشاركة والنسخ.", "error");
            }
        }
    };

    return (
        <TouchableOpacity
            onPress={handleShare}
            className={`flex flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg active:bg-slate-200 dark:active:bg-slate-600 w-full ${className}`}
            style={{ backgroundColor: colors.muted, }}
        >
            <Ionicons name="share-social" size={22} color="#fff" />
            <Text className="text-white"
                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}>مشاركة</Text>
        </TouchableOpacity>
    );
};

export default ShareButton;
