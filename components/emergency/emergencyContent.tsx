import { useTheme } from "@/context/themeContext";
import { emerencyType, EmerengyDocData } from "@/types/firebaseDocs.type";
import { Feather } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import EmptyState from "../emptyState";
import EmergencyItem from "./emergencyItem";

interface Props {
    contactsToShow: EmerengyDocData[];
    activeTab: emerencyType;
}

export default function EmergemcyContent({ contactsToShow, activeTab }: Props) {
    const { colors } = useTheme()

    return (
        <View className="space-y-8">
            {contactsToShow.length > 0 ? (
                <FlatList
                    data={contactsToShow}
                    keyExtractor={(contact) => contact.id}
                    renderItem={({ item }) => (
                        <View className="space-y-6">
                            <EmergencyItem contact={item} />
                        </View>
                    )}
                    scrollEnabled={false}
                />
            ) : (
                <EmptyState
                    icon={<Feather name="alert-triangle" size={48} color={colors.muted} />}
                    title={`لا توجد أرقام ${activeTab === 'city' ? 'خاصة بالمدينة' : 'قومية'} مضافة`}
                    message="يمكنك انتظار إضافة الأرقام من قبل الادمن."
                />
            )}
        </View>
    )
}