import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Dimensions, Image, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: windowWidth } = Dimensions.get("window");

export const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const carouselRef = useRef<any>(null);

    if (!images || images.length === 0) {
        return (
            <View className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-lg items-center justify-center">
                <Ionicons name="home" size={60} color="#94a3b8" />
            </View>
        );
    }

    return (
        <View className="w-full h-64">
            <Carousel
                ref={carouselRef}
                loop
                width={windowWidth - 32}
                height={240}
                autoPlay={false}
                data={images}
                renderItem={({ item, index }) => (
                    <Image
                        source={{ uri: item }}
                        style={{ width: windowWidth - 32, height: 240, borderRadius: 12 }}
                        resizeMode="cover"
                    />
                )}
                onConfigurePanGesture={(g) => { 'worklet'; g.activeOffsetX([-10, 10]); }}
            />
        </View>
    );
};