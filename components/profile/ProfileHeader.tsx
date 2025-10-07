import UserAvatar from '@/components/userAvatar';
import { FONTS_CONSTANTS } from '@/constants/fontsConstants';
import { PROFILE_CONSTANTS } from '@/constants/profileConstants';
import { useTheme } from '@/context/themeContext';
import { ProfileHeaderProps } from '@/types/profile.types';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileHeader({ user, previewAvatarUri }: ProfileHeaderProps) {
  const { themeMode, colors } = useTheme();

  return (
    <View
      style={[
        styles.avatarSection,
        { borderBottomColor: themeMode === "light" ? PROFILE_CONSTANTS.COLORS.BORDER_LIGHT : PROFILE_CONSTANTS.COLORS.BORDER_DARK },
      ]}
    >
      <View style={styles.avatarCenter}>
        {previewAvatarUri ? (
          <Image source={{ uri: previewAvatarUri }} style={styles.previewAvatar} />
        ) : (
          <UserAvatar />
        )}

        <Text style={[styles.username, { color: colors.text, fontFamily: FONTS_CONSTANTS.bold }]}>
          {user?.username}
        </Text>
        <Text style={[styles.email, { fontFamily: FONTS_CONSTANTS.semiBold }]}>
          {user?.email}
        </Text>
        <Text style={[styles.joined, { color: PROFILE_CONSTANTS.COLORS.MUTED }]}>
          عضو منذ: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: PROFILE_CONSTANTS.SIZES.AVATAR_LARGE,
    height: PROFILE_CONSTANTS.SIZES.AVATAR_LARGE,
    borderRadius: PROFILE_CONSTANTS.SIZES.AVATAR_LARGE / 2,
    marginBottom: PROFILE_CONSTANTS.SIZES.SPACING.SMALL,
  },
  username: {
    fontSize: PROFILE_CONSTANTS.TEXT.USERNAME_SIZE,
    marginTop: PROFILE_CONSTANTS.SIZES.SPACING.SMALL,
  },
  email: {
    marginTop: 4,
    color: PROFILE_CONSTANTS.COLORS.MUTED,
  },
  joined: {
    marginTop: PROFILE_CONSTANTS.SIZES.SPACING.SMALL,
    fontSize: PROFILE_CONSTANTS.TEXT.JOINED_SIZE,
    color: PROFILE_CONSTANTS.COLORS.MUTED,
  },
});
