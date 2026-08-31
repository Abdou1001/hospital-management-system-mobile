import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import AuthHeader from "@/components/shared/AuthHeader";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";

const SafeAreaView = styled(RNSafeAreaView);

const ResetPasswordScreen = () => {
    const router = useRouter();
    const { phone_number, resetCode } = useLocalSearchParams<{
        phone_number?: string;
        resetCode?: string;
    }>();
    const { isDark } = useThemeStore();
    const { mutate: resetMutate, isPending } = useResetPassword();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const handleReset = () => {
        setErrors({});
        let hasError = false;
        const newErrors: typeof errors = {};

        if (!password || password.length < 6) {
            newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
            hasError = true;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "كلمات المرور غير متطابقة";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            toast.error(newErrors.password || newErrors.confirmPassword || "يرجى التحقق من البيانات");
            return;
        }

        resetMutate({
            phone_number: phone_number || "",
            resetCode: resetCode || "",
            password,
            confirmPassword,
        });
    };

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Keyboard.dismiss}>
                {/* الهيدر العلوي المزخرف بالشعار */}
                <AuthHeader title="كلمة مرور جديدة" />

                {/* كارت الفورم */}
                <SafeAreaView className="flex-1 px-6 -mt-8 pb-10">
                    <View
                        className={`w-full rounded-3xl border p-6 shadow-sm ${isDark
                                ? "border-slate-800 bg-slate-800/90"
                                : "border-slate-100 bg-white"
                            }`}>
                        {/* العنوان */}
                        <Text
                            className={`font-sans-bold text-2xl ${isDark ? "text-white" : "text-slate-800"
                                }`}
                            style={{ textAlign: "right" }}>
                            تعيين كلمة مرور جديدة
                        </Text>

                        <Text
                            className="mt-2 font-sans-medium text-sm leading-6 text-muted-foreground dark:text-slate-400"
                            style={{ textAlign: "right" }}>
                            أدخل كلمة المرور الجديدة وتأكيدها لإتمام عملية الاسترداد
                        </Text>

                        {/* أيقونة توضيحية */}
                        <View className="my-5 items-center">
                            <View className="size-20 items-center justify-center rounded-full bg-main/10 border-2 border-main/20">
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={38}
                                    color="#10b981"
                                />
                            </View>
                        </View>

                        {/* حقل كلمة المرور الجديدة */}
                        <View>
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                style={{ textAlign: "right" }}>
                                كلمة المرور الجديدة
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${errors.password
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                            ? "border-slate-700 bg-slate-900/60"
                                            : "border-slate-200 bg-slate-50"
                                    }`}>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                                    secureTextEntry={!showPassword}
                                    className={`flex-1 font-sans-medium text-base ${isDark ? "text-white" : "text-slate-900"
                                        }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="p-2">
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </Pressable>
                            </View>
                            {errors.password ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.password}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل تأكيد كلمة المرور */}
                        <View className="mt-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                style={{ textAlign: "right" }}>
                                تأكيد كلمة المرور
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${errors.confirmPassword
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                            ? "border-slate-700 bg-slate-900/60"
                                            : "border-slate-200 bg-slate-50"
                                    }`}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                                    secureTextEntry={!showConfirmPassword}
                                    className={`flex-1 font-sans-medium text-base ${isDark ? "text-white" : "text-slate-900"
                                        }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="p-2">
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                </Pressable>
                            </View>
                            {errors.confirmPassword ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.confirmPassword}
                                </Text>
                            ) : null}
                        </View>

                        {/* زر الحفظ */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleReset}
                            className={`mt-6 h-14 w-full items-center justify-center rounded-2xl bg-main shadow-md ${isPending ? "opacity-70" : ""
                                }`}>
                            {isPending ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text className="font-sans-bold text-base text-white">
                                    حفظ كلمة المرور الجديدة
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

export default ResetPasswordScreen;
