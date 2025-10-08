import ErrorFallback from "@/components/errorFallback";
import AccountSettings from "@/components/profile/AccountSettings";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserReviews from "@/components/profile/userReview";
import Spinner from "@/components/spinner";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useProfile } from "@/hooks/useProfile";
import { useUserAccount } from "@/hooks/useUserAccount";
import { RatingsStorage } from "@/services/storage/ratingsStorage";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const { colors } = useTheme();
    const { user } = useUser();

    // Custom hooks
    const { loading: profileLoading, updateProfile } = useProfile();
    const { isDeleting, confirmDeleteAccount } = useUserAccount();
    const { pickedImageUri, uploadImageToServer, clearPickedImage } = useImagePicker();

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

    const handleSaveProfile = useCallback(async (data: { name: string; email: string; imageUrl?: string }) => {
        if (!data.name.trim() || !data.email.trim()) {
            Alert.alert("خطأ", "يرجى ملء الحقول");
            return;
        }

        setIsSaving(true);
        try {
            let uploadedUrl: string | null = null;

            if (pickedImageUri) {
                uploadedUrl = await uploadImageToServer(pickedImageUri);
            }

            await updateProfile({
                username: data.name.trim(),
                email: data.email.trim(),
                ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
            });

            setIsEditModalOpen(false);
            clearPickedImage();
            Alert.alert("تم الحفظ", "تم تحديث الملف الشخصي بنجاح");
        } catch (err: any) {
            console.error("Failed to save profile", err);
            Alert.alert("خطأ", err?.message ?? "فشل تحديث الملف الشخصي");
        } finally {
            setIsSaving(false);
        }
    }, [pickedImageUri, uploadImageToServer, updateProfile, clearPickedImage]);

    const handleDeleteAccount = useCallback(async () => {
        try {
            await confirmDeleteAccount();
                            setIsDeleteModalOpen(false);
                        } catch (err: any) {
                            console.error("Failed to delete account", err);
            if (err.message !== 'Cancelled') {
                            Alert.alert("خطأ", err?.message ?? "فشل حذف الحساب");
            }
        }
    }, [confirmDeleteAccount]);

    if (isLoading || profileLoading) return <Spinner />;
    if (error) return <ErrorFallback />;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scroll} contentContainerStyle={[styles.content]}>
                <ProfileHeader user={user} previewAvatarUri={pickedImageUri} />

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