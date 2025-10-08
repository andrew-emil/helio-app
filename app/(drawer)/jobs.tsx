import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "@/components/emptyState";
import ErrorFallback from "@/components/errorFallback";
import PageBanner from "@/components/pageBanner";
import Spinner from "@/components/spinner";

import AddJobForm from "@/components/jobs/addJobForm";
import JobPostingCard from "@/components/jobs/jobPostingCard";
import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/context/userContext";
import { getAllJobs } from "@/services/firebase/jobs";
import Toast from "react-native-toast-message";


export default function Jobs() {
    const { colors } = useTheme();
    const { isLoggedIn, isGuest } = useUser()
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: jobs,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => await getAllJobs(),
    });

    if (isLoading) return <Spinner />;
    if (error) return <ErrorFallback />;

    const filteredItems = jobs?.filter(
        (item: any) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = () => {
        if (!isLoggedIn || isGuest) {
            Toast.show({
                type: 'error',
                text1: "سجل دخولك اولآ لتضع اعلانك"
            })
            return
        } else {
            setIsModalOpen(true)
        }
    }

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            <FlatList
                data={filteredItems}
                keyExtractor={(item, index) => `${item.creationDate}-${index}`}
                ListHeaderComponent={
                    <View className="px-4 py-6">
                        <PageBanner
                            title="الوظائف المتاحة"
                            subtitle="ابحث عن فرصتك الوظيفية التالية داخل المدينة."
                            icon={
                                <Ionicons
                                    name="briefcase-outline"
                                    size={40}
                                    color="#84CC16"
                                />
                            }
                        />

                        {/* 🔍 Search & Add Button */}
                        <View
                            className="flex flex-col sm:flex-row gap-3 mt-6 p-4 rounded-2xl shadow-md"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <View className="relative flex-1">
                                <Feather
                                    name="search"
                                    size={18}
                                    color={colors.muted}
                                    style={{
                                        position: "absolute",
                                        right: 12,
                                        top: 14,
                                    }}
                                />
                                <TextInput
                                    placeholder="ابحث عن وظيفة او شركة..."
                                    placeholderTextColor={colors.muted}
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    style={{
                                        backgroundColor: colors.headerColor,
                                        borderRadius: 10,
                                        paddingRight: 36,
                                        paddingLeft: 12,
                                        paddingVertical: 10,
                                        color: colors.text,
                                        fontFamily: FONTS_CONSTANTS.regular,
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleOpenModal}
                                className="flex-row items-center justify-center gap-2 rounded-lg py-3 px-4"
                                style={{ backgroundColor: colors.primary }}
                            >
                                <Entypo name="plus" size={18} color="#fff" />
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontFamily: FONTS_CONSTANTS.semiBold,
                                        fontSize: 14,
                                    }}
                                >
                                    أضف وظيفة
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <JobPostingCard job={item} />
                )}
                ListEmptyComponent={
                    <EmptyState
                        icon={
                            < Ionicons
                                name="briefcase-outline"
                                size={22}
                                color="#84CC16"
                            />
                        }
                        title="لا توجد وظائف متاحة حالياً"
                        message="سيتم عرض الوظائف هنا عند توفرها."
                    />
                }
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
            />
            <Toast />

            {/* 🧾 Modal for Add Item */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{ width: "100%", height: "100%" }}
            >
                <ScrollView className="flex-1 bg-black/50"
                    contentContainerClassName="justify-center items-center"
                >
                    <View
                        className="w-11/12 rounded-2xl p-5"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text
                                className="text-lg"
                                style={{
                                    fontFamily: FONTS_CONSTANTS.bold,
                                    color: colors.text,
                                }}
                            >
                                إضافة وظيفة جديدة
                            </Text>
                            <Pressable onPress={() => setIsModalOpen(false)}>
                                <Entypo
                                    name="cross"
                                    size={24}
                                    color={colors.text}
                                />
                            </Pressable>
                        </View>

                        <AddJobForm
                            onClose={() => setIsModalOpen(false)}
                            onSave={() => {
                                setIsModalOpen(false);
                            }}
                        />
                    </View>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
}
