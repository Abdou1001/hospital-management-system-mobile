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
import { useChangePassword } from "@/hooks/users/useChangePassword";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    onClose,
}) => {
    const { isDark } = useThemeStore();
    const { mutate: changePasswordMutate, isPending } = useChangePassword();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState<{
        current?: string;
        new?: string;
        confirm?: string;
    }>({});

    useEffect(() => {
        if (visible) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowCurrent(false);
            setShowNew(false);
            setShowConfirm(false);
            setErrors({});
        }
    }, [visible]);

    const handleSubmit = () => {
        setErrors({});
        const newErrors: typeof errors = {};
        let hasError = false;

        if (!currentPassword) {
            newErrors.current = "يرجى إدخال كلمة المرور الحالية";
            hasError = true;
        }

        if (!newPassword || newPassword.length < 6) {
            newErrors.new = "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل";
            hasError = true;
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirm = "كلمتا المرور غير متطابقتين";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            toast.error(
                newErrors.current ||
                    newErrors.new ||
                    newErrors.confirm ||
                    "يرجى تصحيح الأخطاء"
            );
            return;
        }

        changePasswordMutate(
            {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
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
                                    name="lock-closed-outline"
                                    size={22}
                                    color="#10b981"
                                />
                            </View>
                            <Text
                                className={`font-sans-bold text-lg ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                تغيير كلمة المرور
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
                        {/* كلمة المرور الحالية */}
                        <View className="mb-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                كلمة المرور الحالية
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.current
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-800"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    secureTextEntry={!showCurrent}
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() => setShowCurrent(!showCurrent)}
                                    className="p-2">
                                    <Ionicons
                                        name={
                                            showCurrent
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={20}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </Pressable>
                            </View>
                            {errors.current ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.current}
                                </Text>
                            ) : null}
                        </View>

                        {/* كلمة المرور الجديدة */}
                        <View className="mb-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                كلمة المرور الجديدة
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.new
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-800"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    secureTextEntry={!showNew}
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() => setShowNew(!showNew)}
                                    className="p-2">
                                    <Ionicons
                                        name={
                                            showNew
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={20}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </Pressable>
                            </View>
                            {errors.new ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.new}
                                </Text>
                            ) : null}
                        </View>

                        {/* تأكيد كلمة المرور الجديدة */}
                        <View className="mb-6">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                تأكيد كلمة المرور الجديدة
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.confirm
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-800"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    secureTextEntry={!showConfirm}
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowConfirm(!showConfirm)
                                    }
                                    className="p-2">
                                    <Ionicons
                                        name={
                                            showConfirm
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={20}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </Pressable>
                            </View>
                            {errors.confirm ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.confirm}
                                </Text>
                            ) : null}
                        </View>

                        {/* Submit Button */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleSubmit}
                            className={`h-14 w-full rounded-2xl bg-main items-center justify-center shadow-md ${
                                isPending ? "opacity-70" : ""
                            }`}>
                            {isPending ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />
                            ) : (
                                <Text className="font-sans-bold text-base text-white">
                                    حفظ كلمة المرور الجديدة
                                </Text>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ChangePasswordModal;
