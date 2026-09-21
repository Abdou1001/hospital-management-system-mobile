import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useLogin } from "@/hooks/auth/useLogin";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";
import { loginSchema } from "@/validation/auth/schemas/login.schema";

const SafeAreaView = styled(RNSafeAreaView);

const LoginScreen = () => {
    const router = useRouter();
    // hooks
    const { isDark } = useThemeStore();
    const { mutate: loginMutate, isPending } = useLogin();

    // حالة المدخلات
    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // الأخطاء
    const [errors, setErrors] = useState<{
        login?: string;
        password?: string;
        general?: string;
    }>({});

    const handleLogin = () => {
        setErrors({});

        // التحقق باستخدام Zod schema
        const validation = loginSchema.safeParse({
            login: loginInput,
            password: password,
        });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const loginErr = fieldErrors.login?.[0];
            const passErr = fieldErrors.password?.[0];

            setErrors({
                login: loginErr,
                password: passErr,
            });

            toast.error(
                loginErr ||
                    passErr ||
                    "يرجى كتابة رقم الهاتف / البريد وكلمة المرور بشكل صحيح",
            );
            return;
        }

        // إرسال البيانات للباك إند: { login, password }
        loginMutate(
            {
                login: loginInput.trim(),
                password: password,
            },
            {
                onSuccess: () => {
                    router.replace("/(tabs)");
                },
            },
        );
    };

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Keyboard.dismiss}>
                {/* الهيدر العلوي المزخرف بالشعار */}
                <AuthHeader />

                {/* كارت فورم تسجيل الدخول */}
                <SafeAreaView className="flex-1 px-6 -mt-8 pb-10">
                    <View
                        className={`w-full rounded-3xl border p-6 shadow-sm ${
                            isDark
                                ? "border-slate-800 bg-slate-800/90"
                                : "border-slate-100 bg-white"
                        }`}>
                        {/* العنوان */}
                        <Text
                            className={`font-sans-bold text-2xl ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}
                            style={{ textAlign: "right" }}>
                            تسجيل الدخول
                        </Text>

                        <Text
                            className="mt-1.5 font-sans-medium text-sm text-muted-foreground dark:text-slate-400"
                            style={{ textAlign: "right" }}>
                            يرجى إدخال رقم الهاتف أو البريد الإلكتروني للمتابعة
                        </Text>

                        {/* خطأ عام إن وجد */}
                        {errors.general ? (
                            <View className="mt-4 rounded-2xl bg-red-500/10 p-3">
                                <Text className="text-center font-sans-medium text-xs text-red-500">
                                    {errors.general}
                                </Text>
                            </View>
                        ) : null}

                        {/* حقل 1: رقم الهاتف أو البريد الإلكتروني */}
                        <View className="mt-6">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                رقم الهاتف أو البريد الإلكتروني
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.login
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={loginInput}
                                    onChangeText={setLoginInput}
                                    placeholder="أدخل رقم الهاتف أو البريد الإلكتروني"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                            </View>
                            {errors.login ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.login}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل 2: كلمة المرور */}
                        <View className="mt-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                كلمة المرور
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.password
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    secureTextEntry={!showPassword}
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                {/* زر إظهار/إخفاء كلمة المرور بأيقونة العين */}
                                <Pressable
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="p-2">
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
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

                        {/* زر نسيان كلمة السر */}
                        <View className="mt-3 flex-row-reverse justify-start">
                            <Pressable
                                onPress={() =>
                                    router.push("/(auth)/forget-password" as any)
                                }>
                                <Text className="font-sans-bold text-xs text-primary dark:text-green-400">
                                    نسيان كلمة السر؟
                                </Text>
                            </Pressable>
                        </View>

                        {/* زر تسجيل الدخول */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleLogin}
                            className={`mt-6 h-14 w-full items-center justify-center rounded-2xl bg-main shadow-md ${
                                isPending ? "opacity-70" : ""
                            }`}>
                            {isPending ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />
                            ) : (
                                <Text className="font-sans-bold text-base text-white">
                                    تسجيل الدخول
                                </Text>
                            )}
                        </Pressable>

                        {/* فاصل وتوقيع إنشاء حساب جديد */}
                        <View className="mt-8 pt-6 border-t border-border dark:border-slate-700/80 items-center">
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                ليس لديك حساب بعد؟
                            </Text>

                            {/* زر تسجيل حساب جديد بارز للمستخدمين الجدد */}
                            <Pressable
                                onPress={() =>
                                    router.push("/(auth)/register" as any)
                                }
                                className="mt-3 h-13 w-full items-center justify-center rounded-2xl border-2 border-main bg-transparent py-2">
                                <Text className="font-sans-bold text-sm text-main dark:text-green-400">
                                    تسجيل حساب جديد
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
