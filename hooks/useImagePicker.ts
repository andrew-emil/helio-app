import { supabase } from '@/services/supabseClient';
import { ImagePickerHookReturn } from '@/types/profile.types';
import { errorHandler } from '@/utils/errorHandler';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = (): ImagePickerHookReturn => {
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickImage = async (): Promise<string | null> => {
    const hasPermission = await requestPermissions();
    
    if (!hasPermission) {
      Alert.alert("صلاحيات مفقودة", "يرجى السماح بالوصول إلى الصور من إعدادات التطبيق.");
      return null;
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
        return null;
      }

      const uri = result.assets?.[0]?.uri;
      if (uri) {
        setPickedImageUri(uri);
        return uri;
      }
      
      return null;
    } catch (err) {
      const appError = errorHandler.handleError(err, 'pickImage');
      Alert.alert("خطأ", appError.message);
      return null;
    } finally {
      setIsPicking(false);
    }
  };

  const uploadImageToServer = async (localUri: string): Promise<string> => {
    try {
      setIsUploading(true);
      
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
    } catch (err) {
      const appError = errorHandler.handleError(err, 'uploadImageToServer');
      throw appError;
    } finally {
      setIsUploading(false);
    }
  };

  const clearPickedImage = () => {
    setPickedImageUri(null);
  };

  return {
    pickedImageUri,
    isPicking,
    isUploading,
    pickImage,
    uploadImageToServer,
    clearPickedImage,
  };
};
