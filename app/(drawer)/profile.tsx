import UserReviews from "@/components/profile/userReview";
import UserAvatar from "@/components/userAvatar";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Profile screen with edit + delete modals.
 * Added avatar change support in the Edit modal.
 *
 * IMPORTANT: Fill in the // TODO: spots (upload image, update user in backend/context).
 */

export default function Profile() {
    const { themeMode, colors } = useTheme();
    const { user } = useUser(); // refreshUser optional


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Edit form state
    const [name, setName] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Avatar change state
    const [pickedAvatarUri, setPickedAvatarUri] = useState<string | null>(null); // local preview
    const [isPicking, setIsPicking] = useState(false);
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

    useEffect(() => {
        // Keep form in sync with user changes
        setName(user?.username ?? "");
        setEmail(user?.email ?? "");
        // if user has an image update preview if none picked locally
        if (!pickedAvatarUri && user?.imageUrl) {
            // keep showing server avatar via UserAvatar component; no need to set local state
        }
    }, [pickedAvatarUri, user]);

    useEffect(() => {
        // Reset picked avatar when closing the modal
        if (!isEditModalOpen) {
            setPickedAvatarUri(null);
        }
    }, [isEditModalOpen]);

    // Request permission when modal opens (so we don't ask on app load)
    useEffect(() => {
        if (isEditModalOpen) {
            (async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                setHasGalleryPermission(status === "granted");
            })();
        }
    }, [isEditModalOpen]);

    // Placeholder API functions - replace with your real calls
    const updateUserProfile = async (payload: { username?: string; email?: string; imageUrl?: string | null }) => {
        // TODO: Replace with your actual API / user-context update function.
        // Example:
        // await api.users.update(user.id, payload)
        // or call context method: await userContext.updateUser(payload)
        await new Promise((r) => setTimeout(r, 900));
    };

    const deleteUserAccount = async () => {
        // TODO: implement account deletion: call backend and sign user out
        await new Promise((r) => setTimeout(r, 900));
    };

    // Upload helper - you must implement real upload logic here
    const uploadImageToServer = async (localUri: string): Promise<string> => {
        // TODO: Implement file upload to your storage (S3, Firebase Storage, Cloudinary, etc.)
        // You should:
        // 1. Convert the localUri to a blob/file.
        // 2. Upload the blob to your storage bucket.
        // 3. Return the publicly accessible URL (or CDN URL) of the uploaded image.
        //
        // Example pseudocode:
        // const blob = await fetch(localUri).then(r => r.blob());
        // const uploadResult = await fetch(UPLOAD_URL, { method: 'PUT', body: blob, ...});
        // return uploadResult.publicUrl;
        //
        // For now this is a stub that fakes an uploaded URL:
        await new Promise((r) => setTimeout(r, 900));
        // NOTE: replace with real URL returned by your storage service
        return "https://example.com/path/to/uploaded/avatar.jpg";
    };

    const pickImage = async () => {
        if (hasGalleryPermission === false) {
            Alert.alert("صلاحيات مفقودة", "يرجى السماح بالوصول إلى الصور من إعدادات التطبيق.");
            return;
        }

        try {
            setIsPicking(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            // modern expo returns result.assets[]
            // older expo returned cancelled + uri, handle both
            if ("canceled" in result && result.canceled) {
                // user cancelled
                return;
            }

            const uri =
                // @ts-ignore - handle both possible shapes
                Array.isArray((result as any).assets) && (result as any).assets.length
                    ? (result as any).assets[0].uri
                    : // fallback for older API
                    (result as any).uri;

            if (uri) {
                setPickedAvatarUri(uri);
            }
        } catch (err) {
            console.error("pickImage error", err);
            Alert.alert("خطأ", "فشل اختيار الصورة");
        } finally {
            setIsPicking(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("خطأ", "يرجى ملء الحقول");
            return;
        }

        setSaving(true);
        try {
            let uploadedUrl: string | null = null;

            if (pickedAvatarUri) {
                // If user picked a new avatar, upload it and get URL
                // TODO: optionally delete previous avatar from storage if needed
                uploadedUrl = await uploadImageToServer(pickedAvatarUri);
            }

            // Update user with updated fields
            await updateUserProfile({
                username: name.trim(),
                email: email.trim(),
                // if uploadedUrl is null, we don't change avatar; if you want to remove avatar set null explicitly
                ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
            });

            // TODO: Update local user context if you have a setter (e.g. userContext.setUser(...))
            // Example: userContext.setUser({ ...user, username: name.trim(), email: email.trim(), imageUrl: uploadedUrl ?? user.imageUrl })



            setIsEditModalOpen(false);
            setPickedAvatarUri(null);
        } catch (err: any) {
            console.error("Failed to save profile", err);
            Alert.alert("خطأ", err?.message ?? "فشل تحديث الملف الشخصي");
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        Alert.alert(
            "تأكيد الحذف",
            "هل أنت متأكد أنك تريد حذف الحساب؟ هذا لا يمكن التراجع عنه.",
            [
                { text: "إلغاء", style: "cancel" },
                {
                    text: "حذف",
                    style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            await deleteUserAccount();
                            setIsDeleteModalOpen(false);
                            // TODO: after deletion - navigate to auth screen and clear tokens/context
                        } catch (err: any) {
                            console.error("Failed to delete account", err);
                            Alert.alert("خطأ", err?.message ?? "فشل حذف الحساب");
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    // fallback muted color (you asked to use hex)
    const MUTED_HEX = "#9CA3AF";

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scroll} contentContainerStyle={[styles.content]}>
                {/* Avatar section — centered but full-width parent */}
                <View
                    style={[
                        styles.avatarSection,
                        { borderBottomColor: themeMode === "light" ? "#e5e7eb" : "#374151" },
                    ]}
                >
                    <View style={styles.avatarCenter}>
                        {/* show preview if picked, otherwise existing user avatar (UserAvatar) */}
                        {pickedAvatarUri ? (
                            <Image source={{ uri: pickedAvatarUri }} style={styles.previewAvatar} />
                        ) : (
                            <UserAvatar /> // assuming UserAvatar accepts size prop; if not adjust accordingly
                        )}

                        <Text style={[styles.username, { color: colors.text, fontFamily: FONTS_CONSTANTS.bold }]}>
                            {user?.username}
                        </Text>
                        <Text style={[styles.email, { fontFamily: FONTS_CONSTANTS.semiBold }]}>{user?.email}</Text>
                        <Text style={[styles.joined, { color: MUTED_HEX }]}>
                            عضو منذ: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : ""}
                        </Text>
                    </View>
                </View>

                {/* Settings header (full width) */}
                <View
                    style={[
                        styles.sectionWrapper,
                        { borderBottomColor: themeMode === "light" ? "#e5e7eb" : "#374151" },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={28} color={themeMode === "light" ? "#1f2937" : "#fff"} />
                        <Text style={[styles.sectionTitle, { color: themeMode === "light" ? "#1f2937" : "#fff" }]}>
                            الإعدادات
                        </Text>
                    </View>

                    {/* Account Card (full width) */}
                    <View style={[styles.card, { backgroundColor: themeMode === "light" ? "#f8fafc" : "rgba(15,23,42,0.6)" }]}>
                        <Text style={[styles.cardTitle, { color: themeMode === "light" ? "#000" : "#fff" }]}>الحساب</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => setIsEditModalOpen(true)}
                                style={[styles.button, { backgroundColor: themeMode === "light" ? "#e6eef7" : "#374151" }]}
                            >
                                <Feather name="edit-2" size={16} color={themeMode === "light" ? "#1f2937" : "#fff"} />
                                <Text style={[styles.buttonText, { color: colors.text }]}>تعديل الملف الشخصي</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsDeleteModalOpen(true)}
                                style={[styles.button, { backgroundColor: themeMode === "light" ? "#fee2e2" : "rgba(153,27,27,0.14)" }]}
                            >
                                <Feather name="trash-2" size={16} color="#dc2626" />
                                <Text style={[styles.buttonText, { color: themeMode === "light" ? "#b91c1c" : "#fca5a5" }]}>
                                    طلب حذف الحساب
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <UserReviews userReviews={[]} />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={isEditModalOpen} animationType="slide" transparent onRequestClose={() => setIsEditModalOpen(false)}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalInner}>
                        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>تعديل الملف الشخصي</Text>

                            {/* Avatar picker + preview */}
                            <View style={{ marginTop: 12, marginBottom: 8, alignItems: "center" }}>
                                {pickedAvatarUri ? (
                                    <Image source={{ uri: pickedAvatarUri }} style={styles.modalAvatarPreview} />
                                ) : user?.imageUrl ? (
                                    <Image source={{ uri: user.imageUrl }} style={styles.modalAvatarPreview} />
                                ) : (
                                    <UserAvatar />
                                )}

                                <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        style={[styles.smallButton, { backgroundColor: themeMode === "light" ? "#e6eef7" : "#374151" }]}
                                        disabled={isPicking}
                                    >
                                        {isPicking ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff" }}>تغيير الصورة</Text>}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setPickedAvatarUri(null)}
                                        style={[styles.smallButton, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#9CA3AF" }]}
                                    >
                                        <Text style={{ color: colors.text }}>إلغاء التحديد</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="الاسم"
                                placeholderTextColor={MUTED_HEX}
                                style={[styles.input, { color: colors.text, borderColor: themeMode === "light" ? "#e5e7eb" : "#374151" }]}
                                autoCapitalize="words"
                            />

                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="البريد الإلكتروني"
                                keyboardType="email-address"
                                placeholderTextColor={MUTED_HEX}
                                style={[styles.input, { color: colors.text, borderColor: themeMode === "light" ? "#e5e7eb" : "#374151" }]}
                                autoCapitalize="none"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsEditModalOpen(false);
                                        setPickedAvatarUri(null);
                                    }}
                                    style={[styles.modalButton, { backgroundColor: "transparent", borderColor: "#9CA3AF", borderWidth: 1 }]}
                                >
                                    <Text style={{ color: colors.text }}>إلغاء</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSaveProfile} style={[styles.modalButton, { backgroundColor: "#1f2937" }]} disabled={saving}>
                                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff" }}>حفظ</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={isDeleteModalOpen} animationType="fade" transparent onRequestClose={() => setIsDeleteModalOpen(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>تأكيد حذف الحساب</Text>
                        <Text style={{ color: MUTED_HEX, marginTop: 8 }}>
                            حذف الحساب سيؤدي إلى إزالة جميع بياناتك. هل تود المتابعة؟
                        </Text>

                        <View style={[styles.modalButtons, { marginTop: 16 }]}>
                            <TouchableOpacity
                                onPress={() => setIsDeleteModalOpen(false)}
                                style={[styles.modalButton, { backgroundColor: "transparent", borderColor: "#9CA3AF", borderWidth: 1 }]}
                                disabled={deleting}
                            >
                                <Text style={{ color: colors.text }}>إلغاء</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleConfirmDelete} style={[styles.modalButton, { backgroundColor: "#991B1B" }]} disabled={deleting}>
                                {deleting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff" }}>حذف</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: "100%",
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    content: {
        padding: 16,
        alignItems: "stretch", // children with width: "100%" will fill
    },

    avatarSection: {
        width: "100%",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    avatarCenter: {
        width: "100%",
        alignItems: "center", // center avatar & texts only in this area
    },
    previewAvatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        marginBottom: 8,
    },
    modalAvatarPreview: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 8,
    },
    username: {
        fontSize: 26,
        marginTop: 8,
    },
    email: {
        marginTop: 4,
        color: "#9CA3AF",
    },
    joined: {
        marginTop: 8,
        fontSize: 12,
        color: "#9CA3AF",
    },

    sectionWrapper: {
        width: "100%",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 8,
    },

    card: {
        width: "100%", // critical: full width card
        borderRadius: 12,
        padding: 12,
    },
    cardTitle: {
        fontWeight: "700",
        marginBottom: 12,
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    buttonText: {
        marginLeft: 8,
        fontWeight: "700",
        fontSize: 13,
    },

    /* Modal styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalInner: {
        width: "100%",
        maxWidth: 520,
    },
    modalCard: {
        borderRadius: 12,
        padding: 16,
        width: "100%",
    },
    confirmCard: {
        borderRadius: 12,
        padding: 16,
        width: "100%",
        maxWidth: 520,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        marginTop: 12,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 16,
    },
    modalButton: {
        minWidth: 90,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    /* small modal controls */
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 6,
    },
});
