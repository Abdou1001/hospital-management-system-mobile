import { icons } from "@/constants/icons";
import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React from "react";
import { Image } from "react-native";
import {Pressable, Text, View} from "react-native";

interface ReceptionHeaderProps {
    onBack?: () => void;
}

export const ReceptionHeader: React.FC<ReceptionHeaderProps> = ({onBack}) => {
    const router = useRouter();
    const {isDark} = useThemeStore();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.replace("/(tabs)");
        }
    };

    return (
        <View className="pt-3 pb-3 mb-5 border-b border-gray-400/30 dark:border-slate-500/40 flex-row items-center justify-between">
            {/* Left Side: Return to Main User App */}
            <Pressable
                onPress={handleBack}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                className={`flex-row items-center gap-1.5 rounded-2xl px-3 py-2 border ${
                    isDark
                        ? "border-slate-800 bg-slate-800/80 active:bg-slate-750"
                        : "border-slate-200 bg-white/80 shadow-xs active:bg-slate-100"
                }`}>
                <Ionicons
                    name="arrow-back"
                    size={16}
                    color={isDark ? "#94a3b8" : "#64748b"}
                />
                <Text
                    className={`font-sans-bold text-xs ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}>
                    الرئيسية
                </Text>
            </Pressable>

            {/* Right Side: Reception Desk Title */}
            <View className="items-end">
                <View className="flex-row-reverse items-center gap-2">
                    {/* الشعار */}
                    <Image source={icons.logo} className="home-avatar" />
                    <Text
                        className={`font-sans-bold text-lg ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}>
                        نظام الاستقبال
                    </Text>
                </View>
                <Text className="font-sans-medium text-[11px] text-muted-foreground dark:text-slate-400">
                    متابعة وإدارة حجوزات المستشفى
                </Text>
            </View>
        </View>
    );
};

export default ReceptionHeader;
