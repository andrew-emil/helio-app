import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

export default function AnimatedGradientTitle() {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-120, 120], // move gradient but always covering text
    });

    return (
        <MaskedView
            maskElement={
                <Text
                    style={{ fontFamily: FONTS_CONSTANTS.bold }}
                    className="p-3 text-center text-2xl">
                    Helio App
                </Text>
            }
        >
            <Animated.View style={{ transform: [{ translateX }] }}>
                <LinearGradient
                    colors={["red", "blue", "red"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: 120, height: 50 }}
                />
            </Animated.View>
        </MaskedView>
    );
}