import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
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
import {useForgetPassword} from "@/hooks/auth/useForgetPassword";
import {toast} from "@/lib/toast";
import {useThemeStore} from "@/store/theme.store";

const SafeAreaView = styled(RNSafeAreaView);

const ForgetPasswordScreen = () => {
    const router = useRouter();
    const {isDark} = useThemeStore();
    const {mutate: forgetPasswordMutate, isPending} = useForgetPassword();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState<string | null>(null);

    // submit
    const handleSubmit = () => {
        setError(null);
        const cleaned = phoneNumber.trim();

        if (!cleaned) {
            setError("يرجى إدخال رقم الهاتف");
            toast.error("يرجى إدخال رقم الهاتف");
            return;
        }

        if (!/^[0-9]{9,15}$/.test(cleaned)) {
            setError("يرجى إدخال رقم هاتف صحيح");
            toast.error("رقم الهاتف غير صحيح");
            return;
        }

        forgetPasswordMutate(
            {phone_number: cleaned},
            {
                onSuccess: () => {
                    router.push({
                        pathname: "/(auth)/verify-reset-code",
                        params: {phone_number: cleaned},
                    } as any);
                },
            },
        );
    };

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Keyboard.dismiss}>
                {/* الهيدر العلوي المزخرف بالشعار */}
                <AuthHeader title="نسيان كلمة السر" />

                {/* كارت الفورم */}
                <SafeAreaView className="flex-1 px-6 -mt-8 pb-50">
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
                            نسيت كلمة السر؟
                        </Text>

                        <Text
                            className="mt-2 font-sans-medium text-sm leading-6 text-muted-foreground dark:text-slate-400"
                            style={{textAlign: "right"}}>
                            أدخل رقم هاتفك المسجل وسنرسل لك رمز إعادة تعيين كلمة
                            السر
                        </Text>

                        {/* أيقونة توضيحية */}
                        <View className="my-6 items-center">
                            <View className="size-20 items-center justify-center rounded-full bg-main/10 border-2 border-main/20">
                                <Ionicons
                                    name="lock-open-outline"
                                    size={38}
                                    color="#10b981"
                                />
                            </View>
                        </View>

                        {/* حقل رقم الهاتف */}
                        <View>
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{textAlign: "right"}}>
                                رقم الهاتف
                            </Text>
                            <View
                                className={`h-14 w-full flex-row-reverse items-center rounded-2xl border px-4 ${
                                    error
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
                                    style={{textAlign: "right"}}
                                />
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={20}
                                    color={isDark ? "#64748b" : "#94a3b8"}
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

                        {/* زر الإرسال */}
                        <Pressable
                            disabled={isPending}
                            onPress={handleSubmit}
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
                                    إرسال رمز التحقق
                                </Text>
                            )}
                        </Pressable>

                        {/* العودة لتسجيل الدخول */}
                        <View className="mt-6 pt-5 border-t border-border dark:border-slate-700/80 items-center">
                            <Pressable
                                onPress={() => router.back()}
                                className="flex-row-reverse items-center gap-2">
                                <Ionicons
                                    name="arrow-back-outline"
                                    size={16}
                                    color={isDark ? "#94a3b8" : "#64748b"}
                                />
                                <Text className="font-sans-bold text-sm text-muted-foreground dark:text-slate-400">
                                    العودة لتسجيل الدخول
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

export default ForgetPasswordScreen;
