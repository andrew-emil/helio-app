import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ImageBackground,
    Keyboard,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import GradientText from "../gradiantText";

interface HeroSectionProps {
    services: ServiceDocData[];
    placeholder?: string;
}

export default function HeroSection({
    services,
    placeholder = "ابحث عن مطعم، صيدلية، أو أي خدمة...",
}: HeroSectionProps) {
    const { colors } = useTheme();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [results, setResults] = useState<ServiceDocData[]>([]);
    const [highlightIndex, setHighlightIndex] = useState(0);

    const typingTimeout = useRef<number | null>(null);
    const inputRef = useRef<TextInput | null>(null);
    const inputWrapperRef = useRef<View | null>(null);
    const [inputLayout, setInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    // Prevent immediate reopen after selection
    const ignoreNextShow = useRef(false);

    const filterServices = useCallback(
        (q: string) => {
            const normalized = q.trim().toLowerCase();
            if (!normalized) {
                setResults([]);
                setHighlightIndex(0);
                return;
            }
            const filtered = services.filter((s) => (s.name ?? "").toLowerCase().includes(normalized));
            setResults(filtered);
            setHighlightIndex(0);
        },
        [services]
    );

    // debounce filtering
    useEffect(() => {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = (globalThis.setTimeout as unknown as typeof setTimeout)(() => {
            filterServices(query);
        }, 150) as unknown as number;
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [filterServices, query, services]);

    // hide suggestions when keyboard hidden
    useEffect(() => {
        const sub = Keyboard.addListener("keyboardDidHide", () => {
            setShowSuggestions(false);
        });
        return () => sub.remove();
    }, []);

    // measure input position when suggestions open or on layout changes
    useEffect(() => {
        if (!showSuggestions) return;
        const t = setTimeout(() => {
            try {
                const target = inputWrapperRef.current ?? inputRef.current;
                if (target && (target as any).measureInWindow) {
                    (target as any).measureInWindow((x: number, y: number, width: number, height: number) => {
                        setInputLayout({ x, y, width, height });
                    });
                }
            } catch (e) {
                console.warn("measureInWindow failed:", e);
            }
        }, 60);
        return () => clearTimeout(t);
    }, [showSuggestions, results.length, query]);

    const handleSelect = async (service: ServiceDocData) => {
        console.log("handleSelect fired for:", service?.id);

        // prevent immediate re-open
        ignoreNextShow.current = true;
        setTimeout(() => (ignoreNextShow.current = false), 700);

        // close dropdown and blur
        setShowSuggestions(false);
        inputRef.current?.blur();
        Keyboard.dismiss();

        // example navigation (uncomment when ready)
        // try {
        //   await router.push(`/service/${service.id}`);
        // } catch (e) {
        //   console.warn("navigation error", e);
        // }
    };

    const handleSubmitEditing = () => {
        if (results.length > 0) {
            setShowSuggestions(true);
            setHighlightIndex(0);
            return;
        }
        inputRef.current?.blur();
    };

    const renderHighlighted = (text: string, q: string) => {
        if (!text) return null;
        const lower = text.toLowerCase();
        const qLower = (q || "").toLowerCase();
        const idx = qLower.length === 0 ? -1 : lower.indexOf(qLower);

        if (idx === -1 || qLower.length === 0) {
            return (
                <Text style={{ fontFamily: FONTS_CONSTANTS.medium, color: colors.text }}>
                    {text}
                </Text>
            );
        }

        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + qLower.length);
        const after = text.slice(idx + qLower.length);

        return (
            <Text style={{ fontFamily: FONTS_CONSTANTS.medium, color: colors.text }}>
                <Text>{before}</Text>
                <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: colors.text }}>{match}</Text>
                <Text>{after}</Text>
            </Text>
        );
    };

    // compute top offset for overlay safe placement (tweak on devices if needed)
    const overlayTop = inputLayout ? inputLayout.y + inputLayout.height + 6 : (Platform.OS === "ios" ? 160 : 140);

    return (
        <ImageBackground source={require("@/assets/images/hero.jpg")} resizeMode="cover" style={styles.heroBackground} imageStyle={{ opacity: 0.25 }}>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background + "40" }]} pointerEvents="none" />

            <View className="pb-16 px-6 items-center justify-center" style={styles.heroContent}>
                <GradientText
                    colors={["#27d0ee", "#BE85FC"]}
                    style={{
                        fontFamily: FONTS_CONSTANTS.semiBold,
                        fontSize: 20,
                        textAlign: "center",
                        width: "100%",
                    }}
                >
                    هليوبوليس الجديدة بين يديك
                </GradientText>

                <Text style={{ textAlign: "center", marginTop: 4, fontSize: 16, color: colors.text, fontFamily: FONTS_CONSTANTS.medium }}>
                    دليلك الشامل للخدمات والأخبار والمجتمع.
                </Text>

                {/* Search Input */}
                <View
                    ref={inputWrapperRef}
                    onLayout={() => {
                        // allow measureInWindow to run when requested
                    }}
                    className="w-full max-w-xl relative mt-4"
                    style={{ overflow: "visible" }}
                >
                    <View style={{ width: "100%", alignSelf: "center" }}>
                        <TextInput
                            ref={inputRef}
                            placeholder={placeholder}
                            placeholderTextColor="#9ca3af"
                            value={query}
                            onChangeText={(t) => {
                                setQuery(t);
                                if (!ignoreNextShow.current) setShowSuggestions(true);
                            }}
                            onFocus={() => {
                                if (!ignoreNextShow.current && query.length > 0) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                // avoid immediate hide here to prevent cancelling taps; keyboard listener will close
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                const k = nativeEvent.key;
                                if (k === "Enter" || k === "\n" || k === "Search") handleSubmitEditing();
                            }}
                            onSubmitEditing={() => handleSubmitEditing()}
                            onEndEditing={() => handleSubmitEditing()}
                            multiline={false}
                            returnKeyType="search"
                            className="w-full pl-4 pr-12 py-3 text-sm rounded-full shadow-lg focus:outline-none"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                fontFamily: FONTS_CONSTANTS.medium,
                            }}
                        />

                        <Pressable onPress={handleSubmitEditing} style={{ position: "absolute", right: 44, top: "25%" }}>
                            <Ionicons name="search" size={20} color="#9ca3af" />
                        </Pressable>

                        {query.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    ignoreNextShow.current = true;
                                    setTimeout(() => (ignoreNextShow.current = false), 400);
                                    setQuery("");
                                    setResults([]);
                                    setShowSuggestions(false);
                                    inputRef.current?.focus();
                                }}
                                style={{ position: "absolute", right: 12, top: "25%" }}
                            >
                                <Ionicons name="close-circle" size={20} color="#9ca3af" />
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>

            {/* Overlay — rendered last so it's on top. pointerEvents 'box-none' allows underlying views to be interactive except the overlay itself */}
            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                {showSuggestions && query.trim().length > 0 && (
                    <View style={{ position: "absolute", top: overlayTop, left: 0, right: 0, zIndex: 9999, elevation: 9999 }} pointerEvents="box-none">
                        {/* Backdrop: fills the area above and below the suggestion box (closes when pressed) */}
                        <Pressable
                            // backdrop area above suggestion box — catches taps to dismiss
                            onPress={() => {
                                console.log("overlay backdrop pressed");
                                setShowSuggestions(false);
                            }}
                            style={{ position: "absolute", top: -9999, bottom: -9999, left: 0, right: 0 }}
                            pointerEvents="auto"
                        />

                        {/* Suggestions container (on top) */}
                        <View
                            pointerEvents="auto"
                            style={{
                                marginHorizontal: 16,
                                alignSelf: "center",
                                width: inputLayout ? inputLayout.width : undefined,
                                maxHeight: 300,
                                backgroundColor: colors.surface,
                                borderRadius: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 20,
                                paddingVertical: 6,
                                overflow: "hidden",
                                top: -95
                            }}
                        >
                            {results.length === 0 ? (
                                <View style={{ padding: 12 }}>
                                    <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.medium }}>لا توجد نتائج</Text>
                                </View>
                            ) : (
                                <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
                                    {results.map((item, index) => {
                                        return (
                                            <Pressable
                                                key={item.id}
                                                onPressIn={() => {
                                                    console.log("press in overlay item:", item.id);
                                                }}
                                                onPress={() => {
                                                    console.log("press overlay item:", item.id);
                                                    handleSelect(item);
                                                }}
                                                style={{
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 14,
                                                    borderTopWidth: index === 0 ? 0 : 1,
                                                    borderTopColor: colors.background + "20",
                                                    backgroundColor: index === highlightIndex ? colors.background + "10" : "transparent",
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <View style={{ flex: 1 }}>
                                                        {renderHighlighted(item.name, query)}
                                                        {item.subCategory ? (
                                                            <Text style={{ fontSize: 12, marginTop: 2, color: colors.text + "99", fontFamily: FONTS_CONSTANTS.medium }}>
                                                                {item.subCategory}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    heroBackground: {
        width: "100%",
        minHeight: 220,
        justifyContent: "center",
    },
    heroContent: {
        paddingTop: 24,
        paddingBottom: 24,
    },
});
