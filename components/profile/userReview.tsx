import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { UserReviewsProps } from '@/types/review.type';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const UserReviews: React.FC<UserReviewsProps> = ({ userReviews }) => {
    const { colors } = useTheme()
    // Render star rating component
    const renderStars = (rating: number) => {
        return (
            <View style={styles.starsContainer}>
                {[...Array(5)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name={index < rating ? 'star' : 'star-outline'}
                        size={16}
                        color={index < rating ? '#FFD700' : '#D1D5DB'}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="chatbubble-outline" size={28} color={colors.text} />
                <Text style={[styles.title, { color: colors.text, fontFamily: FONTS_CONSTANTS.bold }]}>تقييماتي ({userReviews.length})</Text>
            </View>

            {/* Reviews List */}
            <ScrollView
                style={styles.reviewsContainer}
                showsVerticalScrollIndicator={false}
            >
                {userReviews.length > 0 ? (
                    userReviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            {/* Review Header */}
                            <View style={styles.reviewHeader}>
                                <Text style={styles.serviceText}>
                                    تقييم لـ <Text style={styles.serviceName}>{review.serviceName}</Text>
                                </Text>
                                <Text style={styles.dateText}>{review.date}</Text>
                            </View>

                            {/* Star Rating */}
                            {renderStars(review.rating)}

                            {/* Comment */}
                            <Text style={styles.commentText}>{review.comment}</Text>

                            {/* Admin Reply */}
                            {review.adminReply && (
                                <View style={styles.adminReplyContainer}>
                                    <View style={styles.adminReplyBorder} />
                                    <Text style={styles.adminReplyText}>
                                        رد الإدارة: {review.adminReply}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            لم تقم بإضافة أي تقييمات بعد.
                        </Text>
                    </View>
                )
                }
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    title: {
        fontSize: 24,
        textAlign: 'right',
    },
    reviewsContainer: {
        maxHeight: 384,
    },
    reviewCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'right',
    },
    serviceName: {
        fontWeight: 'bold',
        color: '#0891B2',
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'right',
        lineHeight: 20,
        marginTop: 8,
    },
    adminReplyContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    adminReplyBorder: {
        width: 3,
        backgroundColor: '#0891B2',
        marginLeft: 8,
        borderRadius: 2,
    },
    adminReplyText: {
        fontSize: 12,
        color: '#0E7490',
        textAlign: 'right',
        flex: 1,
        lineHeight: 18,
    },
    emptyState: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default UserReviews;