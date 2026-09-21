import {Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {styled} from "nativewind";
import React, {useState} from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

import AuthHeader from "@/components/shared/AuthHeader";
import {useResendOtp} from "@/hooks/auth/useResendOtp";
import {useVerifyResetCode} from "@/hooks/auth/useVerifyResetCode";
import {toast} from "@/lib/toast";
import {useThemeStore} from "@/store/theme.store";

const SafeAreaView = styled(RNSafeAreaView);

const VerifyResetCodeScreen = () => {
    const router = useRouter();
    // اخد رقم الهاتف الذي مرر من الشاشة السابقة
    const {phone_number} = useLocalSearchParams<{phone_number?: string}>();
    const {isDark} = useThemeStore();
    // hooks
    const {mutate: verifyMutate, isPending} = useVerifyResetCode();
    const {mutate: resendMutate, isPending: isResending} = useResendOtp();

    const [resetCode, setResetCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleVerify = () => {
        setError(null);
        const cleaned = resetCode.trim();

        if (!cleaned) {
            setError("يرجى إدخال رمز التعيين");
            toast.error("يرجى إدخال رمز التعيين");
            return;
        }

        verifyMutate(
            {
                phone_number: phone_number || "",
                resetCode: cleaned,
            },
            {
                onSuccess: () => {
                    router.push({
                        pathname: "/(auth)/reset-password",
                        params: {
                            phone_number: phone_number,
                            resetCode: cleaned,
                        },
                    } as any);
                },
            },
        );
    };

    const handleResend = () => {
        resendMutate({phone_number: phone_number || ""});
    };

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Keyboard.dismiss}>
                {/* الهيدر العلوي المزخرف بالشعار */}
                <AuthHeader title="رمز إعادة التعيين" />

                {/* كارت الفورم */}
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
                            style={{textAlign: "right"}}>
                            تأكيد رمز إعادة التعيين
                        </Text>

                        {/* رقم الهاتف يُعرض للمستخدم دون إعادة إدخال */}
                        <View
                            className={`mt-4 flex-row-reverse items-center gap-3 rounded-2xl border px-4 py-3 ${
                                isDark
                                    ? "border-slate-700 bg-slate-900/60"
                                    : "border-slate-200 bg-slate-50"
                            }`}>
                            <View className="size-9 items-center justify-center rounded-xl bg-main/10">
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={18}
                                    color="#10b981"
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                                    style={{textAlign: "right"}}>
                                    تم إرسال الرمز إلى
                                </Text>
                                <Text
                                    className={`font-sans-bold text-base ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{textAlign: "right"}}>
                                    {phone_number || "—"}
                                </Text>
                            </View>
                        </View>

                        {/* حقل الرمز */}
                        <View className="mt-5">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{textAlign: "right"}}>
                                رمز إعادة التعيين
                            </Text>
                            <View
                                className={`h-16 w-full flex-row items-center justify-center rounded-2xl border px-4 ${
                                    error
                                        ? "border-red-500 bg-red-50/20"
                                        : isDark
                                          ? "border-slate-700 bg-slate-900/60"
                                          : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={resetCode}
                                    onChangeText={setResetCode}
                                    placeholder="• • • • • •"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    style={{ textAlign: "center" }}
                                    className={`w-full font-sans-bold text-xl h-16 mt-3 tracking-widest ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                />
                            </View>
                            {error ? (
                                <Text
                                    className="mt-1 font-sans-medium text-xs text-red-500"
                                    style={{textAlign: "right"}}>
                                    {error}
                                </Text>
                            ) : null}
                        </View>

                        {/* زر التأكيد */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleVerify}
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
                                    تأكيد الرمز
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
                                className={`h-12 w-full items-center justify-center rounded-2xl border-2 border-main bg-transparent ${
                                    isResending ? "opacity-60" : ""
                                }`}>
                                {isResending ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#10b981"
                                    />
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

export default VerifyResetCodeScreen;
