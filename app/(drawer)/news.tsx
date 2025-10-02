import NewsCard from "@/components/news/newCard";
import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function News() {
    const { colors } = useTheme()
    const { news } = useData();
    const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <View className="animate-fade-in">
            <PageBanner
                title="أخبار المدينة"
                subtitle="كن على اطلاع بآخر المستجدات والأحداث في هليوبوليس الجديدة."
                icon={<Ionicons name="newspaper-outline" size={48} color="#a855f7" />}

            />
            <View className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sortedNews.length > 0 ? (
                    <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedNews.map(newsItem => (
                            <NewsCard key={newsItem.id} newsItem={newsItem} />
                        ))}
                    </View>
                ) : (
                    <View className="text-center py-16 rounded-xl shadow-lg"
                        style={{ backgroundColor: colors.background }}
                    >
                        <Text className="text-xl"
                            style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.semiBold }}
                        >لا توجد أخبار حالياً
                        </Text>
                        <Text className="mt-2"
                            style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                        >يرجى التحقق مرة أخرى قريباً.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}