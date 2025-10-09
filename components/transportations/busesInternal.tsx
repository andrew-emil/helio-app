import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { getAllBusesInternal } from "@/services/firebase/transportations";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    Linking,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ErrorFallback from "../errorFallback";
import SupervisorCard, { CallButton } from "./supervisorCard";

export default function BusesInternal() {
    const { colors } = useTheme();
    const [showFullWeek, setShowFullWeek] = useState(false);
    const { data: transportation, error } = useQuery({
        queryKey: ["buses-internal"],
        queryFn: async () => await getAllBusesInternal(),
    });

    if (error) return <ErrorFallback />;
    if (!transportation)
        return (
            <View
                className="w-full p-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
            >
                <Text
                    style={{
                        fontFamily: FONTS_CONSTANTS.semiBold,
                        color: colors.text,
                    }}
                >
                    لا توجد لدينا معلومات حالية
                </Text>
            </View>
        );

    const todayDate = new Date();
    const todayString = todayDate.toISOString().split("T")[0].replaceAll("-", "/");
    const todaySchedule = transportation.days.find(
        (d) => d.date === todayString
    );
    const todayDayName = todayDate.toLocaleDateString("ar-EG", {
        weekday: "long",
    });

    if (!todaySchedule)
        return (
            <View className="w-full p-4">
                <Text
                    style={{
                        fontFamily: FONTS_CONSTANTS.medium,
                        color: colors.text,
                    }}
                >
                    لا يوجد جدول متاح ليوم {todayDayName}
                </Text>
            </View>
        );

    return (
        <View
            className="w-full flex-1 gap-4"
            style={{ backgroundColor: colors.background }}
        >
            <SupervisorCard
                name={transportation.supervisorName}
                phone={transportation.supervisorPhone}
                title="مشرف الباصات الداخلية"
            />

            {todaySchedule.drivers.map((driver: any, index: number) => (
                <View
                    key={index}
                    className="flex-row items-center justify-between p-4 mb-3 rounded-xl"
                    style={{
                        backgroundColor: colors.surface,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 2,
                    }}
                >
                    <View className="flex-row-reverse items-center gap-6">
                        <CallButton phone={driver.phone} />

                        <View>
                            <Text
                                style={{
                                    fontFamily: FONTS_CONSTANTS.bold,
                                    color: colors.text,
                                }}
                            >
                                {driver.name}
                            </Text>
                            <Text
                                className="text-sm"
                                style={{
                                    fontFamily: FONTS_CONSTANTS.regular,
                                    color: colors.muted,
                                }}
                            >
                                سائق الباص الداخلي
                            </Text>
                        </View>
                    </View>
                </View>
            ))}

            <View className="mt-4">
                <TouchableOpacity
                    onPress={() => setShowFullWeek(!showFullWeek)}
                    className="flex-row items-center justify-center mt-4"
                >
                    <Ionicons
                        name={showFullWeek ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.primary}
                    />
                    <Text
                        className="text-base ml-1"
                        style={{
                            fontFamily: FONTS_CONSTANTS.medium,
                            color: colors.primary,
                        }}
                    >
                        {showFullWeek ? "إخفاء باقي الأسبوع" : "عرض باقي الأسبوع"}
                    </Text>
                </TouchableOpacity>
            </View>

            {showFullWeek && (
                <View className="mt-6">
                    {transportation.days.map((day, i: number) => (
                        <View key={i} className="mb-5 p-4 rounded-lg"
                            style={{ backgroundColor: day.date === todayString ? colors.primary : 'transparent'}}
                        >
                            <Text
                                className="text-lg mb-2"
                                style={{
                                    fontFamily: FONTS_CONSTANTS.bold,
                                    color: colors.text,
                                }}
                            >
                                {day.day}
                            </Text>
                            {day.drivers.map((driver: any, j: number) => (
                                <View
                                    key={j}
                                    className="flex-row items-center justify-between p-3 rounded-lg mb-2"
                                    style={{ backgroundColor: colors.surface }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONTS_CONSTANTS.medium,
                                            color: colors.text,
                                        }}
                                    >
                                        {driver.name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(`tel:${driver.phone}`)}
                                        className="bg-green-500 px-3 py-1 rounded-md"
                                    >
                                        <Text
                                            className="text-white"
                                            style={{
                                                fontFamily: FONTS_CONSTANTS.semiBold,
                                            }}
                                        >
                                            اتصال
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
