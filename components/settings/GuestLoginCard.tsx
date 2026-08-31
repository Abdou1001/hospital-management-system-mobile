import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useThemeStore } from "@/store/theme.store";

const GuestLoginCard = () => {
    const router = useRouter();
    const { isDark } = useThemeStore();

    return (
        <View
            className={`w-full rounded-3xl border p-5 shadow-sm mb-5 ${
                isDark
                    ? "border-slate-800 bg-slate-800/90"
                    : "border-slate-100 bg-white"
            }`}>
            <View className="flex-row-reverse items-center gap-4">
                <View className="size-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 items-center justify-center">
                    <Ionicons
                        name="person-outline"
                        size={30}
                        color="#f59e0b"
                    />
                </View>

                <View className="flex-1 items-end">
                    <Text
                        className={`font-sans-bold text-lg ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                        style={{ textAlign: "right" }}>
                        أنت تتصفح كزائر
                    </Text>
                    <Text
                        className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mt-1 leading-5"
                        style={{ textAlign: "right" }}>
                        سجل دخولك الآن للوصول إلى كافة الخدمات الطبية ومتابعة حجوزاتك
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row-reverse items-center gap-3 mt-4 pt-3 border-t border-border dark:border-slate-700/70">
                <Pressable
                    onPress={() => router.push("/(auth)/login")}
                    className="flex-1 h-12 rounded-2xl bg-main items-center justify-center shadow-sm">
                    <Text className="font-sans-bold text-sm text-white">
                        تسجيل الدخول
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/(auth)/register")}
                    className="flex-1 h-12 rounded-2xl border-2 border-main bg-transparent items-center justify-center">
                    <Text className="font-sans-bold text-sm text-main dark:text-emerald-400">
                        إنشاء حساب جديد
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default GuestLoginCard;
