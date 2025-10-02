import UserReviews from "@/components/profile/userReview";
import UserAvatar from "@/components/userAvatar";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { UserStorage } from "@/services/storage/userStoage";
import { supabase } from "@/services/supabseClient";
import { getUserProfile, saveUserProfile } from "@/services/user";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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


export default function Profile() {
    const { themeMode, colors } = useTheme();
    const { user, setUser, setGuest } = useUser();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [name, setName] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [pickedAvatarUri, setPickedAvatarUri] = useState<string | null>(null);
    const [isPicking, setIsPicking] = useState(false);
    const [, setHasGalleryPermission] = useState<boolean | null>(null);


    useEffect(() => {
        const loadUserData = async () => {
            if (user?.uid) {
                try {
                    const userData = await getUserProfile(user.uid);
                    if (userData) {

                        setName(userData.username || '');
                        setEmail(userData.email || '');

                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            }
        };

        loadUserData();
    }, [user?.uid]);

    useEffect(() => {

        if (!isEditModalOpen) {
            setPickedAvatarUri(null);
        }
    }, [isEditModalOpen]);

    useEffect(() => {
        if (isEditModalOpen) {
            (async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                setHasGalleryPermission(status === "granted");
            })();
        }
    }, [isEditModalOpen]);



    const updateUserProfile = async (payload: { username?: string; email?: string; imageUrl?: string | null }) => {
        if (!user?.uid) {
            throw new Error('User not authenticated');
        }

        try {
            await saveUserProfile(user.uid, {
                username: payload.username,
                email: payload.email,
                imageUrl: payload.imageUrl,
            });
            setUser({
                uid: user.uid,
                username: payload.username!,
                email: payload.email!,
                imageUrl: payload.imageUrl!,
            })

        } catch (error) {
            console.error('Error updating profile in Firestore:', error);
            throw error;
        }
    };

    const deleteUserAccount = async () => {

        await new Promise((r) => setTimeout(r, 900));
    };


    const uploadImageToServer = async (localUri: string): Promise<string> => {
        try {
            const fileExt = localUri.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `public/${fileName}`;

            // Create a FormData object
            const formData = new FormData();
            formData.append('file', {
                uri: localUri,
                name: fileName,
                type: `image/${fileExt}`,
            } as any);

            // Upload the FormData
            const { error } = await supabase.storage
                .from('helio-images')
                .upload(filePath, formData, {
                    contentType: `image/${fileExt}`,
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('helio-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (err) {
            console.error("Error uploading image:", err);
            throw err;
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // Fixed: Use the current status check, not hasGalleryPermission
        if (status !== 'granted') {
            Alert.alert("صلاحيات مفقودة", "يرجى السماح بالوصول إلى الصور من إعدادات التطبيق.");
            return;
        }

        try {
            setIsPicking(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if ("canceled" in result && result.canceled) {
                return;
            }

            const uri = result.assets?.[0]?.uri;
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

                uploadedUrl = await uploadImageToServer(pickedAvatarUri);
            }


            await updateUserProfile({
                username: name.trim(),
                email: email.trim(),
                ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
            });


            setIsEditModalOpen(false);
            setPickedAvatarUri(null);


            Alert.alert("تم الحفظ", "تم تحديث الملف الشخصي بنجاح");

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
                            await UserStorage.clearUserData()
                            setUser(null)
                            setGuest(true)
                            setIsDeleteModalOpen(false);

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
                            <UserAvatar />
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
                                    style={[styles.modalButton, { backgroundColor: colors.surface }]}
                                >
                                    <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>إلغاء</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSaveProfile} style={[styles.modalButton, { backgroundColor: colors.primary }]} disabled={saving}>
                                    {saving ? <ActivityIndicator size="small" color={colors.text} /> : <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>حفظ التغيرات</Text>}
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
                            هل أنت متأكد أنك تريد المتابعة؟ سيتم إرسال طلبك إلى الإدارة، وبعد الموافقة سيتم حذف حسابك وبياناتك بشكل دائم.
                        </Text>

                        <View style={[styles.modalButtons, { marginTop: 16 }]}>
                            <TouchableOpacity
                                onPress={() => setIsDeleteModalOpen(false)}
                                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                                disabled={deleting}
                            >
                                <Text style={{ color: colors.text }}>إلغاء</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleConfirmDelete} style={[styles.modalButton, { backgroundColor: colors.error }]} disabled={deleting}>
                                {deleting ? <ActivityIndicator size="small" color={colors.text} /> : <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>حذف</Text>}
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
        alignItems: "stretch",
    },

    avatarSection: {
        width: "100%",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    avatarCenter: {
        width: "100%",
        alignItems: "center",
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
        width: "100%",
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
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontWeight: "700",
        fontSize: 13,
    },


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


    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 6,
    },
});
