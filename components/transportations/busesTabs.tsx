import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import React, { Suspense, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Spinner from "../spinner";
import { BusesExternal } from "./busesExternal";
import BusesInternal from "./busesInternal";

export default function BusTabsSection() {
    const [activeTab, setActiveTab] = useState<"internal" | "external">(
        "internal"
    );

    return (
        <View className="w-full px-4">
            {/* Tabs */}
            <View className="flex-row bg-[#0f172a] rounded-xl p-1">
                <TouchableOpacity
                    className={`flex-1 items-center py-3 rounded-lg ${activeTab === "internal" ? "bg-[#1e293b]" : ""
                        }`}
                    onPress={() => setActiveTab("internal")}
                >
                    <Text
                        className={`text-base ${activeTab === "internal" ? "text-white" : "text-gray-400"
                            }`}
                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    >
                        الباصات الداخلية
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 items-center py-3 rounded-lg ${activeTab === "external" ? "bg-[#1e293b]" : ""
                        }`}
                    onPress={() => setActiveTab("external")}
                >
                    <Text
                        className={`text-base ${activeTab === "external" ? "text-white" : "text-gray-400"
                            }`}
                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                    >
                        الباصات الخارجية
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content below tabs */}
            <View className="mt-6">
                {activeTab === "internal" ? (
                    <Suspense fallback={<Spinner />}>
                        <BusesInternal />
                    </Suspense>
                ) : (
                    <Suspense fallback={<Spinner />}>
                        <BusesExternal />
                    </Suspense>
                )}
            </View>
        </View>
    );
}
