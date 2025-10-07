import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { useBg } from '@/hooks/useBg';
import { NewsDocData } from '@/types/firebaseDocs.type';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const NewsCard: React.FC<{ newsItem: NewsDocData }> = ({ newsItem }) => {
    const { colors } = useTheme();
    const { bg } = useBg();

    return (
        // give the card a max width and push it to the right
        <Link
            href={`/news/${newsItem.id}`}
            className="rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 relative text-right"
            // style merges after className/nativewind styles: alignSelf will push it right
            style={{
                backgroundColor: colors.background,
                alignSelf: 'flex-end',    // stick card to the right
                width: '100%',
            }}
        >
            <Image
                source={{ uri: newsItem.imageUrl }}
                className="rounded-lg w-full h-40"
                style={{ aspectRatio: 16 / 9, width: '100%' }} // ensure image fills the card width
                resizeMode="cover"
            />

            <View className="p-4">
                <Text
                    className="text-sm mb-2"
                    style={{
                        color: colors.muted,
                        fontFamily: FONTS_CONSTANTS.regular,
                        textAlign: 'left',
                    }}
                >
                    {new Date(newsItem.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}
                </Text>

                <Text
                    className="text-lg mb-2 h-16 overflow-hidden group-hover:text-cyan-500"
                    style={{
                        fontFamily: FONTS_CONSTANTS.bold,
                        color: colors.text,
                        textAlign: 'left',
                    }}
                >
                    {newsItem.title}
                </Text>

                <Text
                    className={`${bg("text-gray-600", "text-gray-300")} text-sm h-12 overflow-hidden text-ellipsis`}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={{
                        fontFamily: FONTS_CONSTANTS.regular,
                        textAlign: 'left',
                    }}
                >
                    {newsItem.content}
                </Text>
            </View>
        </Link>
    );
};

export default NewsCard;
