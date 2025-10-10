import GradientText from "@/components/gradiantText";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useData } from "@/context/dataContext";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import useFontsLoader from "@/hooks/useFontLoader";
import { useSplashData } from "@/hooks/useSplashData";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const { isGuest, isLoggedIn } = useUser();
  const appReady = useFontsLoader();
  const { colors } = useTheme();
  const { data, isSuccess, isLoading, isError } = useSplashData();
  const { saveInitialData } = useData();



  // Your existing animation refs
  const logoPosition = useRef(new Animated.Value(300)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  // Track data saving state
  const [dataSaved, setDataSaved] = useState(false);
  const savedRef = useRef(false);

  // Start pulsing animation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startPulsing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Animate progress indicator
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animateProgress = () => {
    Animated.parallel([
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: 100,
        duration: 2500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Handle data saving
  useEffect(() => {
    if (isSuccess && data && !savedRef.current) {
      savedRef.current = true;

      (async () => {
        try {
          await saveInitialData({
            services: data.services ?? [],
            news: data.news ?? [],
            advertisements: data.advertisements ?? [],
            properties: data.properties ?? [],
          });
          setDataSaved(true);
        } catch (saveError) {
          console.error('❌ Splash: Failed to save data to context', saveError);
          // Still set dataSaved to true to prevent infinite hanging
          setDataSaved(true);
        }
      })();
    }
  }, [isSuccess, data, saveInitialData]);

  const waitFor = async (predicate: () => boolean, timeout = 10000, interval = 150) => {
    const start = Date.now();
    while (!predicate()) {
      if (Date.now() - start > timeout) {

        return false;
      }
      await new Promise(res => setTimeout(res, interval));
    }
    return true;
  };

  useEffect(() => {
    let mounted = true;

    async function prepareAndHide() {
      if (!appReady) return

      // Start animations
      startPulsing();
      animateProgress();
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoPosition, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoRotation, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(textOffset, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(800),
      ]).start(async () => {
        if (!mounted) return;
        // Wait for data to be saved OR timeout after 10 seconds
        await waitFor(() => isSuccess && dataSaved, 10000, 200);

        if (!mounted) return;

        await SplashScreen.hideAsync();
        // Navigate based on auth status
        if (isGuest || isLoggedIn) {
          router.replace('/(drawer)/tabs/home');
        } else {
          router.replace("/(auth)/login");
        }
      });
    }

    prepareAndHide();

    return () => {
      mounted = false;
      // Clean up all animations
      [logoPosition, logoRotation, logoScale, textOpacity, textOffset, pulseAnim, progressWidth, progressOpacity].forEach(
        anim => anim.stopAnimation()
      );
    };
  }, [appReady, isSuccess, dataSaved, isGuest, isLoggedIn, startPulsing, animateProgress, logoPosition, logoRotation, logoScale, textOpacity, textOffset, data, isLoading, router, pulseAnim, progressWidth, progressOpacity]);

  // Your existing animation interpolations and JSX remain the same
  const rotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const progressInterpolated = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}
      className="flex-1 justify-center items-center px-3 w-full"
    >
      <Animated.View style={
        {
          transform: [
            { translateY: logoPosition },
            { rotate: rotate },
            { scale: Animated.multiply(logoScale, pulseAnim) }
          ]
        }
      }
        className="justify-center items-center"
      >
        <Image
          source={require("@/assets/images/icon2.png")}
          resizeMode="cover"
          className="w-52 h-52 rounded-2xl"
        />
      </Animated.View>
      <View className="h-4" />
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textOffset }] }}>
        <GradientText
          colors={['#27d0ee', '#BE85FC']}
          style={{
            fontFamily: FONTS_CONSTANTS.semiBold,
            fontSize: 20,
            textAlign: 'center',
            width: "100%",
          }}
        >
          هليوبوليس الجديدة بين يديك
        </GradientText>
        <Text style={{
          color: colors.text,
          fontFamily: FONTS_CONSTANTS.medium
        }}
          className="text-center mt-1 text-lg flex-shrink"
        >
          دليلك الشامل للخدمات والأخبار والمجتمع.
        </Text>
      </Animated.View>

      {/* Progress Indicator */}
      <Animated.View
        style={{ opacity: progressOpacity }}
        className="mt-10 items-center w-4/5"
      >
        <View
          className="h-1 bg-black/10 w-full rounded overflow-hidden"
        >
          <Animated.View
            style={{ width: progressInterpolated, backgroundColor: colors.primary }}
            className="h-full rounded"
          />
        </View>
        <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.medium }}
          className="mt-2 text-sm"
        >
          {isLoading ? "جاري تحميل البيانات..." :
            isError ? "جاري التحضير..." :
              "جاري التحميل..."}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}