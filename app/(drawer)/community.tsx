import NewPostForm from "@/components/community/newPostForm";
import PostCard from "@/components/community/postCard";
import EmptyState from "@/components/emptyState";
import PageBanner from "@/components/pageBanner";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { getAllPosts } from "@/services/firebase/posts";
import { PostDocData } from "@/types/firebaseDocs.type";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatIcon, PlusIcon, TagIcon } from "../../components/community/icons";

export default function CommunityScreen() {
    const { colors } = useTheme();
    const { user, isLoggedIn } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");
    const [filter, setFilter] = useState<string | "all">("all");

    const postCategories = ["all", "نقاش عام", "نقاش خاص", "سؤال", "حدث", "استطلاع رأي"];

    // ✅ Fetch posts using useQuery
    const {
        data: posts = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });


    // ✅ Sort & filter posts
    const sortedAndFilteredPosts = useMemo(() => {
        let processed = [...posts] as PostDocData[];

        if (filter !== "all") {
            processed = processed.filter((p) => p.category === filter);
        }

        if (sortOrder === "popular") {
            processed.sort(
                (a, b) =>
                    b.likes.length + b.comments.length - (a.likes.length + a.comments.length)
            );
        } else {
            processed.sort(
                (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime()
            );
        }

        processed.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        return processed;
    }, [posts, sortOrder, filter]);

    const handleNew = () => {
        if (!isLoggedIn) {
            console.log("User must log in to add post");
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <PageBanner
                    title="مجتمع هليوبوليس"
                    subtitle="شارك بآرائك..."
                    icon={<ChatIcon color={colors.primary} />}
                />

                <View style={{ padding: 16 }}>
                    {/* Header buttons */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={handleNew}
                            style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        >
                            <PlusIcon color="#fff" />
                        </TouchableOpacity>

                        {/* Filter and Sort Controls */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <TouchableOpacity
                                onPress={() =>
                                    setSortOrder(sortOrder === "latest" ? "popular" : "latest")
                                }
                            >
                                <Text style={{ color: colors.text }}>
                                    {sortOrder === "latest" ? "📅 الأحدث" : "🔥 الأكثر شهرة"}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                <TagIcon color={colors.iconColor} />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {postCategories.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            onPress={() => setFilter(category)}
                                            style={{
                                                backgroundColor:
                                                    filter === category ? colors.primary : colors.border,
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 12,
                                                marginHorizontal: 4,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: filter === category ? "#fff" : colors.text,
                                                    fontSize: 13,
                                                }}
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
                    {isLoading ? (
                        <EmptyState
                            title="جارِ التحميل..."
                            message="يتم تحميل المنشورات من الخادم."
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : isError ? (
                        <EmptyState
                            title="حدث خطأ"
                            message="تعذر تحميل المنشورات. حاول مرة أخرى."
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : sortedAndFilteredPosts.length === 0 ? (
                        <EmptyState
                            title="لا توجد منشورات"
                            message="حاول تغيير الفلتر أو كن أول من يضيف منشوراً!"
                            icon={<ChatIcon color={colors.muted} />}
                        />
                    ) : (
                        <FlatList
                            data={sortedAndFilteredPosts}
                            keyExtractor={(item, index) => item.id ?? `${index}`}
                            renderItem={({ item }) => (
                                <PostCard
                                    post={item}
                                    currentUserId={user?.uid ?? ""}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    )}
                </View>

                {/* New Post Modal */}
                <Modal
                    visible={isModalOpen}
                    animationType="slide"
                    onRequestClose={() => setIsModalOpen(false)}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <NewPostForm
                            onClose={() => setIsModalOpen(false)}
                            onCreate={async (payload) => {
                                setIsModalOpen(false);
                                refetch(); // refresh posts
                            }}
                        />
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    addBtn: {
        padding: 12,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
});
