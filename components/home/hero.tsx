import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { ServiceDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // <-- added
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    FlatList,
    ImageBackground,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
    const router = useRouter(); // <-- added

    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [results, setResults] = useState<ServiceDocData[]>([]);
    const [highlightIndex, setHighlightIndex] = useState(0);

    const typingTimeout = useRef<number | null>(null);
    const inputRef = useRef<TextInput | null>(null);

    const filterServices = useCallback((q: string) => {
        const normalized = q.trim().toLowerCase();
        if (!normalized) {
            setResults([]);
            setHighlightIndex(0);
            return;
        }
        const filtered = services.filter((s) =>
            (s.name ?? "").toLowerCase().includes(normalized)
        );
        setResults(filtered);
        setHighlightIndex(0);
    }, [services])

    // debounce the filtering so each keystroke isn't heavy
    useEffect(() => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = window.setTimeout(() => {
            filterServices(query);
        }, 150);
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [filterServices, query, services]);


    useEffect(() => {
        const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
            setShowSuggestions(false);
        });
        return () => keyboardHide.remove();
    }, []);

    const handleSubmitEditing = () => {
        if (results.length > 0) {
            setShowSuggestions(true);
            setHighlightIndex(0);
            return;
        }
        inputRef.current?.blur();
    };


    const renderHighlighted = (text: string, q: string) => {
        const idx = text.toLowerCase().indexOf(q.toLowerCase());
        if (idx === -1 || q.length === 0) return <Text style={{ fontFamily: FONTS_CONSTANTS.medium }}>{text}</Text>;

        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + q.length);
        const after = text.slice(idx + q.length);

        return (
            <Text style={{ fontFamily: FONTS_CONSTANTS.medium, color: colors.text }}>
                <Text>{before}</Text>
                <Text style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: colors.text }}>{match}</Text>
                <Text>{after}</Text>
            </Text>
        );
    };

    const keyExtractor = (item: ServiceDocData) => item.id;

    return (
        <ImageBackground
            source={require("@/assets/images/hero.jpg")}
            resizeMode="cover"
            style={styles.heroBackground}
            imageStyle={{ opacity: 0.25 }}
        >
            {/* overlay */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background + "40" }]} pointerEvents="none" />

            <View className="pb-16 px-6 items-center justify-center" style={styles.heroContent}>
                {/* Title */}
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

                {/* Subtitle */}
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: 4,
                        fontSize: 16,
                        color: colors.text,
                        fontFamily: FONTS_CONSTANTS.medium,
                    }}
                >
                    دليلك الشامل للخدمات والأخبار والمجتمع.
                </Text>

                {/* Search Input */}
                <View className="w-full max-w-xl relative mt-4" style={{ overflow: 'visible' }}>
                    <View
                        style={{
                            width: "100%",
                            alignSelf: "center",
                        }}
                    >
                        {/* ---------- TextInput ---------- */}
                        <TextInput
                            ref={inputRef}
                            placeholder={placeholder}
                            placeholderTextColor="#9ca3af"
                            value={query}
                            onChangeText={(t) => {
                                setQuery(t);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => {
                                if (query.length > 0) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                // keep minimal delay or rely on keyboard listener; here we do nothing to avoid race
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                const k = nativeEvent.key;
                                if (k === "Enter" || k === "\n" || k === "Search") {
                                    handleSubmitEditing();
                                }
                            }}
                            onSubmitEditing={(e) => {
                                handleSubmitEditing();
                            }}
                            onEndEditing={(e) => {
                                handleSubmitEditing();
                            }}
                            multiline={false}
                            returnKeyType="search"

                            className="w-full pl-4 pr-12 py-3 text-sm rounded-full shadow-lg focus:outline-none"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                fontFamily: FONTS_CONSTANTS.medium,
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                handleSubmitEditing();
                            }}
                            style={{ position: "absolute", right: 44, top: "25%" }}
                        >
                            <Ionicons name="search" size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        {query.length > 0 && (
                            <Pressable
                                onPress={() => {
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

                    {/* Suggestions dropdown */}
                    {showSuggestions && query.trim().length > 0 && (
                        <View
                            style={{
                                position: "absolute",
                                top: 56,
                                left: 0,
                                right: 0,
                                backgroundColor: colors.surface,
                                borderRadius: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 20,        // higher elevation for Android stacking
                                zIndex: 9999,
                                maxHeight: 260,
                                paddingVertical: 6,
                                overflow: "hidden",
                            }}
                        >
                            {results.length === 0 ? (
                                <View style={{ padding: 12 }}>
                                    <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.medium }}>
                                        لا توجد نتائج
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    nestedScrollEnabled={true}            // <-- allow nested scrolling inside parent SectionList
                                    scrollEnabled={true}
                                    keyboardShouldPersistTaps={"handled"}
                                    data={results}
                                    keyExtractor={keyExtractor}
                                    style={{ zIndex: 9999 }}
                                    // optional: give some padding so items don't touch the container edges
                                    contentContainerStyle={{ paddingBottom: 6 }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            // Use TouchableOpacity and router.push instead of Link so onPress debug works.
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    router.push(`/(drawer)/category/service/${item.id}`);
                                                }}
                                                onLongPress={() => console.log("Long press:", item)}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 14,
                                                    borderTopWidth: index === 0 ? 0 : 1,
                                                    borderTopColor: colors.background + "20",
                                                    backgroundColor: index === highlightIndex ? colors.background + "10" : "transparent",
                                                    width: '100%',
                                                    right: 2
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <View style={{ flex: 1 }}>
                                                        {renderHighlighted(item.name, query)}
                                                        {item.subCategory ? (
                                                            <Text
                                                                style={{
                                                                    fontSize: 12,
                                                                    marginTop: 2,
                                                                    color: colors.text + "99",
                                                                    fontFamily: FONTS_CONSTANTS.medium,
                                                                }}
                                                            >
                                                                {item.subCategory}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    heroBackground: {
        width: '100%',
        minHeight: 220,
        justifyContent: 'center',
    },
    heroContent: {
        paddingTop: 24,
        paddingBottom: 24,
    },
});
