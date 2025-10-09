import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { voteInPoll } from "@/services/firebase/posts";
import { PostDocData } from "@/types/firebaseDocs.type";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Props = {
    post: PostDocData;
    currentUserId?: string | null;
};

export default function PollInCard({ post, currentUserId }: Props) {
    const { colors } = useTheme();
    const { user } = useUser()

    const { totalVotes, userVoteIndex } = useMemo(() => {
        if (!post.pollOptions) return { totalVotes: 0, userVoteIndex: -1 };
        const allVoters = new Set<string>();
        let voteIndex = -1;
        post.pollOptions.forEach((opt, idx) => {
            opt.vote.forEach((voter) => {
                allVoters.add(voter);
                if (currentUserId && voter === currentUserId) voteIndex = idx;
            });
        });
        return { totalVotes: allVoters.size, userVoteIndex: voteIndex };
    }, [post.pollOptions, currentUserId]);

    const hasVoted = userVoteIndex > -1;
    if (!post.pollOptions) return null;

    return (
        <View style={{ marginTop: 12 }}>
            {post.pollOptions.map((opt, idx) => {
                const percent = totalVotes > 0 ? (opt.vote.length / totalVotes) * 100 : 0;
                const isUserChoice = idx === userVoteIndex;
                if (hasVoted) {
                    return (
                        <View
                            key={idx}
                            style={[
                                styles.resultRow,
                                {
                                    borderColor: isUserChoice ? colors.primary : colors.border,
                                    backgroundColor: isUserChoice ? `${colors.primary}10` : colors.surface,
                                },
                            ]}
                        >
                            <View style={styles.resultHeader}>
                                <Text style={[styles.optionText, { color: isUserChoice ? colors.primary : colors.text }]}>
                                    {opt.option}
                                </Text>
                                <Text style={{ color: colors.muted }}>{Math.round(percent)}%</Text>
                            </View>
                            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                <View style={{ width: `${percent}%`, backgroundColor: colors.primary, height: "100%" }} />
                            </View>
                        </View>
                    );
                } else {
                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={async () => voteInPoll(post.id ?? "", idx, user?.uid ?? '')}
                            style={[styles.voteBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        >
                            <Text style={{ color: colors.text, fontWeight: "600" }}>{opt.option}</Text>
                        </TouchableOpacity>
                    );
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    resultRow: {
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    resultHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    optionText: { fontWeight: "700" },
    progressBar: {
        height: 10,
        borderRadius: 6,
        overflow: "hidden",
    },
    voteBtn: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
    },
});
