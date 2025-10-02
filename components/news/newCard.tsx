import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { useBg } from '@/hooks/useBg';
import { News } from '@/types/dataContext.type';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const NewsCard: React.FC<{ newsItem: News }> = ({ newsItem }) => {
    const { colors } = useTheme()
    const { bg } = useBg()

    return (
        <Link href={`/news/${newsItem.id}`} className="block rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300"
            style={{ backgroundColor: colors.background }}>
            <View className="relative">
                <Image
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="w-full h-48 object-cover transition-transform duration-300"

                />
            </View>
            <View className="p-4">
                <Text className="text-sm mb-2"
                    style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                >
                    {new Date(newsItem.date).toLocaleDateString('ar-EG-u-nu-latn')} • {newsItem.author}
                </Text>
                <Text className="text-lg mb-2 h-14 overflow-hidden group-hover:text-cyan-500"
                    style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                >
                    {newsItem.title}
                </Text>
                <Text className={`${bg("text-gray-600", "text-gray-300")} text-sm h-12 overflow-hidden text-ellipsis`}
                    style={{ fontFamily: FONTS_CONSTANTS.regular }}
                >
                    {newsItem.content}
                </Text>
            </View>
        </Link>
    );
};

export default NewsCard;
