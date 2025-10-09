import { FIREBASE_DOCS } from "@/constants/firebaseConstants";
import { PostDocData } from "@/types/firebaseDocs.type";
import { dbRefs } from "@/utils/firebaseUtils";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc
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