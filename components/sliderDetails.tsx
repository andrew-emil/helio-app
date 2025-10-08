import { useTheme } from "@/context/themeContext";
import { toRgba } from "@/utils/toRgb";
import React, { useEffect, useState } from "react";
import {
    ImageBackground,
    StyleSheet,
    View
} from "react-native";
import Swiper from 'react-native-swiper';

type SliderProps = {
    images: string[];
}

function SliderItem({ item }: { item: string }) {
    const { colors } = useTheme();
    const overlayColor = toRgba(colors.background ?? "#000000", 0.45);

    return (
        <View
            className="h-48 w-full overflow-hidden rounded-xl flex-1 justify-center">
            <ImageBackground
                source={{ uri: item }}
                resizeMode='stretch'
                style={[styles.imageBackground, { backgroundColor: colors.surface ?? "#111" }]}
                imageStyle={styles.imageStyle}
            >
                <View style={[styles.overlay, { backgroundColor: overlayColor }]} pointerEvents="none" />
            </ImageBackground>
        </View>
    );
}


export default function SliderDetails({
    images,
}: SliderProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { colors } = useTheme();

    useEffect(() => {
        if (currentIndex >= images.length) setCurrentIndex(0);
    }, [currentIndex, images.length]);

    const showControls = images.length > 1;

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
                dot={<Dot active={false} />}
                activeDot={<Dot active={true} />}
                onIndexChanged={(i) => setCurrentIndex(i)}
            >
                {images.map((img, idx) => (
                    <SliderItem item={img} key={idx} />
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