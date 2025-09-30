import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useUser } from "@/context/userContext";
import useFontsLoader from "@/hooks/useFontLoader";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { isGuest, isLoggedIn } = useUser();
  const appReady = useFontsLoader();

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!appReady) return;

    // Animate
    Animated.sequence([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(textOffset, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (isGuest || isLoggedIn) {
        router.replace('/(drawer)/tabs/home');
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, [appReady, imageOpacity, isGuest, isLoggedIn, router, textOffset, textOpacity]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Animated.View style={{ opacity: imageOpacity }}>
        <Image
          source={require("@/assets/images/icon2.png")}
          className="w-[200px] h-[200px] rounded-2xl"
          resizeMode="cover"
        />
      </Animated.View>

      <View className="h-5" />

      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textOffset }],
        }}
      >
        <Text className="text-center text-black text-lg"
        style={{fontFamily: FONTS_CONSTANTS.semiBold}}
        >
          تطبيق خدمي ساكني{"\n"}مدينة هليوبوليس الجديدة
        </Text>
      </Animated.View>
    </View>
  );
}
