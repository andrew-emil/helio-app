import EmergemcyContent from "@/components/emergency/emergencyContent";
import { TabEmergencyButton } from "@/components/emergency/tabButton";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";
import { useTheme } from "@/context/themeContext";
import getAllEmergencies from "@/services/firebase/emergency";
import { emerencyType } from "@/types/firebaseDocs.type";
import Feather from '@expo/vector-icons/Feather';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Emergency() {
    const { colors } = useTheme()
    const [activeTab, setActiveTab] = useState<emerencyType>('city')

    const { data, isLoading, error } = useQuery({
        queryKey: ['emer'],
        queryFn: async () => await getAllEmergencies()
    })
    if (!data || isLoading) return <Spinner />
    if (error) return <ErrorFallback />

    const { cityEmergemcy, nationalEmergency } = data


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
                    title="أرقام الطوارئ"
                    subtitle="أرقام تهمك للحالات الطارئة داخل وخارج المدينة."
                    icon={<Feather name="alert-triangle" size={48} color={colors.error} />}
                />
                <View className="flex-col justify-center items-center gap-3 my-10">
                    <View className="flex-row justify-center items-center gap-2 mx-6">
                        <TabEmergencyButton
                            active={activeTab === 'city'}
                            onPress={() => setActiveTab('city')}
                            count={cityEmergemcy.length}
                        >
                            خاصة بالمدينة
                        </TabEmergencyButton>
                        <TabEmergencyButton
                            active={activeTab === 'national'}
                            onPress={() => setActiveTab('national')}
                            count={nationalEmergency.length}
                        >
                            أرقام قومية
                        </TabEmergencyButton>
                    </View>
                    <EmergemcyContent contactsToShow={activeTab === 'city' ? cityEmergemcy : nationalEmergency} activeTab={activeTab} />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}