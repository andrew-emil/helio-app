import { AdvertisementsDocData } from "@/types/firebaseDocs.type";
import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

type SliderProps = {
    adverts: AdvertisementsDocData[]; // passed from Home
    carouselWidth?: number;
    carouselHeight?: number;
    onItemPress?: (item: AdvertisementsDocData) => void;
};

function SliderItem({ item }: { item: AdvertisementsDocData }) {
    return (
        <View style={styles.slideWrapper}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            {!!item.title && (
                <View style={styles.titleContainer}>
                    <Text numberOfLines={2} style={styles.titleText}>
                        {item.title}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function Slider({
    adverts,
    carouselWidth = Math.round(screenWidth),
    carouselHeight = 258,
    onItemPress,
}: SliderProps) {
    const scrollOffsetValue = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // Use a memoized version of items to avoid unnecessary rerenders
    const items = useMemo(() => {
        if (adverts && adverts.length > 0) return adverts;
        // optional small fallback so the Carousel always has something
        return [
            {
                id: "placeholder-1",
                createdAt: new Date(),
                imageUrl: "https://picsum.photos/800/400?random=1",
                title: "Placeholder",
            },
        ] as AdvertisementsDocData[];
    }, [adverts]);

    useEffect(() => {
        // if the current index is out-of-bounds after adverts update, reset to 0
        if (currentIndex >= items.length) setCurrentIndex(0);
    }, [items, currentIndex]);

    return (
        <View style={styles.container} testID="carousel-component">
            <Carousel
                testID={"carousel-adverts"}
                loop={items.length > 1}
                width={carouselWidth}
                height={carouselHeight}
                snapEnabled
                pagingEnabled
                autoPlayInterval={3000}
                data={items}
                defaultScrollOffsetValue={scrollOffsetValue}
                style={{ width: "100%" }}
                onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                    "worklet";
                    g.enabled(false);
                }}
                onSnapToItem={(index: number) => setCurrentIndex(index)}
                renderItem={({ item, index }: { item: AdvertisementsDocData; index: number }) => (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        style={{ flex: 1 }}
                        onPress={() => onItemPress?.(item)}
                    >
                        <SliderItem item={item} />
                    </TouchableOpacity>
                )}
            />

            {/* Pagination */}
            <View style={styles.dotsWrapper}>
                {items.map((_, i) => {
                    const isActive = i === currentIndex;
                    return <View key={`dot-${i}`} style={[styles.dot, isActive && styles.activeDot]} />;
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create<{
    container: ViewStyle;
    slideWrapper: ViewStyle;
    image: ImageStyle;
    overlay: ViewStyle;
    titleContainer: ViewStyle;
    titleText: TextStyle;
    dotsWrapper: ViewStyle;
    dot: ViewStyle;
    activeDot: ViewStyle;
}>({
    container: {
        width: "100%",
        alignItems: "center",
    },
    slideWrapper: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#ddd",
        justifyContent: "center",
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    titleContainer: {
        position: "absolute",
        bottom: 12,
        right: 12,
        left: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    titleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    dotsWrapper: {
        position: "absolute",
        bottom: 8,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.5)",
        marginHorizontal: 4,
    },
    activeDot: {
        transform: [{ scale: 1.4 }],
        backgroundColor: "rgba(255,255,255,0.95)",
    },
});