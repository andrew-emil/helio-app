import GradientText from "@/components/gradiantText";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import useFontsLoader from "@/hooks/useFontLoader";
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

// Keep the native splash screen visible while we prepare the custom one and load fonts.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const { isGuest, isLoggedIn } = useUser();
  const appReady = useFontsLoader();
  const { colors } = useTheme();

  // Enhanced Animation values
  const logoPosition = useRef(new Animated.Value(300)).current; // Start from bottom
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    async function prepareAndHide() {
      if (appReady) {
        // Enhanced animation sequence with spin and movement
        Animated.sequence([
          // Logo animation: spin + move from bottom to center + scale
          Animated.parallel([
            // Move from bottom to center
            Animated.timing(logoPosition, {
              toValue: 0,
              duration: 1200,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            // Spin animation
            Animated.timing(logoRotation, {
              toValue: 1,
              duration: 1200,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            // Scale animation
            Animated.spring(logoScale, {
              toValue: 1,
              tension: 60,
              friction: 7,
              useNativeDriver: true,
            }),
          ]),

          // Brief pause when logo reaches center
          Animated.delay(300),

          // Text animation
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

          // Keep everything visible for a moment
          Animated.delay(800),
        ]).start(async () => {
          // After animations finish, hide the native splash screen and navigate
          await SplashScreen.hideAsync();
          if (isGuest || isLoggedIn) {
            router.replace('/(drawer)/tabs/home');
          } else {
            router.replace("/(auth)/login");
          }
        });
      }
    }

    prepareAndHide();
  }, [appReady, logoPosition, logoRotation, logoScale, isGuest, isLoggedIn, router, textOffset, textOpacity]);

  // Interpolate rotation value
  const rotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Logo with spin and movement */}
      <Animated.View style={[
        styles.logoContainer,
        {
          transform: [
            { translateY: logoPosition },
            { rotate: rotate },
            { scale: logoScale }
          ]
        }
      ]}>
        <Image
          source={require("@/assets/images/icon2.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.spacer} />

      {/* Gradient Text - Fixed Implementation */}
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textOffset }] }}>
        {/* Use GradientText for the main title */}
        <GradientText
          colors={['#27d0ee', '#BE85FC']}
          style={{
            fontFamily: FONTS_CONSTANTS.semiBold,
            fontSize: 18,
            textAlign: 'center',
            width: "100%"
          }}
        >
          هليوبوليس الجديدة بين يديك
        </GradientText>

        {/* Subtitle remains normal text */}
        <Text style={{
          textAlign: 'center',
          marginTop: 4,
          fontSize: 14,
          color: colors.text,
          fontFamily: FONTS_CONSTANTS.medium
        }}>
          دليلك الشامل للخدمات والأخبار والمجتمع.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  spacer: {
    height: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  gradientTextContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gradientBackground: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientText: {
    fontFamily: FONTS_CONSTANTS.semiBold,
    fontSize: 18,
    textAlign: 'center',
    color: 'white', // This text will appear on the gradient background
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 14,
    fontFamily: FONTS_CONSTANTS.medium,
  },
});