import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/themeContext";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { JobDocData } from "@/types/firebaseDocs.type";

interface JobPostingCardProps {
    job: JobDocData;
}

export default function JobPostingCard({ job }: JobPostingCardProps) {
    const { colors, themeMode } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => null}
            activeOpacity={0.85}
            className="rounded-2xl p-5 mb-4 shadow-md"
            style={{
                backgroundColor: colors.surface,
                borderColor: themeMode === 'dark' ? colors.border : "rgba(203,213,225,0.5)",
                borderWidth: 1,
            }}
        >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-2">
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: FONTS_CONSTANTS.bold,
                            color: colors.primary,
                            fontSize: 16,
                        }}
                    >
                        {job.title}
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.text,
                            fontSize: 14,
                        }}
                    >
                        {job.companyName}
                    </Text>
                </View>

                <View
                    className="px-2 py-1 rounded-full"
                    style={{
                        backgroundColor: themeMode === 'dark' ? colors.surface : "#f1f5f9",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.text,
                            fontSize: 11,
                        }}
                    >
                        {job.type}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <Text
                numberOfLines={3}
                style={{
                    fontFamily: FONTS_CONSTANTS.regular,
                    color: colors.muted,
                    fontSize: 13,
                    marginVertical: 6,
                }}
            >
                {job.description}
            </Text>

            {/* Footer */}
            <View
                className="flex-row justify-between items-center pt-3 mt-2"
                style={{
                    borderTopWidth: 1,
                    borderColor: themeMode === 'dark' ? "#475569" : "#e2e8f0",
                }}
            >
                <View className="flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={14} color={colors.text} />
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.text,
                            fontSize: 12,
                            maxWidth: 150,
                        }}
                    >
                        {job.location}
                    </Text>
                </View>

                <Text
                    style={{
                        fontFamily: FONTS_CONSTANTS.regular,
                        color: colors.muted,
                        fontSize: 11,
                    }}
                >
                    {new Date(job.creationDate).toLocaleDateString("ar-EG-u-nu-latn")}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
