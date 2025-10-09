import { FONTS_CONSTANTS } from "@/constants/fontsConstants"
import { useTheme } from "@/context/themeContext"
import { getAllBusesExternal } from "@/services/firebase/transportations"
import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { FlatList, Text, View } from "react-native"
import ErrorFallback from "../errorFallback"
import SupervisorCard from "./supervisorCard"

export const BusesExternal = () => {
    const { colors, themeMode } = useTheme()
    const { data: buses, error } = useQuery({
        queryKey: ['buses-external'],
        queryFn: async () => await getAllBusesExternal()
    })
    if (error) return <ErrorFallback />

    const supervisorName = buses ? buses[0].supervisorName : ""
    const supervisorphone = buses ? buses[0].supervisorPhone : ""

    return (
        <View className="w-full flex-1 gap-4">
            <FlatList
                scrollEnabled={false}
                data={buses}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (
                    <View className="w-full p-4"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Text
                            style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: colors.text }}
                        >لا توجد لدينا معلومات حالية</Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="space-y-8 animate-fade-in">
                        <SupervisorCard
                            name={supervisorName}
                            phone={supervisorphone}
                        />
                    </View>
                )}

                renderItem={({ item }) => (
                    <View
                        className="p-5 rounded-xl shadow-md w-full my-2"
                        style={{ maxWidth: 400, backgroundColor: colors.surface }}
                    >
                        {/* Route Title */}
                        <Text className="text-lg mb-2 text-center"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: themeMode === 'light' ? "#0891b2" : "#22d3ee" }}
                        >
                            {item.routeName.replace('-', "<>")}
                        </Text>

                        {/* Timings Section */}
                        <View className="mb-3">
                            <Text className="text-sm mb-2"
                                style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: themeMode === 'light' ? "#374151" : "#d1d5db" }}
                            >
                                المواعيد المتاحة:
                            </Text>

                            <View className="flex-row flex-wrap gap-2 justify-start">
                                {item.times.map((time) => (
                                    <View
                                        key={time}
                                        className=" px-2 py-1 rounded"
                                        style={{ backgroundColor: colors.border }}
                                    >
                                        <Text className="text-xs"
                                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: themeMode === 'light' ? "#374151" : "#d1d5db" }}
                                        >
                                            {time}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Waiting Point */}
                        <View>
                            <View className="flex-row items-center justify-start mb-1">
                                <Ionicons
                                    name="location-outline"
                                    size={16}
                                    color="#94a3b8"
                                    style={{ marginLeft: 4 }}
                                />
                                <Text className="text-sm"
                                    style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: themeMode === 'light' ? "#374151" : "#d1d5db" }}
                                >
                                    مكان الانتظار:
                                </Text>
                            </View>

                            <Text className="text-sm text-left mx-2"
                                style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                            >
                                {item.waitingLocation}
                            </Text>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}