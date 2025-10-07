import { useTheme } from '@/context/themeContext';
import { AccountSettingsProps } from '@/types/profile.types';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountSettings({ onEditProfile, onDeleteAccount }: AccountSettingsProps) {
  const { themeMode, colors } = useTheme();

  return (
    <View
      style={[
        styles.sectionWrapper,
        { borderBottomColor: themeMode === "light" ? "#e5e7eb" : "#374151" },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Feather name="settings" size={28} color={themeMode === "light" ? "#1f2937" : "#fff"} />
        <Text style={[styles.sectionTitle, { color: themeMode === "light" ? "#1f2937" : "#fff" }]}>
          الإعدادات
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: themeMode === "light" ? "#f8fafc" : "rgba(15,23,42,0.6)" }]}>
        <Text style={[styles.cardTitle, { color: themeMode === "light" ? "#000" : "#fff" }]}>الحساب</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={onEditProfile}
            style={[styles.button, { backgroundColor: themeMode === "light" ? "#e6eef7" : "#374151" }]}
          >
            <Feather name="edit-2" size={16} color={themeMode === "light" ? "#1f2937" : "#fff"} />
            <Text style={[styles.buttonText, { color: colors.text }]}>تعديل الملف الشخصي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeleteAccount}
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
  );
}

const styles = StyleSheet.create({
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
});
