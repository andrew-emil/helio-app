import { ChatIcon, PlusIcon, TagIcon } from "@/components/community/icons";
import NewPostForm from "@/components/community/newPostForm";
import PostCard from "@/components/community/postCard";
import EmptyState from "@/components/emptyState";
import PageBanner from "@/components/pageBanner";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { getAllPosts, toggleLikePost } from "@/services/firebase/posts";
import { PostDocData } from "@/types/firebaseDocs.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function CommunityScreen() {
    const { colors } = useTheme();
    const { user, isLoggedIn } = useUser();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");
    const [filter, setFilter] = useState<string | "all">("all");
    const [refreshing, setRefreshing] = useState(false);

    const postCategories = useMemo(() => [
        "all", "نقاش عام", "نقاش خاص", "سؤال", "حدث", "استطلاع رأي"
    ], []);

    // ✅ Fetch posts using useQuery with optimized caching
    const {
        data: posts = [],
        isLoading,
        isError,
        refetch,
        error,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });


    // ✅ Optimized sort & filter posts with better performance
    const sortedAndFilteredPosts = useMemo(() => {
        if (!posts || posts.length === 0) return [];

        let processed = [...posts] as PostDocData[];

        // Filter by category
        if (filter !== "all") {
            processed = processed.filter((p) => p.category === filter);
        }

        // Sort by pinned status first (always show pinned posts at top)
        processed.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        // Then sort by popularity or date
        if (sortOrder === "popular") {
            processed.sort(
                (a, b) => {
                    const aEngagement = (Array.isArray(a.likes) ? a.likes.length : 0) +
                        (Array.isArray(a.comments) ? a.comments.length : 0);
                    const bEngagement = (Array.isArray(b.likes) ? b.likes.length : 0) +
                        (Array.isArray(b.comments) ? b.comments.length : 0);
                    return bEngagement - aEngagement;
                }
            );
        } else {
            processed.sort(
                (a, b) => {
                    const aTime = new Date(a.createdAt || 0).getTime();
                    const bTime = new Date(b.createdAt || 0).getTime();
                    return bTime - aTime;
                }
            );
        }

        return processed;
    }, [posts, sortOrder, filter]);

    // Memoized handlers for better performance
    const handleNew = useCallback(() => {
        if (!isLoggedIn) {
            Alert.alert(
                "تسجيل الدخول مطلوب",
                "يجب تسجيل الدخول لإضافة منشور جديد",
                [{ text: "حسناً", style: "default" }]
            );
            return;
        }
        setIsModalOpen(true);
    }, [isLoggedIn]);

    const handleToggleLike = useCallback(async (postId: string) => {
        if (!isLoggedIn || !user?.uid) {
            Alert.alert(
                "تسجيل الدخول مطلوب",
                "يجب تسجيل الدخول للتفاعل مع المنشورات",
                [{ text: "حسناً", style: "default" }]
            );
            return;
        }

        try {
            await toggleLikePost(postId, user.uid);
            // Optimistically update the cache
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        } catch (error) {
            console.error("Error toggling like:", error);
            Alert.alert(
                "خطأ في التصويت",
                "حدث خطأ أثناء التصويت. يرجى المحاولة مرة أخرى.",
                [{ text: "حسناً", style: "default" }]
            );
        }
    }, [isLoggedIn, user?.uid, queryClient]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (error) {
            console.error("Error refreshing posts:", error);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // const handleSortToggle = useCallback(() => {
    //     setSortOrder(prev => prev === "latest" ? "popular" : "latest");
    // }, []);

    const handleFilterChange = useCallback((category: string) => {
        setFilter(category);
    }, []);

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title="مجتمع هليوبوليس"
                    subtitle="شارك بآرائك..."
                    icon={<ChatIcon color={colors.primary} size={48} />}
                />

                <View style={{ padding: 16 }}>
                    {/* Header buttons */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={handleNew}
                            style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        >
                            <PlusIcon color="#fff" />
                            <Text className="text-white">
                                اضف منشورك
                            </Text>
                        </TouchableOpacity>

                        {/* Filter and Sort Controls */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            {/* <TouchableOpacity
                                onPress={handleSortToggle}
                                style={[
                                    styles.sortButton,
                                    { backgroundColor: colors.surface, borderColor: colors.border }
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={`تصفية حسب ${sortOrder === "latest" ? "الأحدث" : "الأكثر شهرة"}`}
                            >
                                <Text style={{ color: colors.text, fontWeight: "600" }}>
                                    {sortOrder === "latest" ? "📅 الأحدث" : "🔥 الأكثر شهرة"}
                                </Text>
                            </TouchableOpacity> */}

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                <TagIcon color={colors.iconColor} />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.filterScrollView}
                                >
                                    {postCategories.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            onPress={() => handleFilterChange(category)}
                                            style={[
                                                styles.filterButton,
                                                {
                                                    backgroundColor:
                                                        filter === category ? colors.primary : colors.border,
                                                }
                                            ]}
                                            accessibilityRole="button"
                                            accessibilityLabel={`تصفية حسب ${category === "all" ? "الكل" : category}`}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterButtonText,
                                                    {
                                                        color: filter === category ? "#fff" : colors.text,
                                                    }
                                                ]}
                                            >
                                                {category === "all" ? "الكل" : category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    {isLoading && !refreshing ? (
                        <EmptyState
                            title="جارِ التحميل..."
                            message="يتم تحميل المنشورات من الخادم."
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : isError ? (
                        <EmptyState
                            title="حدث خطأ"
                            message={`تعذر تحميل المنشورات. ${error?.message || 'حاول مرة أخرى.'}`}
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : sortedAndFilteredPosts.length === 0 ? (
                        <EmptyState
                            title="لا توجد منشورات"
                            message={`لا توجد منشورات في فئة "${filter === "all" ? "الكل" : filter}". حاول تغيير الفلتر أو كن أول من يضيف منشوراً!`}
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : (
                        <FlatList
                            data={sortedAndFilteredPosts}
                            keyExtractor={(item, index) => item.id ?? `post-${index}`}
                            renderItem={({ item }) => (
                                <PostCard
                                    post={item}
                                    currentUserId={user?.uid ?? ""}
                                    onToggleLike={handleToggleLike}
                                />
                            )}
                            contentContainerStyle={styles.flatListContent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    tintColor={colors.primary}
                                    colors={[colors.primary]}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            updateCellsBatchingPeriod={50}
                            initialNumToRender={10}
                            windowSize={10}
                        />
                    )}
                </View>

                {/* New Post Modal */}
                <Modal
                    visible={isModalOpen}
                    animationType="slide"
                    onRequestClose={() => setIsModalOpen(false)}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                        <NewPostForm
                            onClose={() => setIsModalOpen(false)}
                            onCreate={async (payload) => {
                                setIsModalOpen(false);
                                refetch(); // refresh posts
                            }}
                        />
                    </SafeAreaView>
                </Modal>
                <Toast />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 8,
    },
    addBtn: {
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 48,
        minHeight: 48,
        flexDirection: 'row'
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterScrollView: {
        maxHeight: 40,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginHorizontal: 4,
        minHeight: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: "500",
    },
    flatListContent: {
        paddingBottom: 120,
        paddingTop: 8,
    },
});
