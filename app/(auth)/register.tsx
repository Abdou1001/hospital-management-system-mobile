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
import DatePickerInput from "@/components/ui/DatePickerInput";
import { useRegister } from "@/hooks/auth/useRegister";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";
import { registerSchema } from "@/validation/auth/schemas/register.schema";

const SafeAreaView = styled(RNSafeAreaView);

const RegisterScreen = () => {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const { mutate: registerMutate, isPending } = useRegister();

    // حالة المدخلات
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState<"ذكر" | "أنثى">("ذكر");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // إظهار/إخفاء كلمة المرور
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // الأخطاء
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleRegister = () => {
        setErrors({});

        // تحضير البيانات المطلوبة
        const payload = {
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            email: email.trim(),
            date_of_birth: dateOfBirth.trim(),
            gender: gender,
            password: password,
            confirmPassword: confirmPassword,
        };

        // التحقق باستخدام Zod schema
        const validation = registerSchema.safeParse(payload);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const newErrors: Record<string, string> = {};

            Object.keys(fieldErrors).forEach((key) => {
                const msg = fieldErrors[key as keyof typeof fieldErrors]?.[0];
                if (msg) newErrors[key] = msg;
            });

            setErrors(newErrors);

            const firstMsg = Object.values(newErrors)[0];
            toast.error(firstMsg || "يرجى التأكد من ملء كافة البيانات بشكل صحيح");
            return;
        }

        // إرسال البيانات للباك إند بالبنية المطلوبة وبدون تغيير gender
        const requestData = {
            full_name: payload.full_name,
            email: payload.email,
            password: payload.password,
            confirmPassword: payload.confirmPassword,
            date_of_birth: payload.date_of_birth,
            gender: payload.gender,
            phone_number: payload.phone_number,
        };

        console.log("Sending Register Payload:", requestData);

        registerMutate(requestData, {
            onSuccess: () => {
                // الانتقال إلى صفحة تأكيد رقم الهاتف مع تمرير رقم الهاتف
                router.push({
                    pathname: "/(auth)/verify-phone",
                    params: { phone_number: payload.phone_number },
                } as any);
            },
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
                <AuthHeader />

                {/* كارت فورم إنشاء الحساب */}
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
                            إنشاء حساب جديد
                        </Text>

                        <Text
                            className="mt-1.5 font-sans-medium text-sm text-muted-foreground dark:text-slate-400"
                            style={{ textAlign: "right" }}>
                            يرجى أدخال البيانات التالية لإنشاء حسابك
                        </Text>

                        {/* حقل 1: الاسم الكامل */}
                        <View className="mt-5">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                الاسم الكامل (الاسم الرباعي)
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.full_name
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="أدخل الاسم الكامل"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                            </View>
                            {errors.full_name ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.full_name}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل 2: رقم الهاتف */}
                        <View className="mt-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                رقم الهاتف
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.phone_number
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder="7xxxxxxxx"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    keyboardType="phone-pad"
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                            </View>
                            {errors.phone_number ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.phone_number}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل 3: البريد الإلكتروني (اختياري) */}
                        <View className="mt-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                البريد الإلكتروني (اختياري)
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.email
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="example@domain.com"
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
                            </View>
                            {errors.email ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{ textAlign: "right" }}>
                                    {errors.email}
                                </Text>
                            ) : null}
                        </View>

                        {/* حقل 4: تاريخ الميلاد والنوع (في صف واحد) */}
                        <View className="mt-4 flex-row-reverse space-x-3 space-x-reverse justify-between items-start">
                            {/* تاريخ الميلاد */}
                            <View className="flex-1">
                                <DatePickerInput
                                    label="تاريخ الميلاد"
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    placeholder="اختر التاريخ"
                                    error={errors.date_of_birth}
                                />
                            </View>

                            {/* النوع */}
                            <View className="flex-1">
                                <Text
                                    className={`mb-2 font-sans-bold text-sm ${
                                        isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                    style={{ textAlign: "right" }}>
                                    النوع
                                </Text>
                                <View className="h-14 w-full flex-row rounded-2xl bg-slate-100 dark:bg-slate-900/60 p-1 border border-slate-200 dark:border-slate-700">
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
                                {errors.gender ? (
                                    <Text
                                        className="mt-1 font-sans-medium text-xs text-red-500"
                                        style={{ textAlign: "right" }}>
                                        {errors.gender}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {/* حقل 5: كلمة المرور */}
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

                        {/* حقل 6: تأكيد كلمة المرور */}
                        <View className="mt-4">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{ textAlign: "right" }}>
                                تأكيد كلمة المرور
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    errors.confirmPassword
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    secureTextEntry={!showConfirmPassword}
                                    className={`flex-1 font-sans-medium text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{ textAlign: "right" }}
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="p-2">
                                    <Ionicons
                                        name={
                                            showConfirmPassword
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
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

                        {/* زر إنشاء حساب جديد */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleRegister}
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
                                    إنشاء حساب جديد
                                </Text>
                            )}
                        </Pressable>

                        {/* فاصل والعودة لتسجيل الدخول */}
                        <View className="mt-6 pt-5 border-t border-border dark:border-slate-700/80 items-center">
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                لديك حساب بالفعل؟
                            </Text>

                            <Pressable
                                onPress={() => router.push("/(auth)/login" as any)}
                                className="mt-3 h-13 w-full items-center justify-center rounded-2xl border-2 border-main bg-transparent py-3.5">
                                <Text className="font-sans-bold text-sm text-main dark:text-green-400">
                                    تسجيل الدخول
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

export default RegisterScreen;