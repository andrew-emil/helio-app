export interface Post {
    id: number;
    userId: string;
    username: string;
    avatar: string;
    title?: string;
    content: string;
    category: PostCategory;
    date: string;
    likes: string[]; // Array of user IDs who liked the post
    comments: Comment[];
    isPinned?: boolean;
    pollOptions?: PollOption[];
    targetAudience?: string; // For 'نقاش خاص'
}

export interface Comment {
    id: number;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    date: string;
}

export interface PollOption {
    option: string;
    votes: string[]; // Array of user IDs who voted
}

export type PostCategory =
    | "نقاش عام"
    | "نقاش خاص"
    | "سؤال"
    | "حدث"
    | "استطلاع رأي";

export interface CommunityContextType {
    posts: Post[];
    addPost: (
        postData: Omit<
            Post,
            | "id"
            | "date"
            | "userId"
            | "username"
            | "avatar"
            | "likes"
            | "comments"
            | "isPinned"
        >
    ) => void;
    addComment: (
        postId: number,
        commentData: Omit<Comment, "id" | "date" | "userId" | "username" | "avatar">
    ) => void;
    toggleLikePost: (postId: number) => void;
    voteOnPoll: (postId: number, optionIndex: number) => void;
    deletePost: (postId: number) => void;
    deleteComment: (postId: number, commentId: number) => void;
    togglePinPost: (postId: number) => void;
    editPost: (
        postId: number,
        data: Omit<
            Post,
            | "id"
            | "date"
            | "userId"
            | "username"
            | "avatar"
            | "likes"
            | "comments"
            | "isPinned"
        >
    ) => void;
}
