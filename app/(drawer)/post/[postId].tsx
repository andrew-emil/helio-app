import { ChatIcon } from "@/components/community/icons";
import PollInCard from "@/components/community/pollInCard";
import CustomInputForm from "@/components/customInputForm";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useBg } from "@/hooks/useBg";
import { addCommentToPost, getPostById, toggleLikePost } from "@/services/firebase/posts";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PostDetails() {
    const { colors } = useTheme();
    const { user, isLoggedIn } = useUser();
    const { postId } = useLocalSearchParams();
    const [newComment, setNewComment] = useState("");
    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);
    const router = useRouter();
    const { bg } = useBg();
    const queryClient = new QueryClient();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ["post-details"],
        queryFn: async () => await getPostById(postId as string),
    });

    if (isLoading) return <Spinner />;
    if (error) return <ErrorFallback />;
    if (!post && !isLoading) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
                <Text>جار التحميل...</Text>
            </View>
        );
    }

    const isLiked = user && post?.likes.includes(user?.uid);

    const handleLike = async () => {
        if (!isLoggedIn || !user?.uid || !post?.id) {
            router.push("/(auth)/login");
            return;
        }

        try {
            setLoadingLike(true);
            await toggleLikePost(post.id, user.uid);
            await queryClient.invalidateQueries({ queryKey: ["post-details"] });
            Toast.show({
                type: "success",
                text1: isLiked ? "تم إزالة الإعجاب" : "تم تسجيل إعجابك",
            });
        } catch (error) {
            console.error("Error toggling like:", error);
            Toast.show({
                type: "error",
                text1: "خطأ في الإعجاب",
                text2: "حدث خطأ أثناء الإعجاب. حاول مرة أخرى.",
            });
        } finally {
            setLoadingLike(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!isLoggedIn || !user?.uid || !post?.id) {
            router.push("/(auth)/login");
            return;
        }

        if (newComment.trim()) {
            try {
                setLoadingComment(true);
                await addCommentToPost(
                    post.id,
                    { content: newComment },
                    user.uid,
                    user.username || user.email || "مستخدم",
                    user.imageUrl || ""
                );
                setNewComment("");
                await queryClient.invalidateQueries({ queryKey: ["post-details"] });
                Toast.show({
                    type: "success",
                    text1: "تم إضافة التعليق بنجاح",
                });
            } catch (error) {
                console.error("Error adding comment:", error);
                Toast.show({
                    type: "error",
                    text1: "خطأ في التعليق",
                    text2: "حدث خطأ أثناء إضافة التعليق. حاول مرة أخرى.",
                });
            } finally {
                setLoadingComment(false);
            }
        }
    };

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full" style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title={post?.title ?? ""}
                    subtitle={`${post?.username}.${post?.createdAt}`}
                    icon={<ChatIcon color={colors.primary} size={48} />}
                />

                {/* Post Card */}
                <View className="p-5 rounded-2xl shadow-md" style={{ backgroundColor: colors.surface }}>
                    {/* Header */}
                    <View
                        className="flex-row items-center gap-3 border-b pb-4 mb-4"
                        style={{ borderColor: colors.border }}
                    >
                        <Image source={{ uri: post?.avatar }} className="w-14 h-14 rounded-full" />
                        <View>
                            <Text
                                className="text-lg"
                                style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                            >
                                {post?.username}
                            </Text>
                            <Text
                                className="text-xs"
                                style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}
                            >
                                {post?.createdAt.toLocaleString("ar-EG", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <Text
                        className={`${bg("text-gray-700", "text-gray-300")} leading-relaxed`}
                        style={{ fontFamily: FONTS_CONSTANTS.regular }}
                    >
                        {post?.content}
                    </Text>

                    {/* Poll */}
                    {post?.category === "استطلاع رأي" && <PollInCard post={post} />}

                    {/* Like & Comment Stats */}
                    <View
                        className="flex-row justify-between items-center mt-6 border-t pt-4"
                        style={{ borderColor: colors.border }}
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#64748b" />
                                <Text className="text-gray-500">{post?.comments.length} تعليقات</Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleLike}
                                disabled={loadingLike}
                                className="flex-row items-center gap-1"
                            >
                                {loadingLike ? (
                                    <ActivityIndicator size="small" color="#ef4444" />
                                ) : (
                                    <Ionicons
                                        name={isLiked ? "heart" : "heart-outline"}
                                        size={18}
                                        color={isLiked ? "#ef4444" : "#64748b"}
                                    />
                                )}
                                <Text
                                    className={`${isLiked ? "text-red-500" : `${bg("text-gray-600", "text-gray-300")}`
                                        }`}
                                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                >
                                    {post?.likes.length} إعجاب
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="flex-row items-center gap-1">
                            <Ionicons name="share-outline" size={18} color="#06b6d4" />
                            <Text
                                className="text-cyan-500"
                                style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                            >
                                مشاركة
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Comments */}
                <View className="mt-8">
                    <Text
                        className="text-xl mb-4"
                        style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                    >
                        التعليقات
                    </Text>

                    {isLoggedIn ? (
                        <View className="flex-row gap-3 mb-6">
                            <Image source={{ uri: user?.imageUrl }} className="w-10 h-10 rounded-full" />
                            <View className="flex-1">
                                <CustomInputForm
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    placeholder="أضف تعليقك..."
                                    multiline
                                />
                                <TouchableOpacity
                                    onPress={handleCommentSubmit}
                                    disabled={loadingComment}
                                    className={`py-2 rounded-lg mt-2 ${loadingComment ? "bg-cyan-400" : "bg-cyan-500"
                                        }`}
                                >
                                    {loadingComment ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text
                                            className="text-center text-white"
                                            style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                        >
                                            إرسال
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View className="p-4 rounded-lg mb-6" style={{ borderColor: colors.border }}>
                            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                                <Text
                                    className="text-cyan-600"
                                    style={{ fontFamily: FONTS_CONSTANTS.semiBold }}
                                >
                                    سجل الدخول
                                </Text>
                            </TouchableOpacity>
                            <Text> للمشاركة في النقاش.</Text>
                        </View>
                    )}

                    {/* Comments List */}
                    {post && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <View key={comment.id} className="flex-row gap-3 mb-4">
                                <Image source={{ uri: comment.avatar }} className="w-10 h-10 rounded-full" />
                                <View
                                    className="flex-1 p-4 rounded-lg"
                                    style={{ backgroundColor: colors.surface }}
                                >
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text
                                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}
                                        >
                                            {comment.username}
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            {comment.createdAt.toLocaleDateString("ar-EG")}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{ fontFamily: FONTS_CONSTANTS.medium, color: colors.muted }}
                                    >
                                        {comment.content}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text
                            className="text-center py-8"
                            style={{ fontFamily: FONTS_CONSTANTS.medium, color: colors.muted }}
                        >
                            لا توجد تعليقات بعد. كن أول من يعلق!
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Toast container */}
            <Toast />
        </SafeAreaView>
    );
}
