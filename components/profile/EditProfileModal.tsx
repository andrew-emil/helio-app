import UserAvatar from '@/components/userAvatar';
import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { useImagePicker } from '@/hooks/useImagePicker';
import { EditProfileModalProps } from '@/types/profile.types';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';

const MUTED_HEX = "#9CA3AF";

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  user,
  initialName,
  initialEmail,
  isSaving,
}: EditProfileModalProps) {
  const { themeMode, colors } = useTheme();
  const { pickedImageUri, isPicking, pickImage, clearPickedImage } = useImagePicker();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
  }, [initialName, initialEmail]);

  const handleSave = async () => {
    await onSave({
      name,
      email,
      ...(pickedImageUri ? { imageUrl: pickedImageUri } : {}),
    });
  };

  const handleClose = () => {
    clearPickedImage();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalInner}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>تعديل الملف الشخصي</Text>

            {/* Avatar picker + preview */}
            <View style={styles.avatarSection}>
              {pickedImageUri ? (
                <Image source={{ uri: pickedImageUri }} style={styles.modalAvatarPreview} />
              ) : user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.modalAvatarPreview} />
              ) : (
                <UserAvatar />
              )}

              <View style={styles.avatarButtons}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={[styles.smallButton, { backgroundColor: themeMode === "light" ? "#e6eef7" : "#374151" }]}
                  disabled={isPicking}
                >
                  {isPicking ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff" }}>تغيير الصورة</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={clearPickedImage}
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
                onPress={handleClose}
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
              >
                <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.modalButton, { backgroundColor: colors.primary }]} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>حفظ التغيرات</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  avatarSection: {
    marginTop: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  modalAvatarPreview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  avatarButtons: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
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
