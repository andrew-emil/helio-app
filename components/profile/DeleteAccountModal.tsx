import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { useTheme } from '@/context/themeContext';
import { DeleteAccountModalProps } from '@/types/profile.types';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MUTED_HEX = "#9CA3AF";

export default function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAccountModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>تأكيد حذف الحساب</Text>
          <Text style={{ color: MUTED_HEX, marginTop: 8 }}>
            هل أنت متأكد أنك تريد المتابعة؟ سيتم إرسال طلبك إلى الإدارة، وبعد الموافقة سيتم حذف حسابك وبياناتك بشكل دائم.
          </Text>

          <View style={[styles.modalButtons, { marginTop: 16 }]}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.modalButton, { backgroundColor: colors.surface }]}
              disabled={isDeleting}
            >
              <Text style={{ color: colors.text }}>إلغاء</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onConfirm} 
              style={[styles.modalButton, { backgroundColor: colors.error }]} 
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Text style={{ color: colors.text, fontFamily: FONTS_CONSTANTS.regular }}>حذف</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
