import ErrorFallback from "@/components/errorFallback";
import NewsCard from "@/components/news/newCard";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { getAllNews } from "@/services/firebase/news";
import { NewsDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
    const { colors } = useTheme();
    const { data: news, isLoading, error } = useQuery<NewsDocData[]>({
        queryKey: ['news'],
        queryFn: getAllNews,
    })

    const sortedNews = [...(news ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (isLoading) return <Spinner />;
    if (error) return <ErrorFallback />;

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
                <View className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {sortedNews.length > 0 ? (
                        <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedNews.map((newsItem) => (
                                <NewsCard key={newsItem.content} newsItem={newsItem} />
                            ))}
                        </View>
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