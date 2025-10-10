import { useUser } from '@/context/userContext';
import { getUserProfile, saveUserProfile } from '@/services/firebase/user';
import { ProfileHookReturn } from '@/types/profile.types';
import { UserProfileData } from '@/types/user.type';
import { errorHandler } from '@/utils/errorHandler';
import { useEffect, useState } from 'react';

export const useProfile = (): ProfileHookReturn => {
  const { user, setUser } = useUser();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfile(user.uid);
      setProfileData(data);
    } catch (err) {
      const appError = errorHandler.handleError(err, 'loadProfileData');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      await saveUserProfile(user.uid, data);

      // Update user context
      setUser({
        ...user,
        username: data.username || user.username,
        email: data.email || user.email,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : user.imageUrl,
      });

      // Update local state
      setProfileData(prev => prev ? { ...prev, ...data } : data);

    } catch (err) {
      const appError = errorHandler.handleError(err, 'updateProfile');
      setError(appError.message);
      throw appError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user?.uid]);

  return {
    profileData,
    loading,
    error,
    updateProfile,
    refetch: loadProfileData,
  };
};
