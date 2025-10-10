import EmptyState from "@/components/emptyState";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useNotification } from "@/context/notificationsContext";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import { getAllNotifications } from "@/services/firebase/notification";
import { NotificatioDocData } from "@/types/firebaseDocs.type";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationWrapper() {
    const { colors } = useTheme()
    const { bg } = useBg()
    const { notification: latestNotification } = useNotification()

    const { data: notifications, isLoading, error, refetch, isRefetching } = useQuery<NotificatioDocData[]>({
        queryKey: ["notifications"],
        queryFn: getAllNotifications,
        refetchOnWindowFocus: true,
    });

    // Log the latest push notification when it arrives
    useEffect(() => {
        if (latestNotification) {
            console.log("🔔 Latest push notification in notification page:", latestNotification);
            // Optionally refetch notifications when a new push notification arrives
            refetch();
        }
    }, [latestNotification, refetch]);

    if (isLoading || !notifications) return <Spinner />;
    if (error) return <ErrorFallback />;

    const sortedNotifications = notifications
        .map((n) => ({
            ...n,
            createdAt: n.createdAt instanceof Timestamp
                ? n.createdAt.toDate()
                : new Date(n.createdAt),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                <PageBanner
                    title="الإشعارات"
                    subtitle="أحدث التنبيهات والأخبار الهامة المرسلة إليك."
                    icon={<Ionicons name="notifications" size={48} color="#06b6d4" />}
                />

                <View className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {sortedNotifications.length > 0 ? (
                        <View className="space-y-4"
                        >
                            {sortedNotifications.map((n, index) => {
                                const isUnread = !n.read;
                                return (
                                    <TouchableOpacity
                                        key={n.id || index}
                                        className="p-4 rounded-lg shadow-sm flex flex-row items-start gap-4 mb-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderLeftWidth: isUnread ? 4 : 0,
                                            borderLeftColor: isUnread ? colors.primary : 'transparent'
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        {/* Status dot */}
                                        <View className="flex-shrink-0 mt-1">
                                            <View
                                                className={`w-3 h-3 rounded-full ${isUnread ? 'bg-cyan-500' : 'bg-gray-400'}`}
                                            />
                                        </View>

                                        {/* Content */}
                                        <View className="flex-1">
                                            <Text
                                                style={{
                                                    fontFamily: FONTS_CONSTANTS.bold,
                                                    color: colors.text,
                                                    fontWeight: isUnread ? 'bold' : 'normal'
                                                }}>
                                                {n.title}
                                            </Text>
                                            <Text className={`mt-1 ${bg("text-gray-600", "text-gray-300")}`}
                                                style={{ fontFamily: FONTS_CONSTANTS.regular }}>
                                                {n.body}
                                            </Text>
                                            <Text className="text-xs text-gray-400 mt-2"
                                                style={{ fontFamily: FONTS_CONSTANTS.regular }}>
                                                {new Date(n.createdAt).toLocaleDateString("ar-EG-u-nu-latn")}
                                            </Text>
                                        </View>

                                        {/* Action button for unread notifications */}
                                        {isUnread && (
                                            <TouchableOpacity
                                                className="px-3 py-1 rounded-full"
                                                style={{ backgroundColor: colors.primary }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={{
                                                    color: 'white',
                                                    fontFamily: FONTS_CONSTANTS.medium,
                                                    fontSize: 12
                                                }}>
                                                    جديد
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <EmptyState
                            icon={<Ionicons name="notifications-outline" size={64} color="#94a3b8" />}
                            title="لا توجد إشعارات حالياً"
                            message="سيتم عرض الإشعارات الهامة والتنبيهات هنا عند توفرها."
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}