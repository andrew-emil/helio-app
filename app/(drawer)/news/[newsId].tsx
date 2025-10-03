import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import ShareButton from "@/components/shareButton";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import { getNewsById } from "@/services/firebase/news";
import { NewsDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, } from "expo-router";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewsDetails() {
    const { newsId } = useLocalSearchParams();
    const { colors, themeMode } = useTheme()
    const { bg } = useBg()

    if (!newsId) {
        throw new Error("Missing news id");
    }

    const { data: news, isLoading, error } = useQuery<NewsDocData | null>({
        queryKey: ["single-news"],
        queryFn: () => getNewsById(newsId as string),
        enabled: !!newsId,
    })

    if (isLoading) return <Spinner />;
    if (error) return <ErrorFallback />;

    const formattedDate =
        new Date(news!.createdAt).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });

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
                    title={news!.title}
                    subtitle={`نشر في ${formattedDate}`}
                    icon={<Ionicons name="newspaper-outline" size={48} color="#a855f7" />}
                />

                <View className="px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto">
                    <View className="p-6 sm:p-8 rounded-2xl shadow-lg"
                        style={{ backgroundColor: colors.surface }}>
                        {news!.imageUrl && (
                            <Image
                                source={{ uri: news!.imageUrl }}
                                alt={news!.title}
                                className="w-full max-h-[500px] rounded-xl shadow-md mb-8"
                                resizeMode="cover"
                            />
                        )}

                        <View className="mb-4">
                            <Text className="text-lg leading-relaxed"
                                style={{ fontFamily: FONTS_CONSTANTS.regular, color: themeMode === "light" ? "#374151" : "#d1d5db" }}>
                                {news!.content}
                            </Text>
                        </View>

                        <View className={`mt-8 pt-6 border-t ${bg(" border-slate-200", "border-slate-700")} flex flex-col sm:flex-row gap-4 items-center`}>
                            <ShareButton
                                title={news!.title}
                                text={news!.content.substring(0, 100) + "..."}
                            />

                            {news!.link && (
                                <Pressable
                                    onPress={() => Linking.openURL(news!.link)}
                                    className="bg-cyan-500 px-6 py-3 rounded-lg w-full sm:w-auto"
                                >
                                    <Text className="text-white text-center"
                                        style={{ fontFamily: FONTS_CONSTANTS.semiBold }}>
                                        قراءة المزيد من المصدر
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}