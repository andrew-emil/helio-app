import { UserData } from './userContext.type';
import { UserProfileData } from './user.type';

export interface ProfileHookReturn {
  profileData: UserProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface ImagePickerHookReturn {
  pickedImageUri: string | null;
  isPicking: boolean;
  isUploading: boolean;
  pickImage: () => Promise<string | null>;
  uploadImageToServer: (localUri: string) => Promise<string>;
  clearPickedImage: () => void;
}

export interface UserAccountHookReturn {
  isDeleting: boolean;
  deleteAccount: () => Promise<void>;
  confirmDeleteAccount: () => Promise<void>;
}

export interface ProfileHeaderProps {
  user: UserData | null;
  previewAvatarUri?: string | null;
}

export interface AccountSettingsProps {
  onEditProfile: () => void;
  onDeleteAccount: () => void;
}

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileFormData) => Promise<void>;
  user: UserData | null;
  initialName: string;
  initialEmail: string;
  isSaving: boolean;
}

export interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  imageUrl?: string;
}

export interface ProfileUpdateData {
  username: string;
  email: string;
  imageUrl?: string;
}

export type ProfileAction = 'edit' | 'delete' | 'view';

export interface ProfileState {
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isSaving: boolean;
  editForm: ProfileFormData;
}
