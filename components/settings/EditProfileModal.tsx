import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useUpdateMyProfile } from "@/hooks/users/useUpdateMyProfile";
import { toast } from "@/lib/toast";
import { User } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    user: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    visible,
    onClose,
    user,
}) => {
    const { isDark } = useThemeStore();
    const { mutate: updateProfile, isPending } = useUpdateMyProfile();

    const [fullName, setFullName] = useState(user.full_name || "");
    const [email, setEmail] = useState(user.email || "");
    const [dateOfBirth, setDateOfBirth] = useState(user.date_of_birth || "");
    const [gender, setGender] = useState<"ذكر" | "أنثى">(
        user.gender === "أنثى" ? "أنثى" : "ذكر"
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            setFullName(user.full_name || "");
            setEmail(user.email || "");
            setDateOfBirth(user.date_of_birth || "");
            setGender(user.gender === "أنثى" ? "أنثى" : "ذكر");
            setError(null);
        }
    }, [visible, user]);

    const handleSave = () => {
        setError(null);
        const trimmedName = fullName.trim();

        if (!trimmedName || trimmedName.length < 3) {
            setError("يرجى إدخال الاسم الكامل (3 أحرف على الأقل)");
            toast.error("الاسم الكامل مطلوب");
            return;
        }

        updateProfile(
            {
                full_name: trimmedName,
                email: email.trim() || undefined,
                date_of_birth: dateOfBirth || undefined,
                gender: gender,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/60">
                <View
                    className={`w-full rounded-t-3xl border-t p-6 max-h-[90%] ${
                        isDark
                            ? "border-slate-800 bg-slate-900"
                            : "border-slate-100 bg-white"
                    }`}>
                    {/* Header */}
                    <View className="flex-row-reverse items-center justify-between pb-4 border-b border-border dark:border-slate-800">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <View className="size-10 rounded-xl bg-main/15 items-center justify-center">
                                <Ionicons
                                    name="person-circle-outline"
                                    size={24}
                                    color="#10b981"
                                />
                            </View>
                            <Text
                                className={`font-sans-bold text-lg ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                تعديل البيانات الشخصية
                            </Text>
                        </View>

                        <Pressable
                            onPress={onClose}
                            className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                            <Ionicons
                                name="close"
                                size={20}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 16 }}>
                        {/* ملاحظة رقم الهاتف */}
                        <View className="mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex-row-reverse items-center gap-2.5">
                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color="#f59e0b"
                            />
                            <Text
                                className="flex-1 font-sans-medium text-xs text-amber-700 dark:text-amber-300 leading-5"
                                style={{ textAlign: "right" }}>
                                لتغيير رقم الهاتف، يرجى استخدام خيار "تغيير رقم الهاتف" المخصص للتحقق الأمني.
                            </Text>
                        </View>

                        {/* حقل الاسم الكامل */}
                        <View className="mb-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                الاسم الكامل
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    error
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-800"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="أدخل اسمك الكامل"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={isDark ? "#64748b" : "#94a3b8"}
                                />
                            </View>
                            {error ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {error}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل البريد الإلكتروني */}
                        <View className="mb-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                البريد الإلكتروني (اختياري)
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-800"
                                        : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="example@mail.com"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={isDark ? "#64748b" : "#94a3b8"}
                                />
                            </View>
                        </View>

                        {/* تاريخ الميلاد والنوع في صف واحد */}
                        <View className="mb-6 flex-row-reverse space-x-3 space-x-reverse justify-between items-start">
                            {/* تاريخ الميلاد */}
                            <View className="flex-1">
                                <DatePickerInput
                                    label="تاريخ الميلاد"
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    placeholder="اختر التاريخ"
                                />
                            </View>

                            {/* النوع */}
                            <View className="w-36">
                                <Text
                                    className={`mb-2 font-sans-bold text-sm ${
                                        isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                    style={{ textAlign: "right" }}>
                                    النوع
                                </Text>
                                <View
                                    className={`h-14 w-full flex-row-reverse rounded-2xl border p-1 ${
                                        isDark
                                            ? "border-slate-700 bg-slate-800"
                                            : "border-slate-200 bg-slate-50"
                                    }`}>
                                    <Pressable
                                        onPress={() => setGender("أنثى")}
                                        className={`flex-1 items-center justify-center rounded-xl ${
                                            gender === "أنثى"
                                                ? "bg-main shadow-sm"
                                                : "bg-transparent"
                                        }`}>
                                        <Text
                                            className={`font-sans-bold text-sm ${
                                                gender === "أنثى"
                                                    ? "text-white"
                                                    : isDark
                                                      ? "text-slate-400"
                                                      : "text-slate-600"
                                            }`}>
                                            أنثى
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setGender("ذكر")}
                                        className={`flex-1 items-center justify-center rounded-xl ${
                                            gender === "ذكر"
                                                ? "bg-main shadow-sm"
                                                : "bg-transparent"
                                        }`}>
                                        <Text
                                            className={`font-sans-bold text-sm ${
                                                gender === "ذكر"
                                                    ? "text-white"
                                                    : isDark
                                                      ? "text-slate-400"
                                                      : "text-slate-600"
                                            }`}>
                                            ذكر
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row-reverse items-center gap-3">
                            <Pressable
                                disabled={isPending}
                                onPress={handleSave}
                                className={`flex-1 h-14 rounded-2xl bg-main items-center justify-center shadow-md ${
                                    isPending ? "opacity-70" : ""
                                }`}>
                                {isPending ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text className="font-sans-bold text-base text-white">
                                        حفظ التعديلات
                                    </Text>
                                )}
                            </Pressable>

                            <Pressable
                                onPress={onClose}
                                className="h-14 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 items-center justify-center">
                                <Text
                                    className={`font-sans-bold text-sm ${
                                        isDark
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    إلغاء
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default EditProfileModal;
