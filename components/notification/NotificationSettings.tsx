import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useNotificationContext } from '@/context/notificationContext';
import { useTheme } from '@/context/themeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';

interface NotificationSettingsProps {
    onNavigateToNotifications?: () => void;
}

export default function NotificationSettings({ onNavigateToNotifications }: NotificationSettingsProps) {
    const { colors } = useTheme();
    const {
        isEnabled,
        isLoading,
        requestPermission,
        unreadCount,
        fcmToken
    } = useNotificationContext();

    const handleToggleNotifications = async () => {
        try {
            if (isEnabled) {
                // Show alert to explain how to disable notifications
                Alert.alert(
                    'إعدادات الإشعارات',
                    'لتعطيل الإشعارات، يرجى الذهاب إلى إعدادات الجهاز وتحديد التطبيق ثم تعطيل الإشعارات.',
                    [
                        { text: 'إلغاء', style: 'cancel' },
                        { text: 'موافق', style: 'default' }
                    ]
                );
            } else {
                // Request permission
                const granted = await requestPermission();
                if (!granted) {
                    Alert.alert(
                        'إذن الإشعارات',
                        'تم رفض إذن الإشعارات. يمكنك تفعيلها لاحقاً من إعدادات الجهاز.',
                        [{ text: 'موافق' }]
                    );
                }
            }
        } catch (error) {
            Alert.alert(
                'خطأ',
                'حدث خطأ أثناء تحديث إعدادات الإشعارات.',
                [{ text: 'موافق' }]
            );
        }
    };

    const handleViewNotifications = () => {
        if (onNavigateToNotifications) {
            onNavigateToNotifications();
        }
    };

    return (
        <View className="space-y-4">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <Text
                    style={{
                        fontFamily: FONTS_CONSTANTS.bold,
                        color: colors.text,
                        fontSize: 18
                    }}
                >
                    الإشعارات
                </Text>
                <Ionicons name="notifications" size={24} color={colors.primary} />
            </View>

            {/* Notification Toggle */}
            <View
                className="flex-row items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: colors.surface }}
            >
                <View className="flex-1">
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.semiBold,
                            color: colors.text,
                            fontSize: 16
                        }}
                    >
                        تفعيل الإشعارات
                    </Text>
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: colors.textSecondary,
                            fontSize: 14,
                            marginTop: 2
                        }}
                    >
                        {isEnabled ? 'الإشعارات مفعلة' : 'الإشعارات معطلة'}
                    </Text>
                </View>
                <Switch
                    value={isEnabled}
                    onValueChange={handleToggleNotifications}
                    disabled={isLoading}
                    trackColor={{ false: '#767577', true: colors.primary }}
                    thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                />
            </View>

            {/* View Notifications Button */}
            {isEnabled && (
                <TouchableOpacity
                    onPress={handleViewNotifications}
                    className="flex-row items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: colors.surface }}
                >
                    <View className="flex-row items-center flex-1">
                        <Ionicons
                            name="list"
                            size={20}
                            color={colors.primary}
                            style={{ marginRight: 12 }}
                        />
                        <View className="flex-1">
                            <Text
                                style={{
                                    fontFamily: FONTS_CONSTANTS.semiBold,
                                    color: colors.text,
                                    fontSize: 16
                                }}
                            >
                                عرض الإشعارات
                            </Text>
                            <Text
                                style={{
                                    fontFamily: FONTS_CONSTANTS.regular,
                                    color: colors.textSecondary,
                                    fontSize: 14,
                                    marginTop: 2
                                }}
                            >
                                {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        {unreadCount > 0 && (
                            <View
                                className="w-6 h-6 rounded-full items-center justify-center mr-2"
                                style={{ backgroundColor: colors.error || '#ef4444' }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                        fontFamily: FONTS_CONSTANTS.bold
                                    }}
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </View>
                </TouchableOpacity>
            )}

            {/* FCM Token Display (for debugging) */}
            {__DEV__ && fcmToken && (
                <View
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.surface }}
                >
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.semiBold,
                            color: colors.text,
                            fontSize: 14
                        }}
                    >
                        FCM Token (Development):
                    </Text>
                    <Text
                        style={{
                            fontFamily: FONTS_CONSTANTS.regular,
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginTop: 4
                        }}
                        numberOfLines={3}
                    >
                        {fcmToken}
                    </Text>
                </View>
            )}

            {/* Help Text */}
            <Text
                style={{
                    fontFamily: FONTS_CONSTANTS.regular,
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 18
                }}
                className="text-center"
            >
                الإشعارات تساعدك على البقاء على اطلاع بأحدث الأخبار والخدمات والتحديثات المهمة في المدينة.
            </Text>
        </View>
    );
}
