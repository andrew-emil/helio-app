import EmptyState from "@/components/emptyState";
import ServiceCard from "@/components/favorites/servicesCard";
import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Redirect } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favourites() {
    const { isGuest, isLoggedIn } = useUser()
    const { colors } = useTheme();
    const { services } = useData()
    const favoriteServices = services.filter(s => s.isFavorite);
    console.log(isGuest, isLoggedIn)

    if (isGuest) {
        return <Redirect href="/(auth)/login" />
    }

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
                    {favoriteServices.length > 0 ? (
                        <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {favoriteServices.map(service => (
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