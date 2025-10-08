import EmptyState from "@/components/emptyState";
import ErrorFallback from "@/components/errorFallback";
import PropertyCard from "@/components/home/propertyCard";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import { getAllProperties } from "@/services/firebase/properties";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RealState() {
    const { colors } = useTheme()
    const { bg } = useBg()
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

    const { data: properties, isLoading, error } = useQuery({
        queryKey: ['properties'],
        queryFn: async () => await getAllProperties()
    })

    const filteredProperties = useMemo(() => {
        if (!properties) return []; // return an array (not undefined)

        const term = searchTerm.toLowerCase();

        return properties.filter(prop => {
            // defensive: ensure title/address are strings before calling toLowerCase
            const title = String(prop?.title ?? '').toLowerCase();
            const address = String(prop?.address ?? '').toLowerCase();

            const matchesSearch =
                term === '' ||
                title.includes(term) ||
                address.includes(term);

            const matchesFilter = typeFilter === 'all' || prop?.type === typeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [properties, searchTerm, typeFilter]);


    if (isLoading || !properties) return <Spinner />
    if (error) return <ErrorFallback />



    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title="العقارات المتاحة"
                    subtitle="أرقام تهمك للحالات الطارئة داخل وخارج المدينة."
                    icon={<Ionicons name="business" size={48} color="#F59E0B" />}
                />

                {/* Filters */}
                <View className="flex-row items-center justify-between mx-4 mt-4 p-3 rounded-2xl shadow-md"
                    style={{ backgroundColor: colors.surface }}
                >
                    <View className="flex-1 relative">
                        <Ionicons
                            name="search"
                            size={20}
                            color="#9ca3af"
                            style={{ position: "absolute", right: 10, top: 14 }}
                        />
                        <TextInput
                            placeholder="بحث بالعنوان أو المنطقة..."
                            placeholderTextColor="#9ca3af"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            className={`${bg("bg-slate-100 text-gray-800", "bg-stale-700 text-gray-100")} rounded-xl py-2 pr-9 pl-3`}
                        />
                    </View>

                    <View className="flex-row ml-2">
                        <TouchableOpacity
                            onPress={() => setTypeFilter("all")}
                            className={`px-3 py-2 rounded-lg mx-1 ${typeFilter === "all"
                                ? "bg-cyan-500"
                                : bg("bg-slate-200", "bg-slate-700")
                                }`}
                        >
                            <Text
                                className={`${typeFilter === "all" ? "text-white" : bg("text-gray-700", "text-gray-200")
                                    }`}
                                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                الكل
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setTypeFilter("sale")}
                            className={`px-3 py-2 rounded-lg mx-1 ${typeFilter === "sale"
                                ? "bg-cyan-500"
                                : bg("bg-slate-200", "bg-slate-700")
                                }`}
                        >
                            <Text
                                className={`${typeFilter === "sale" ? "text-white" : bg("text-gray-700", "text-gray-200")
                                    }`}
                                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                بيع
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setTypeFilter("rent")}
                            className={`px-3 py-2 rounded-lg mx-1 ${typeFilter === "rent"
                                ? "bg-cyan-500"
                                : bg("bg-slate-200", "bg-slate-700")
                                }`}
                        >
                            <Text
                                className={`${typeFilter === "rent" ? "text-white" : bg("text-gray-700", "text-gray-200")
                                    }`}
                                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                إيجار
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Properties List */}
                {filteredProperties && filteredProperties.length > 0 ? (
                    <FlatList
                        data={filteredProperties}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View className="mx-4 mt-4">
                                <PropertyCard property={item} />
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                ) : (
                    <View className="mt-16">
                        <EmptyState
                            icon={<Entypo name="home" size={64} color="#94a3b8" />}
                            title="لا توجد عقارات تطابق بحثك"
                            message="حاول تغيير الفلاتر أو توسيع نطاق البحث للعثور على ما تبحث عنه."
                        />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}