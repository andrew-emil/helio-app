import EmptyState from "@/components/emptyState";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import ServiceCard from "@/components/service/servicesCard";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useFavorites } from "@/hooks/useFavorites";
import { FavStorage } from "@/services/storage/favoriteStorage";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from "@tanstack/react-query";
import { Link, Redirect } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favourites() {
    const { isGuest, isLoggedIn } = useUser()
    const { colors } = useTheme();
    const { loading } = useFavorites()

    const { data: favorites, error, isLoading } = useQuery<ServiceDocData[]>({
        queryKey: ['favs'],
        queryFn: async () => {
            const favs = await FavStorage.getFavorites()
            return favs
        }
    })

    if (isGuest || !isLoggedIn)
        return <Redirect href="/(auth)/login" />

    if (isLoading || loading || !favorites) return <Spinner />

    if (error) return <ErrorFallback />


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}
            className="animation-fade-in">
            <ScrollView style={styles.scroll} contentContainerStyle={[styles.content]}>
                <PageBanner
                    title="قائمة المفضلة"
                    subtitle="جميع خدماتك المفضلة في مكان واحد."
                    icon={<Ionicons name="heart" size={48} color={colors.error} />}
                />
                <View className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {favorites.length > 0 ? (
                        <View className="flex-1 flex-col justify-center items-center gap-6">
                            {favorites.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </View>
                    ) : (
                        <EmptyState
                            icon={<Ionicons name="heart" size={48} color={colors.muted} />}
                            title="قائمة المفضلة فارغة"
                            message="لم تقم بإضافة أي خدمات إلى المفضلة بعد. ابدأ بتصفح الخدمات وأضف ما يعجبك!"
                        >
                            <Link
                                href="/(drawer)/tabs/services"
                                className="inline-block bg-cyan-500 px-6 py-3 rounded-lg"
                                style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                تصفح الخدمات
                            </Link>
                        </EmptyState>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: "100%",
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    content: {
        padding: 16,
        alignItems: "stretch",
    },
})