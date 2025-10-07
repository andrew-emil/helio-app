import { useUser } from '@/context/userContext';
import { auth } from '@/services/firebase/firebase';
import { UserAccountHookReturn } from '@/types/profile.types';
import { errorHandler } from '@/utils/errorHandler';
import { router } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export const useUserAccount = (): UserAccountHookReturn => {
  const { logout } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Toast.show({
        type: 'error',
        text1: "حدث خطأ فى مسح الحساب"
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteUser(currentUser);
      await logout();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to ensure logout is complete
      router.replace("/(auth)/login");
    } catch (error: any) {
      const appError = errorHandler.handleError(error, 'deleteAccount');

      if (appError.code === "AUTH_REQUIRES_RECENT_LOGIN") {
        Toast.show({
          type: "info",
          text1: appError.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: appError.message,
        });
      }
      throw appError;
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteAccount = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "تأكيد الحذف",
        "هل أنت متأكد أنك تريد حذف الحساب؟ هذا لا يمكن التراجع عنه.",
        [
          { text: "إلغاء", style: "cancel", onPress: () => reject(new Error('Cancelled')) },
          {
            text: "حذف",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAccount();
                resolve();
              } catch (error) {
                reject(error);
              }
            },
          },
        ]
      );
    });
  };

  return {
    isDeleting,
    deleteAccount,
    confirmDeleteAccount,
  };
};
