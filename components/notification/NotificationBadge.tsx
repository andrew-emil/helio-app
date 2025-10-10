import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useNotification } from '@/context/notificationsContext';
import { useTheme } from '@/context/themeContext';
import { getAllNotifications } from '@/services/firebase/notification';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotificationBadgeProps {
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
    showDot?: boolean;
}

export default function NotificationBadge({
    onPress,
    size = 'medium',
    showCount = true,
    showDot = true
}: NotificationBadgeProps) {
    const { colors } = useTheme();
    const { notification: latestNotification } = useNotification();

    // Get unread notifications count from Firebase
    const { data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotifications,
        refetchOnWindowFocus: true,
    });

    const unreadCount = notifications?.filter(n => !n.read).length || 0;
    const isEnabled = true; // Always show badge if there are notifications

    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return {
                    iconSize: 20,
                    badgeSize: 16,
                    fontSize: 10,
                };
            case 'large':
                return {
                    iconSize: 28,
                    badgeSize: 20,
                    fontSize: 12,
                };
            default: // medium
                return {
                    iconSize: 24,
                    badgeSize: 18,
                    fontSize: 11,
                };
        }
    };

    const { iconSize, badgeSize, fontSize } = getSizeConfig();
    const hasUnread = unreadCount > 0;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="relative"
            disabled={!onPress}
        >
            <Ionicons
                name={isEnabled ? "notifications" : "notifications-outline"}
                size={iconSize}
                color={isEnabled ? colors.primary : colors.muted}
            />

            {/* Badge */}
            {isEnabled && hasUnread && (showCount || showDot) && (
                <View
                    className="absolute -top-1 -right-1 rounded-full items-center justify-center min-w-4 min-h-4"
                    style={{
                        width: badgeSize,
                        height: badgeSize,
                        backgroundColor: colors.error || '#ef4444',
                    }}
                >
                    {showCount && unreadCount > 0 && (
                        <Text
                            style={{
                                color: 'white',
                                fontSize: fontSize,
                                fontFamily: FONTS_CONSTANTS.bold,
                                textAlign: 'center',
                                lineHeight: fontSize,
                            }}
                        >
                            {unreadCount > 9 ? '9+' : unreadCount.toString()}
                        </Text>
                    )}

                    {!showCount && showDot && (
                        <View
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'white',
                            }}
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

// Compact version for navigation headers
export function NotificationBadgeCompact({ onPress }: { onPress?: () => void }) {
    return (
        <NotificationBadge
            onPress={onPress}
            size="small"
            showCount={true}
            showDot={false}
        />
    );
}

// Dot-only version for minimal UI
export function NotificationDot({ onPress }: { onPress?: () => void }) {
    return (
        <NotificationBadge
            onPress={onPress}
            size="small"
            showCount={false}
            showDot={true}
        />
    );
}
