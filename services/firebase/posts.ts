import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { PostDocData } from "@/types/firebaseDocs.type";
import { dbRefs } from "@/utils/firebaseUtils";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

const postsColRef = collection(db, FIREBASE_DOCS.POSTS);

/**
 * Add a new post to Firestore.
 * - Fills reasonable defaults (likes, comments, pollOptions, isPinned).
 * - Uses serverTimestamp() when createdAt isn't provided.
 * @returns created document id
 */
export async function addPost(post: PostDocData): Promise<string> {
    try {
        const payload = {
            ...post,
            // if the caller didn't supply createdAt, let Firestore set it
            createdAt: post.createdAt ?? serverTimestamp(),
            likes: post.likes ?? [],
            comments: post.comments ?? [],
            pollOptions: post.pollOptions ?? [],
            isPinned: !!post.isPinned,
        };

        const docRef = await addDoc(postsColRef, payload as any);
        return docRef.id;
    } catch (err) {
        console.error("addPost error:", err);
        throw err;
    }
}

/** Helper: converts Firestore Timestamp (or nested timestamps) to JS Date */
function toDateIfTimestamp(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value?.toDate === "function") return value.toDate();
    // If it's already a Date
    if (value instanceof Date) return value;
    // Fallback: try to construct Date (if it's a string/number)
    try {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
}

/**
 * Get all posts, ordered by createdAt descending.
 * Returns PostDocData[] with converted createdAt and comment createdAt fields.
 */
export async function getAllPosts(): Promise<PostDocData[]> {
    try {
        const q = query(postsColRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const formattedData: PostDocData[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();

            const createdAt = toDateIfTimestamp(data.createdAt);

            return {
                id: docSnap.id,
                userId: data.userId,
                username: data.username,
                avatar: data.avatar,
                title: data.title,
                content: data.content,
                category: data.category,
                likes: data.likes.length,
                comments: data.comments.length,
                isPinned: !!data.isPinned,
                pollOptions: data.pollOptions ?? [],
                targetAudience: data.targetAudience,
                createdAt: createdAt ?? new Date(0),
            } as PostDocData;
        });

        return formattedData;
    } catch (err) {
        console.error("getAllPosts error:", err);
        throw err;
    }
}

/**
 * Get a single post by id. Returns null if not found.
 * Converts timestamps to Date.
 */
export async function getPostById(postId: string): Promise<PostDocData | null> {
    try {
        const ref = dbRefs.posts(postId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return null;

        const data: any = snap.data();

        const createdAt = toDateIfTimestamp(data.createdAt);

        const comments = (data.comments ?? []).map((c: any) => ({
            id: c.id,
            userId: c.userId,
            username: c.username,
            avatar: c.avatar,
            content: c.content,
            createdAt: toDateIfTimestamp(c.createdAt),
        }));

        const post: PostDocData = {
            id: snap.id,
            userId: data.userId,
            username: data.username,
            avatar: data.avatar,
            title: data.title,
            content: data.content,
            category: data.category,
            likes: data.likes ?? [],
            comments,
            isPinned: !!data.isPinned,
            pollOptions: data.pollOptions ?? [],
            targetAudience: data.targetAudience,
            createdAt: createdAt ?? new Date(0),
        };

        return post;
    } catch (err) {
        console.error("getPostById error:", err);
        throw err;
    }
}

/**
 * Update an existing post.
 * - Accepts a partial PostDocData payload (don't include `id`).
 * - Use this for patch-style updates (only fields in `updates` are changed).
 */
export async function updatePost(
    postId: string,
    updates: Partial<PostDocData>
): Promise<void> {
    try {
        const ref = dbRefs.posts(postId);

        // Avoid attempting to write the id field
        const payload = { ...updates } as any;
        delete payload.id;

        // If payload contains createdAt as Date, it's fine. If user wants server time they should pass serverTimestamp() explicitly.
        await updateDoc(ref, payload);
    } catch (err) {
        console.error("updatePost error:", err);
        throw err;
    }
}

export async function voteInPoll(postId: string, optionIndex: number, userId: string) {
    const postRef = doc(db, "Posts", postId);
    const snapshot = await getDoc(postRef);

    if (!snapshot.exists()) throw new Error("Post not found");
    const post = snapshot.data() as PostDocData;

    // Ensure the pollOptions array exists
    if (!post.pollOptions || !post.pollOptions[optionIndex]) {
        throw new Error("Invalid poll option");
    }

    // Remove user from all other options
    const updatedPollOptions = post.pollOptions.map((opt, idx) => {
        let votes = [...(opt.vote || [])];
        if (idx === optionIndex) {
            // Toggle vote in the selected option
            if (votes.includes(userId)) {
                votes = votes.filter((v) => v !== userId); // remove vote (unvote)
            } else {
                votes.push(userId); // add vote
            }
        } else {
            // Remove user's vote from other options
            votes = votes.filter((v) => v !== userId);
        }
        return { ...opt, vote: votes };
    });

    await updateDoc(postRef, { pollOptions: updatedPollOptions });
}

/**
 * Toggle like status for a post
 * @param postId - The ID of the post
 * @param userId - The ID of the user liking/unliking
 */
export async function toggleLikePost(postId: string, userId: string): Promise<void> {
    try {
        const postRef = doc(db, FIREBASE_DOCS.POSTS, postId);
        const snapshot = await getDoc(postRef);

        if (!snapshot.exists()) {
            throw new Error("Post not found");
        }

        const post = snapshot.data();
        const likes = post.likes || [];

        if (likes.includes(userId)) {
            // Remove like
            await updateDoc(postRef, {
                likes: arrayRemove(userId)
            });
        } else {
            // Add like
            await updateDoc(postRef, {
                likes: arrayUnion(userId)
            });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
}

/**
 * Add a comment to a post
 * @param postId - The ID of the post
 * @param comment - Comment data
 * @param userId - The ID of the user commenting
 * @param username - The username of the user commenting
 * @param avatar - The avatar URL of the user commenting
 */
export async function addCommentToPost(
    postId: string,
    comment: { content: string },
    userId: string,
    username: string,
    avatar: string
): Promise<void> {
    try {
        const postRef = doc(db, FIREBASE_DOCS.POSTS, postId);
        const snapshot = await getDoc(postRef);

        if (!snapshot.exists()) {
            throw new Error("Post not found");
        }

        const newComment = {
            id: `${Date.now()}_${userId}`, // Simple ID generation
            userId,
            username,
            avatar,
            content: comment.content,
            createdAt: serverTimestamp()
        };

        await updateDoc(postRef, {
            comments: arrayUnion(newComment)
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

/**
 * Delete a comment from a post (admin or comment author only)
 * @param postId - The ID of the post
 * @param commentId - The ID of the comment to delete
 */
export async function deleteComment(postId: string, commentId: string): Promise<void> {
    try {
        const postRef = doc(db, FIREBASE_DOCS.POSTS, postId);
        const snapshot = await getDoc(postRef);

        if (!snapshot.exists()) {
            throw new Error("Post not found");
        }

        const post = snapshot.data();
        const comments = post.comments || [];
        const commentToDelete = comments.find((c: any) => c.id === commentId);

        if (!commentToDelete) {
            throw new Error("Comment not found");
        }

        await updateDoc(postRef, {
            comments: arrayRemove(commentToDelete)
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

/**
 * Pin or unpin a post (admin only)
 * @param postId - The ID of the post
 * @param isPinned - Whether to pin or unpin the post
 */
export async function togglePinPost(postId: string, isPinned: boolean): Promise<void> {
    try {
        const postRef = doc(db, FIREBASE_DOCS.POSTS, postId);
        await updateDoc(postRef, { isPinned });
    } catch (error) {
        console.error("Error toggling pin status:", error);
        throw error;
    }
}

/**
 * Delete a post (admin or post author only)
 * @param postId - The ID of the post to delete
 */
export async function deletePost(postId: string): Promise<void> {
    try {
        const postRef = doc(db, FIREBASE_DOCS.POSTS, postId);
        await updateDoc(postRef, {
            deleted: true,
            deletedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

/**
 * Get posts by category with pagination
 * @param category - The category to filter by
 * @param limit - Number of posts to fetch
 * @param lastDoc - Last document for pagination
 */
export async function getPostsByCategory(
    category: string,
    limitCount: number = 10,
    lastDoc?: any
): Promise<PostDocData[]> {
    try {
        let q = query(
            postsColRef,
            orderBy("createdAt", "desc")
        );

        if (category !== "all") {
            q = query(q, where("category", "==", category));
        }

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        q = query(q, limit(limitCount));

        const snapshot = await getDocs(q);

        return snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: toDateIfTimestamp(data.createdAt) ?? new Date(0),
                likes: data.likes || [],
                comments: data.comments || [],
                pollOptions: data.pollOptions || [],
            } as PostDocData;
        });
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        throw error;
    }
}