import { useTheme } from "@/context/themeContext";
import { AdvertisementsDocData } from "@/types/firebaseDocs.type";
import { toRgba } from "@/utils/toRgb";
import React, { useEffect, useMemo, useState } from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    View
} from "react-native";
import Swiper from 'react-native-swiper';

type SliderProps = {
    adverts: AdvertisementsDocData[]; // passed from Home
}

function SliderItem({ item }: { item: AdvertisementsDocData }) {
    const { colors } = useTheme();
    const overlayColor = toRgba(colors.background ?? "#000000", 0.45);

    return (
        <View
            className="h-48 w-full overflow-hidden rounded-xl flex-1 justify-center">
            <ImageBackground
                source={{ uri: item.imageUrl }}
                resizeMode='stretch'
                style={[styles.imageBackground, { backgroundColor: colors.surface ?? "#111" }]}
                imageStyle={styles.imageStyle}
            >
                <View style={[styles.overlay, { backgroundColor: overlayColor }]} pointerEvents="none" />
                {item.title ? (
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={2} style={styles.titleText}>{item.title}</Text>
                    </View>
                ) : null}
            </ImageBackground>
        </View>
    );
}


export default function Slider({
    adverts,
}: SliderProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { colors } = useTheme();

    // duplicate so there are at least two slides for loop/pagination testing
    const items = useMemo(() => {
        return adverts.map((ad) => ({
            id: ad.id,
            title: ad.title ?? "",
            imageUrl: ad.imageUrl,
            createdAt: ad.createdAt,
        }));
    }, [adverts]);

    useEffect(() => {
        if (currentIndex >= items.length) setCurrentIndex(0);
    }, [currentIndex, items.length]);

    const showControls = items.length > 1;

    const Dot = ({ active = false }: { active?: boolean }) => (
        <View
            style={[
                styles.dot,
                {
                    backgroundColor: active ? (colors.text ?? "#FFF") : (colors.muted ?? "rgba(255,255,255,0.4)"),
                    width: active ? 14 : 10,
                    height: active ? 14 : 10,
                    borderRadius: active ? 10 : 6,
                }
            ]}
        />
    );

    return (
        <View style={styles.container}
        >
            <Swiper
                showsPagination={showControls}
                showsButtons={showControls}
                autoplay={showControls}
                loop={showControls}
                paginationStyle={styles.paginationStyle}
                // pass React elements for dot/activeDot
                dot={<Dot active={false} />}
                activeDot={<Dot active={true} />}
                onIndexChanged={(i) => setCurrentIndex(i)}
            >
                {items.map((ad, idx) => (
                    <SliderItem item={ad} key={`${ad.id ?? idx}-${idx}`} />
                ))}
            </Swiper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        flexDirection: 'column',
        gap: 12
    },
    imageBackground: {
        flex: 1,
        justifyContent: "flex-end",
        minHeight: 200,
        overflow: 'visible',
        zIndex: 12
    },
    imageStyle: {
        borderRadius: 12,
        overflow: 'visible'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    titleContainer: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        zIndex: 2,
        position: 'relative',
    },
    titleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    dot: {
        marginHorizontal: 4,
        marginVertical: 8,
    },
    paginationStyle: {
        position: 'absolute',
        bottom: -40, // Position dots below the image
        alignSelf: 'center',
        padding: 12,
        borderRadius: 16,
    },
});