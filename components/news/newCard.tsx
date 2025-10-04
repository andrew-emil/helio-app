import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { useBg } from '@/hooks/useBg';
import { NewsDocData } from '@/types/firebaseDocs.type';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const NewsCard: React.FC<{ newsItem: NewsDocData }> = ({ newsItem }) => {
    const { colors } = useTheme()
    const { bg } = useBg()

    return (
        <Link href={`/news/${newsItem.id}`} className="rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 px-2 left-8 text-right w-4/5"
            style={{ backgroundColor: colors.background }}>

            <View className="relative w-full pt-1">
                <Image
                    source={{ uri: newsItem.imageUrl }}
                    className="rounded-lg w-full h-40"
                    style={{ aspectRatio: 16 / 9 }}
                    resizeMode="cover"
                />
            </View>

            <View className="p-4">
                <Text className="text-sm mb-2"
                    style={{ color: colors.muted, fontFamily: FONTS_CONSTANTS.regular }}
                >
                    {new Date(newsItem.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}
                </Text>
                <Text className="text-lg mb-2 h-16 overflow-hidden group-hover:text-cyan-500"
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
