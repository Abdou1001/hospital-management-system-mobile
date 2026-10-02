import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
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
import { useResendOtp } from "@/hooks/auth/useResendOtp";
import { useVerifyPhone } from "@/hooks/auth/useVerifyPhone";
import { toast } from "@/lib/toast";
import { useThemeStore } from "@/store/theme.store";

const SafeAreaView = styled(RNSafeAreaView);

const VerifyPhoneScreen = () => {
    const router = useRouter();
    const { phone_number } = useLocalSearchParams<{ phone_number?: string }>();
    const { isDark } = useThemeStore();
    const { mutate: verifyPhoneMutate, isPending } = useVerifyPhone();
    const { mutate: resendMutate, isPending: isResending } = useResendOtp();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleVerify = () => {
        setError(null);
        const cleanOtp = otp.trim();

        if (!cleanOtp) {
            setError("يرجى إدخال رمز التحقق");
            toast.error("يرجى إدخال رمز التحقق");
            return;
        }

        if (cleanOtp.length < 4) {
            setError("رمز التحقق غير مكتمل");
            toast.error("رمز التحقق غير مكتمل");
            return;
        }

        verifyPhoneMutate(
            {
                phone_number: phone_number || "",
                otp: cleanOtp,
            },
            {
                onSuccess: () => {
                    router.replace("/(tabs)");
                },
            }
        );
    };

    const handleResend = () => {
        resendMutate({ phone_number: phone_number || "" });
    };

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Keyboard.dismiss}>
                {/* الهيدر العلوي المزخرف بالشعار */}
                <AuthHeader title="تأكيد رقم الهاتف" />

                {/* كارت فورم إدخال رمز التأكيد */}
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
                            تأكيد رقم الهاتف
                        </Text>

                        {/* عرض رقم الهاتف تلقائياً بدون إعادة إدخال */}
                        <View
                            className={`mt-4 flex-row-reverse items-center gap-3 rounded-2xl border px-4 py-3 ${isDark
                                    ? "border-slate-700 bg-slate-900/60"
                                    : "border-slate-200 bg-slate-50"
                                }`}>
                            <View className="size-9 items-center justify-center rounded-xl bg-main/10">
                                <Text className="text-lg">📱</Text>
                            </View>
                            <View className="flex-1">
                                <Text
                                    className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                                    style={{ textAlign: "right" }}>
                                    تم إرسال رمز التحقق إلى
                                </Text>
                                <Text
                                    className={`font-sans-bold text-base ${isDark ? "text-white" : "text-slate-900"
                                        }`}
                                    style={{ textAlign: "right" }}>
                                    {phone_number || "—"}
                                </Text>
                            </View>
                        </View>

                        {/* حقل رمز التحقق */}
                        <View className="mt-5">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                style={{ textAlign: "right" }}>
                                رمز التحقق (OTP)
                            </Text>
                            <View
                                className={`h-16 w-full flex-row items-center justify-center rounded-2xl border px-4 ${error
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                            ? "border-slate-700 bg-slate-900/60"
                                            : "border-slate-200 bg-slate-50"
                                    }`}>
                                <TextInput
                                    value={otp}
                                    onChangeText={setOtp}
                                    placeholder="• • • • • •"
                                    placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                                    keyboardType="number-pad"
                                    style={{ textAlign: "center" }}
                                    maxLength={6}
                                    className={`w-full font-sans-bold text-xl h-16  tracking-widest ${isDark ? "text-white" : "text-slate-900"
                                        }`}
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

                        {/* زر التأكيد */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleVerify}
                            className={`mt-6 h-14 w-full items-center justify-center rounded-2xl bg-main shadow-md ${isPending ? "opacity-70" : ""
                                }`}>
                            {isPending ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text className="font-sans-bold text-base text-white">
                                    تأكيد الرقم
                                </Text>
                            )}
                        </Pressable>

                        {/* إعادة إرسال الرمز */}
                        <View className="mt-6 pt-5 border-t border-border dark:border-slate-700/80 items-center gap-3">
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                لم يصلك الرمز؟
                            </Text>
                            <Pressable
                                disabled={isResending}
                                onPress={handleResend}
                                className={`h-12 w-full items-center justify-center rounded-2xl border-2 border-main bg-transparent ${isResending ? "opacity-60" : ""
                                    }`}>
                                {isResending ? (
                                    <ActivityIndicator size="small" color="#10b981" />
                                ) : (
                                    <Text className="font-sans-bold text-sm text-main dark:text-green-400">
                                        إعادة إرسال الرمز
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

export default VerifyPhoneScreen;
