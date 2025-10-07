import PageBanner from "@/components/pageBanner";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useBg } from "@/hooks/useBg";
import { ThemeColors } from "@/types/themeTypes";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


interface ContactCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    href: string;
    colors: ThemeColors
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, value, href, colors }) => {
    const { bg } = useBg()
    return (
        <TouchableOpacity
            className="flex-row items-center gap-4 mb-6"
            onPress={() => Linking.openURL(href)}
        >
            <View className={`p-4 ${bg("bg-cyan-100", "bg-cyan-900/50")} rounded-full`}>
                {icon}
            </View>
            <View>
                <Text className="text-lg "
                    style={{ fontFamily: FONTS_CONSTANTS.semiBold, color: colors.text }}
                >
                    {title}
                </Text>
                <Text className="text-cyan-500">{value}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Contact() {
    const { colors } = useTheme()
    const { bg } = useBg()

    return (
        <SafeAreaView className="animate-fade-in flex-1 w-full"
            style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="w-full flex-1"
                contentContainerStyle={{
                    padding: 16,
                    alignItems: "stretch",
                }}
            >
                <PageBanner
                    title="تواصل معنا"
                    subtitle="نسعد بسماع آرائكم ومقترحاتكم. فريقنا جاهز للرد على استفساراتكم."
                    icon={<Ionicons name="call" size={48} color="#06b6d4" />}
                />
                <View className="p-6 rounded-2xl shadow flex-1"
                    style={{ backgroundColor: colors.background }}>
                    <View className="mb-8">
                        <Text className="text-2xl mb-3"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}>
                            معلومات الاتصال
                        </Text>
                        <Text
                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                            يمكنكم التواصل معنا مباشرة عبر القنوات التالية:
                        </Text>
                    </View>

                    <ContactCard
                        colors={colors}
                        icon={<Feather name="mail" size={24} color="#06b6d4" />}
                        title="البريد الإلكتروني للدعم"
                        value="support@tech-bokra.com"
                        href="mailto:support@tech-bokra.com"
                    />

                    <ContactCard
                        colors={colors}
                        icon={<FontAwesome name="phone" size={24} color="#06b6d4" />}
                        title="الهاتف"
                        value="+20 104 030 3547"
                        href="tel:+201040303547"
                    />

                    <View className={`${bg("bg-stale-50", "bg-stale-900/50")} p-6 rounded-lg mt-8 text-center border`}
                    style={{borderColor: colors.surface}}>
                        <Text className="text-xl  mb-2"
                            style={{ fontFamily: FONTS_CONSTANTS.bold, color: colors.text }}>
                            ساعات العمل
                        </Text>
                        <Text className="text-center"
                            style={{ fontFamily: FONTS_CONSTANTS.regular, color: colors.muted }}>
                            الدعم الفني متاح من الأحد إلى الخميس،{"\n"}من الساعة 9 صباحاً حتى 5 مساءً بتوقيت القاهرة.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}