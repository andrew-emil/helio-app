import NewsCard from "@/components/news/newCard";
import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
    const { colors } = useTheme();
    const { news } = useData()
    const sortedNews = [...(news ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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
                    title="أخبار المدينة"
                    subtitle="كن على اطلاع بآخر المستجدات والأحداث في هليوبوليس الجديدة."
                    icon={<Ionicons name="newspaper-outline" size={48} color="#a855f7" />}
                />
                <View className='py-10 mt-4 w-full rounded'>
                    {sortedNews.length > 0 ? (
                        <FlatList
                            data={news}
                            renderItem={({ item }) => (
                                <View className='left-0 relative mt-4 min-w-full rounded'>
                                    <NewsCard newsItem={item} />
                                </View>
                            )
                            }
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 16 }}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View
                            className="text-center py-16 rounded-xl shadow-lg"
                            style={{ backgroundColor: colors.background }}
                        >
                            <Text
                                className="text-xl"
                                style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                لا توجد أخبار حالياً
                            </Text>
                            <Text
                                className="mt-2"
                                style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                            >
                                يرجى التحقق مرة أخرى قريباً.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}