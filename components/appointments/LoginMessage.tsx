import { useTheme } from "@/store/theme.store";
import {useRouter} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";

const LoginMessage = () => {
    const router = useRouter();
    const {isDark} = useTheme()

    const handleLogin = () => {
        router.push("/(auth)/login");
    };

    return (
        <View
            className={`mt-8 items-center justify-center rounded-3xl border  px-6 py-8 ${isDark ? "border-slate-700/60 bg-slate-800" : "border-border bg-card"}`}>
            {/* الرسالة */}
            <Text
                className={`text-center text-lg font-sans-bold text-primary ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                لابد من تسجيل الدخول لحجز موعد عند طبيب
            </Text>

            {/* وصف إضافي */}
            <Text
                className={`mt-2 text-center text-sm font-sans-medium text-muted-foreground ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                سجل الدخول أولًا حتى تتمكن من حجز موعدك بسهولة
            </Text>

            {/* زر تسجيل الدخول */}
            <Pressable
                onPress={handleLogin}
                className="mt-5 w-full items-center justify-center rounded-xl bg-main py-3.5 active:opacity-80">
                <Text className="text-base font-sans-bold text-background">
                    تسجيل الدخول
                </Text>
            </Pressable>

            {/* زر تسجيل انشاء حساب */}
            <Pressable
                onPress={() => router.push("/(auth)/register")}
                className="mt-5 w-full items-center justify-center rounded-xl border-2 py-3.5 border-main bg-transparent ">
                <Text className="text-base font-sans-bold text-main dark:text-emerald-400">
                    إنشاء حساب جديد
                </Text>
            </Pressable>
        </View>
    );
};

export default LoginMessage;
