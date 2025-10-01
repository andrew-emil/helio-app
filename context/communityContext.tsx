import type { Comment, CommunityContextType, Post } from "@/types/communityContext.type";
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useToast } from "./toastContext";
import { useUser } from "./userContext";

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useUser()
    const { showToast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);

    const addPost = useCallback((postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        if (!user) return;
        const newPost: Post = {
            id: Date.now(),
            userId: user.uid,
            username: user.username,
            avatar: user.imageUrl,
            date: new Date().toISOString(),
            likes: [],
            comments: [],
            isPinned: false,
            ...postData,
            pollOptions: postData.pollOptions ? postData.pollOptions.map(opt => ({ option: opt.option, votes: [] })) : undefined
        };
        setPosts(prev => [newPost, ...prev]);
        showToast('تم نشر منشورك بنجاح!');
    }, [user, showToast]);

    const addComment = useCallback((postId: number, commentData: Omit<Comment, 'id' | 'date' | 'userId' | 'username' | 'avatar'>) => {
        if (!user) return;
        const newComment: Comment = {
            id: Date.now(),
            userId: user.uid,
            username: user.username,
            avatar: user.imageUrl,
            date: new Date().toISOString(),
            ...commentData
        };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    }, [user]);

    const toggleLikePost = useCallback((postId: number) => {
        if (!user) return;
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(user.uid);
                const newLikes = isLiked
                    ? p.likes.filter(id => id !== user.uid)
                    : [...p.likes, user.uid];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
    }, [user]);

    const voteOnPoll = useCallback((postId: number, optionIndex: number) => {
        if (!user) return;
        const userId = user.uid;

        setPosts(prev => prev.map(p => {
            if (p.id !== postId || !p.pollOptions) {
                return p;
            }

            const alreadyVotedForOption = p.pollOptions[optionIndex]?.votes.includes(userId);

            const newPollOptions = p.pollOptions.map((option, idx) => {
                const newVotes = option.votes.filter(vId => vId !== userId);
                if (idx === optionIndex && !alreadyVotedForOption) {
                    newVotes.push(userId);
                }
                return { ...option, votes: newVotes };
            });

            return { ...p, pollOptions: newPollOptions };
        }));
    }, [user]);

    const deletePost = useCallback((postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('تم حذف المنشور.');
    }, [showToast]);

    const deleteComment = useCallback((postId: number, commentId: number) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p)));
        showToast('تم حذف التعليق.');
    }, [showToast]);

    const togglePinPost = useCallback((postId: number) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p)));
    }, []);

    const editPost = useCallback((postId: number, data: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, ...data } : p)));
        showToast('تم تعديل المنشور بنجاح.');
    }, [showToast]);

    const value: CommunityContextType = {
        posts,
        addPost,
        addComment,
        toggleLikePost,
        voteOnPoll,
        deletePost,
        deleteComment,
        togglePinPost,
        editPost,
    };

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = (): CommunityContextType => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error('useCommunity must be used within a CommunityProvider');
    }
    return context;
};