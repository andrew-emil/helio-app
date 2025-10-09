// src/components/NewPostForm.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { PlusIcon, TrashIcon } from "./icons";
import { useTheme } from "@/context/themeContext";

type Props = {
    onClose: () => void;
    onCreate: (payload: any) => void;
};

export default function NewPostForm({ onClose, onCreate }: Props) {
    const { colors } = useTheme();
    const [category, setCategory] = useState<string>("نقاش عام");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [targetAudience, setTargetAudience] = useState("");

    useEffect(() => {
        if (category !== "نقاش خاص") setTargetAudience("");
        if (category !== "استطلاع رأي") setPollOptions(["", ""]);
    }, [category]);

    const handleCreate = () => {
        if (!content.trim() && category !== "استطلاع رأي" && category !== "نقاش خاص") {
            Alert.alert("خطأ", "المحتوى مطلوب.");
            return;
        }

        const data: any = { category, title: title.trim() || undefined, content: content.trim() };

        if (category === "استطلاع رأي") {
            const opts = pollOptions.map((o) => ({ option: o.trim(), votes: [] })).filter((o) => o.option);
            if (opts.length < 2) {
                Alert.alert("خطأ", "يجب أن يحتوي الاستطلاع على خيارين على الأقل.");
                return;
            }
            data.pollOptions = opts;
        }

        if (category === "نقاش خاص") {
            if (!targetAudience.trim()) {
                Alert.alert("خطأ", "يرجى تحديد الجمهور المستهدف.");
                return;
            }
            data.targetAudience = targetAudience.trim();
        }

        onCreate(data);
        onClose();
    };

    const addOption = () => setPollOptions((s) => [...s, ""]);
    const removeOption = (i: number) => setPollOptions((s) => s.filter((_, idx) => idx !== i));
    const setOption = (i: number, v: string) => setPollOptions((s) => s.map((o, idx) => (idx === i ? v : o)));

    const categories = ["نقاش عام", "نقاش خاص", "سؤال", "حدث", "استطلاع رأي"];

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={[styles.label, { color: colors.text }]}>الفئة</Text>
            <View style={[styles.picker, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {categories.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setCategory(c)} style={{ paddingVertical: 8 }}>
                        <Text style={{ color: c === category ? colors.primary : colors.text, fontWeight: c === category ? "700" : "500" }}>
                            {c}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>
                {category === "استطلاع رأي" ? "السؤال الرئيسي للاستطلاع" : "العنوان (اختياري)"}
            </Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={category === "استطلاع رأي" ? "ما هو سؤالك؟" : "مثال: تجمع ملاك الحي الأول"}
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />

            <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>المحتوى</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="اكتب ما يدور في ذهنك..."
                multiline
                style={[styles.textarea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />

            {category === "نقاش خاص" && (
                <>
                    <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>الجمهور المستهدف</Text>
                    <TextInput
                        value={targetAudience}
                        onChangeText={setTargetAudience}
                        placeholder="مثال: سكان الحي الأول"
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    />
                </>
            )}

            {category === "استطلاع رأي" && (
                <View style={{ marginTop: 12 }}>
                    <Text style={[styles.label, { color: colors.text }]}>خيارات الاستطلاع</Text>
                    {pollOptions.map((opt, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                            <TextInput
                                value={opt}
                                onChangeText={(v) => setOption(i, v)}
                                style={[styles.input, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border }]}
                                placeholder={`خيار ${i + 1}`}
                            />
                            {pollOptions.length > 2 && (
                                <TouchableOpacity onPress={() => removeOption(i)} style={{ padding: 8 }}>
                                    <TrashIcon color={colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    <TouchableOpacity onPress={addOption} style={{ flexDirection: "row", gap: 8, marginTop: 8, alignItems: "center" }}>
                        <PlusIcon color={colors.primary} />
                        <Text style={{ color: colors.primary }}>إضافة خيار</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <TouchableOpacity onPress={onClose} style={[styles.btn, { backgroundColor: colors.border }]}>
                    <Text>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreate} style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
                    <Text style={{ color: "#fff" }}>نشر</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    label: { fontWeight: "700", marginBottom: 6 },
    input: { padding: 12, borderRadius: 8, borderWidth: 1 },
    textarea: { padding: 12, borderRadius: 8, borderWidth: 1, minHeight: 100, textAlignVertical: "top" },
    picker: { borderWidth: 1, borderRadius: 10, padding: 8 },
    btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, justifyContent: "center" },
    btnPrimary: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, justifyContent: "center" },
});
