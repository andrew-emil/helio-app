import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { voteInPoll } from "@/services/firebase/posts";
import { PostDocData } from "@/types/firebaseDocs.type";
import { memo, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    post: PostDocData;
    currentUserId?: string | null;
};

function PollInCard({ post, currentUserId }: Props) {
    const { colors } = useTheme();
    const { user } = useUser();
    const [isVoting, setIsVoting] = useState(false);
    const [votingOptionIndex, setVotingOptionIndex] = useState<number | null>(null);

    // Optimized calculation with early returns and better performance
    const { userVoteIndex, pollOptionsWithStats } = useMemo(() => {
        if (!post.pollOptions || !Array.isArray(post.pollOptions)) {
            return { userVoteIndex: -1, pollOptionsWithStats: [] };
        }

        const allVoters = new Set<string>();
        let userVoteIdx = -1;

        // Single pass through poll options to collect all data
        const optionsWithStats = post.pollOptions.map((option, index) => {
            const votes = option.vote || [];
            votes.forEach((voter) => {
                allVoters.add(voter);
                if (currentUserId && voter === currentUserId) {
                    userVoteIdx = index;
                }
            });

            return {
                ...option,
                voteCount: votes.length,
                percentage: 0 // Will be calculated after totalVotes is known
            };
        });

        const total = allVoters.size;

        // Calculate percentages
        optionsWithStats.forEach((option) => {
            option.percentage = total > 0 ? (option.voteCount / total) * 100 : 0;
        });

        return {
            userVoteIndex: userVoteIdx,
            pollOptionsWithStats: optionsWithStats
        };
    }, [post.pollOptions, currentUserId]);

    const hasVoted = userVoteIndex > -1;

    // Memoized voting handler with error handling
    const handleVote = useCallback(async (optionIndex: number) => {
        if (!user?.uid || !post.id || isVoting) return;

        try {
            setIsVoting(true);
            setVotingOptionIndex(optionIndex);

            await voteInPoll(post.id, optionIndex, user.uid);
        } catch (error) {
            console.error('Error voting in poll:', error);
            Alert.alert(
                'خطأ في التصويت',
                'حدث خطأ أثناء التصويت. يرجى المحاولة مرة أخرى.',
                [{ text: 'حسناً', style: 'default' }]
            );
        } finally {
            setIsVoting(false);
            setVotingOptionIndex(null);
        }
    }, [user?.uid, post.id, isVoting]);

    // Early return for invalid poll data
    if (!post.pollOptions || !Array.isArray(post.pollOptions) || post.pollOptions.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {pollOptionsWithStats.map((option, idx) => {
                const isUserChoice = idx === userVoteIndex;
                const isCurrentlyVoting = votingOptionIndex === idx;

                if (hasVoted) {
                    return (
                        <View
                            key={`result-${idx}`}
                            style={[
                                styles.resultRow,
                                {
                                    borderColor: isUserChoice ? colors.primary : colors.border,
                                    backgroundColor: isUserChoice ? `${colors.primary}10` : colors.surface,
                                },
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`خيار ${option.option}، ${Math.round(option.percentage)}% من الأصوات${isUserChoice ? '، اختيارك' : ''}`}
                        >
                            <View style={styles.resultHeader}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        { color: isUserChoice ? colors.primary : colors.text }
                                    ]}
                                    numberOfLines={2}
                                >
                                    {option.option}
                                </Text>
                                <Text style={[styles.percentageText, { color: colors.muted }]}>
                                    {Math.round(option.percentage)}%
                                </Text>
                            </View>
                            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${option.percentage}%`,
                                            backgroundColor: colors.primary
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    );
                } else {
                    return (
                        <TouchableOpacity
                            key={`vote-${idx}`}
                            onPress={() => handleVote(idx)}
                            disabled={isVoting}
                            style={[
                                styles.voteBtn,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    opacity: isVoting ? 0.7 : 1
                                }
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`تصويت لـ ${option.option}`}
                            accessibilityHint="اضغط للتصويت على هذا الخيار"
                        >
                            <Text
                                style={[styles.voteText, { color: colors.text }]}
                                numberOfLines={2}
                            >
                                {option.option}
                            </Text>
                            {isCurrentlyVoting && (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.primary}
                                    style={styles.votingIndicator}
                                />
                            )}
                        </TouchableOpacity>
                    );
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    resultRow: {
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        minHeight: 60,
    },
    resultHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        flex: 1,
    },
    optionText: {
        fontWeight: "700",
        flex: 1,
        marginRight: 8,
        fontSize: 14,
    },
    percentageText: {
        fontSize: 14,
        fontWeight: "600",
        minWidth: 40,
        textAlign: "right",
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    voteBtn: {
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        minHeight: 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    voteText: {
        fontWeight: "600",
        fontSize: 14,
        flex: 1,
        textAlign: "center",
    },
    votingIndicator: {
        position: "absolute",
        right: 12,
    },
});

// Memoized component with custom comparison for optimal performance
export default memo(PollInCard, (prevProps: Props, nextProps: Props) => {
    // Only re-render if essential props change
    return (
        prevProps.post.id === nextProps.post.id &&
        prevProps.post.pollOptions === nextProps.post.pollOptions &&
        prevProps.currentUserId === nextProps.currentUserId
    );
});
