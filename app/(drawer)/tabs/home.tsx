import HeroSection from '@/components/home/hero';
import PropertyCard from '@/components/home/propertyCard';
import QuickAccessCard from '@/components/home/quickAccessCard';
import Slider from '@/components/home/slider';
import NewsCard from '@/components/news/newCard';
import ServiceCard from '@/components/service/servicesCard';
import Spinner from '@/components/spinner';
import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useData } from '@/context/dataContext';
import { useTheme } from '@/context/themeContext';
import { getQuickAccessItemsFromServices } from '@/utils/getQuickAccessItem';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SectionItem = any; // union of service/property/news shapes (kept loose for simplicity)

export default function HomeScreen() {
    const { colors } = useTheme();
    const { services, news, advertisements, properties, isLoaded } = useData();
    const router = useRouter();

    const quickAccessItems = getQuickAccessItemsFromServices(services);

    const recentServices = useMemo(() =>
        [...services]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3),
        [services]
    );

    const recentProperties = useMemo(() =>
        [...properties]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3),
        [properties]
    );

    const recentNews = useMemo(() =>
        [...news]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3),
        [news]
    );


    // Build sections only for non-empty datasets so empty sections are omitted
    const sections = useMemo(() => {
        const s: { key: string; title: string; data: SectionItem[] }[] = [];
        if (recentServices.length > 0) s.push({ key: 'services', title: 'أحدث الخدمات المضافة', data: recentServices });
        if (recentProperties.length > 0) s.push({ key: 'properties', title: 'أحدث العقارات', data: recentProperties });
        if (recentNews.length > 0) s.push({ key: 'news', title: 'آخر الأخبار', data: recentNews });
        return s;
    }, [recentServices, recentProperties, recentNews]);

    function renderSectionHeader({ section }: { section: { title: string; key: string } }) {
        // for properties and news show a "view all" button
        const showViewAll = section.key === 'properties' || section.key === 'news';

        if (!isLoaded) return <Spinner />

        return (
            <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.bold,
                            fontSize: 22,
                            color: colors.text,
                            textAlign: 'center',
                        }}
                    >
                        {section.title}
                    </Text>
                </View>
                {showViewAll && (
                    <View style={{ alignItems: 'center', marginTop: 12 }}>
                        <TouchableOpacity
                            className="px-6 py-3 bg-cyan-500 rounded-lg"
                            onPress={() => {
                                if (section.key === 'properties') router.push('/(drawer)/tabs/realState');
                                if (section.key === 'news') router.push('/(drawer)/news');
                            }}
                        >
                            <Text style={{ color: '#fff', fontFamily: FONTS_CONSTANTS.semiBold }}>تصفح الكل</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    function renderItem({ item, section }: { item: SectionItem; section: { key: string } }) {
        if (section.key === 'services') return <ServiceCard service={item} />;
        if (section.key === 'properties') return <PropertyCard property={item} />;
        if (section.key === 'news') return <NewsCard newsItem={item} />;
        return null;
    }

    const listHeader = () => (
        <>
            <HeroSection services={services} />

            {advertisements.length > 0 && (
                <View style={{ paddingVertical: 12, paddingHorizontal: 16, height: 300 }}>
                    <Slider
                        adverts={advertisements}
                    />
                </View>
            )}

            {/* quick access horizontal list */}
            <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
                <Text
                    style={{
                        fontFamily: FONTS_CONSTANTS.bold,
                        fontSize: 22,
                        color: colors.text,
                        textAlign: 'center',
                        marginBottom: 12,
                    }}
                >
                    كل ما تحتاجه في هليوبوليس الجديدة
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                    nestedScrollEnabled={false}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                >
                    {quickAccessItems.map((item) => (
                        <QuickAccessCard key={item.title} {...item} />
                    ))}
                </ScrollView>
            </View>
        </>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10 }}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.id ?? `${index}`}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={listHeader}
                contentContainerStyle={{ paddingBottom: 40 }}
                stickySectionHeadersEnabled={false}
                // Fix scrolling and touch issues
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
                // tuning for nicer spacing between items
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                // Better performance
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={10}
            />
        </SafeAreaView>
    );
}
