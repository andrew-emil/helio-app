import { useRouter } from "expo-router"; // or useNavigation if using react-navigation
import React from "react";
import { Pressable, Text, View } from "react-native";

type QuickAccessCardProps = {
    icon: React.ReactNode;
    title: string;
    to: string;
};

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ icon, title, to }) => {
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.push(to as any)}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center w-40"
            style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.95 : 1 }] }, // mimic hover scale
            ]}
        >
            <View className="flex items-center justify-center w-14 h-14 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-3">
                {icon}
            </View>
            <Text className="text-base font-bold text-gray-800 dark:text-white">
                {title}
            </Text>
        </Pressable>
    );
};

export default QuickAccessCard;
