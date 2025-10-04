import ServiceCard from '@/components/favorites/servicesCard';
import HeroSection from '@/components/home/hero';
import PropertyCard from '@/components/home/propertyCard';
import QuickAccessCard from '@/components/home/quickAccessCard';
import Slider from '@/components/home/slider';
import NewsCard from '@/components/news/newCard';
import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useData } from '@/context/dataContext';
import { useTheme } from '@/context/themeContext';
import { getQuickAccessItemsFromServices } from '@/utils/getQuickAccessItem';
import { useRouter } from 'expo-router';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { colors } = useTheme();
    const { services, news, advertisements, properties } = useData()
    const router = useRouter()
    const quickAccessItems = getQuickAccessItemsFromServices(services);
    const recentServices = [...services].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
    const recentNews = [...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
    const recentProperties = [...properties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                scrollsToTop
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <HeroSection services={services} />
                {/**
                 //TODO: need some changes
                 */}
                <View style={{ flex: 1 }}>
                    <Slider
                        adverts={advertisements}
                        carouselHeight={260}
                        onItemPress={(item) => {
                            router.push(`/(drawer)/category/service/${item.id}`)
                        }}
                    />
                </View>

                <View className='py-6'>
                    <View className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <Text className="text-2xl text-center mb-6"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >
                            كل ما تحتاجه في هليوبوليس الجديدة
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12
                            }}
                        >
                            {quickAccessItems.map(item => (
                                <QuickAccessCard key={item.title} {...item} />
                            ))}
                        </ScrollView>

                    </View>
                </View>

                {/* Recent Services Section */}
                <View className="py-10 px-4">
                    <Text className="text-2xl text-center mb-6"
                        style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                    >
                        أحدث الخدمات المضافة
                    </Text>
                    <FlatList
                        data={recentServices}
                        renderItem={({ item }) => <ServiceCard service={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 16 }}
                    />
                </View>

                {/* Recent Properties Section */}
                {recentProperties.length > 0 && (
                    <View className="py-10 px-4"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Text className="text-2xl text-center mb-6"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >
                            أحدث العقارات
                        </Text>
                        <FlatList
                            data={recentProperties}
                            renderItem={({ item }) => <PropertyCard property={item} />}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 16 }}
                        />
                        <View className="items-center mt-8">
                            <TouchableOpacity
                                className="px-6 py-3 bg-cyan-500 rounded-lg"
                                onPress={() => router.push('/(drawer)/tabs/realState')}
                            >
                                <Text className="text-white"
                                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                >تصفح كل العقارات</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Recent News Section */}
                {recentNews.length > 0 && (
                    <View className='py-10 mt-4 w-full rounded'
                        style={{ backgroundColor: colors.surface }}
                    >
                        <Text className="text-2xl text-center mb-6"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                        >
                            آخر الأخبار
                        </Text>
                        <FlatList
                            data={recentNews}
                            renderItem={({ item }) => <NewsCard newsItem={item} />}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 16 }}
                        />
                        <View className="items-center mt-8">
                            <TouchableOpacity
                                className="px-6 py-3 bg-cyan-500 rounded-lg"
                                onPress={() => router.push('/(drawer)/news')}
                            >
                                <Text className="text-white"
                                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                >
                                    قراءة كل الأخبار
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
