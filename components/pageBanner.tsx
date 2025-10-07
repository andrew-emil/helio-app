import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import React from "react";
import { Text, View } from "react-native";

interface PageBannerProps {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, icon }) => {
    const { colors } = useTheme()
    const { bg } = useBg()

    return (
        < View className={`p-8 rounded border-b ${bg("border-slate-200", "border-slate-800")} mx-2`
        }
            style={{ backgroundColor: colors.surface }}>

            {/* Centered container for all content */}
            < View className="items-center" >

                {/* Icon with Ring Background Layer */}
                < View
                    className={`justify-center items-center p-4 rounded-full mb-4 ${bg(
                        "ring-8 ring-slate-100/50",
                        "ring-8 ring-slate-700/30"
                    )}`}
                    style={{
                        backgroundColor: colors.background, // Ring background
                        width: 80, // Fixed width for ring
                        height: 80, // Fixed height for ring
                    }}
                >
                    {icon}
                </View >

                <Text
                    className="text-3xl sm:text-2xl tracking-tight text-center"
                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                >
                    {title}
                </Text>

                {
                    subtitle && (
                        <Text
                            className="mt-4 max-w-2xl mx-auto text-md sm:text-lg text-center"
                            style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.semiBold }}
                        >
                            {subtitle}
                        </Text>
                    )
                }
            </View >
        </View >
    );
};

export default PageBanner;