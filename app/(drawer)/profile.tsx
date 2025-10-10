import ErrorFallback from "@/components/errorFallback";
import AccountSettings from "@/components/profile/AccountSettings";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserReviews from "@/components/profile/userReview";
import Spinner from "@/components/spinner";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserAccount } from "@/hooks/useUserAccount";
import { RatingsStorage } from "@/services/storage/ratingsStorage";
import { supabase } from "@/services/supabseClient";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Profile() {
    const { colors } = useTheme();
    const { user } = useUser();

    // Custom hooks
    const { loading: profileLoading, updateProfile } = useProfile();
    const { isDeleting, confirmDeleteAccount } = useUserAccount();

    // Local state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.username ?? "",
        email: user?.email ?? "",
    });

    // Query for user reviews
    const { data: myReviews, isLoading, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => await RatingsStorage.getAllRatings()
    });

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.username,
                email: user.email,
            });
        }
    }, [user]);

    const handleEditProfile = useCallback(() => {
        setEditForm({
            name: user?.username ?? "",
            email: user?.email ?? "",
        });
        setIsEditModalOpen(true);
    }, [user]);

    const uploadImageToServer = useCallback(async (localUri: string): Promise<string> => {
        const fileExt = localUri.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const formData = new FormData();
        formData.append('file', {
            uri: localUri,
            name: fileName,
            type: `image/${fileExt}`,
        } as any);

        const { error } = await supabase.storage
            .from('helio-images')
            .upload(filePath, formData, {
                contentType: `image/${fileExt}`,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('helio-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }, []);

    const handleSaveProfile = useCallback(async (data: { name: string; email: string; imageUrl?: string }) => {
        if (!data.name.trim() || !data.email.trim()) {
            Toast.show({
                type: "error",
                text1: "خطأ",
                text2: "يرجى ملء الحقول",
            });
            return;
        }

        setIsSaving(true);
        try {
            let uploadedUrl: string | null = null;

            if (data.imageUrl) {
                uploadedUrl = await uploadImageToServer(data.imageUrl);
            }

            await updateProfile({
                username: data.name.trim(),
                email: data.email.trim(),
                ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
            });

            setIsEditModalOpen(false);
            Toast.show({
                type: "success",
                text1: "تم الحفظ",
                text2: "تم تحديث الملف الشخصي بنجاح",
            });
        } catch (err: any) {
            console.error("Failed to save profile", err);
            Toast.show({
                type: "error",
                text1: "خطأ",
                text2: err?.message ?? "فشل تحديث الملف الشخصي",
            });
        } finally {
            setIsSaving(false);
        }
    }, [updateProfile, uploadImageToServer]);

    const handleDeleteAccount = useCallback(async () => {
        try {
            await confirmDeleteAccount();
            setIsDeleteModalOpen(false);
        } catch (err: any) {
            console.error("Failed to delete account", err);
            if (err.message !== 'Cancelled') {
                Toast.show({
                    type: "error",
                    text1: "خطأ",
                    text2: err?.message ?? "فشل حذف الحساب",
                });
            }
        }
    }, [confirmDeleteAccount]);

    if (isLoading || profileLoading) return <Spinner />;
    if (error) return <ErrorFallback />;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scroll} contentContainerStyle={[styles.content]}>
                <ProfileHeader user={user} />

                <AccountSettings
                    onEditProfile={handleEditProfile}
                    onDeleteAccount={() => setIsDeleteModalOpen(true)}
                />

                <UserReviews userReviews={myReviews!} />
            </ScrollView>

            <EditProfileModal
                visible={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
                user={user}
                initialName={editForm.name}
                initialEmail={editForm.email}
                isSaving={isSaving}
            />

            <DeleteAccountModal
                visible={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                isDeleting={isDeleting}
            />

            {/* Toast container */}
            <Toast />
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
});