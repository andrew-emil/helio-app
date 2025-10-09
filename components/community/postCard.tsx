import { PostDocData } from "@/types/firebaseDocs.type";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/themeContext";
import { ChatIcon, LikeIcon, PinIcon } from "./icons";
import PollInCard from "./pollInCard";

type Props = {
    post: PostDocData;
    currentUserId?: string | null;
    onToggleLike?: (postId: string) => void;
};

export default function PostCard({
    post,
    currentUserId,
    onToggleLike,
}: Props) {
    const { colors } = useTheme();
    const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

    // ✅ Safely format Firestore Timestamp or JS Date
    const formattedDate = post.createdAt
        ? new Date(
            (post.createdAt as any)?.toDate
                ? (post.createdAt as any).toDate()
                : post.createdAt
        ).toLocaleDateString("ar-EG")
        : "";

    return (
        <TouchableOpacity
            onPress={() => {
                // TODO: connect to post details page
            }}
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                post.isPinned ? { borderWidth: 2, borderColor: colors.primary } : {},
            ]}
        >
            {/* 🔹 Pinned Label */}
            {post.isPinned && (
                <View
                    style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
                >
                    <PinIcon color={colors.primary} />
                    <Text
                        style={{ marginLeft: 8, color: colors.primary, fontWeight: "700" }}
                    >
                        مثبت
                    </Text>
                </View>
            )}

            {/* 🔹 User Info */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
                <Image
                    source={{ uri: post.avatar || "https://via.placeholder.com/150" }}
                    style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", color: colors.text }}>
                        {post.username}
                    </Text>
                    <Text style={{ color: colors.muted, marginTop: 4 }}>
                        {formattedDate}
                        {"  •  "}
                        <Text style={{ color: colors.primary }}>{post.category}</Text>
                        {post.targetAudience ? `  •  ${post.targetAudience}` : ""}
                    </Text>
                </View>
            </View>

            {/* 🔹 Post Content */}
            {post.title ? (
                <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
            ) : null}

            {post.content ? (
                <Text style={{ color: colors.muted, marginTop: 6 }}>{post.content}</Text>
            ) : null}

            {/* 🔹 Poll */}
            {post.category === "استطلاع رأي" && (
                <PollInCard
                    post={post}
                    currentUserId={currentUserId}
                />
            )}

            {/* 🔹 Footer: Comments & Likes */}
            <View style={styles.footer}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ChatIcon color={colors.iconColor} />
                    <Text style={{ color: colors.muted }}>{post.comments.length}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => post.id && onToggleLike?.(post.id)}
                    style={[
                        styles.likeBtn,
                        {
                            backgroundColor: isLiked ? `${colors.accent}15` : "transparent",
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <LikeIcon color={isLiked ? colors.accent : colors.iconColor} />
                    <Text
                        style={{
                            marginLeft: 8,
                            color: isLiked ? colors.accent : colors.muted,
                        }}
                    >
                        {post.likes.length}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    title: { fontSize: 16, fontWeight: "800", marginTop: 6 },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        alignItems: "center",
    },
    likeBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
    },
});
