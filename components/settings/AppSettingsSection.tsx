import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Pressable, Switch, Text, TouchableOpacity, View} from "react-native";

const AppSettingsSection = () => {
    const {isDark, toggleTheme} = useThemeStore();

    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400 text-right mb-3 px-1">
                إعدادات التطبيق
            </Text>

            <View
                className={`w-full rounded-3xl border divide-y divide-border dark:divide-slate-700 shadow-sm ${
                    isDark
                        ? "border-slate-800 bg-slate-800/90"
                        : "border-slate-100 bg-white"
                }`}>
                {/* Dark Mode Switch */}
                <View className="flex-row items-center justify-between p-4">
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{false: "#cbd5e1", true: "#10b981"}}
                        thumbColor="#ffffff"
                    />

                    <Pressable onPress={toggleTheme}>
                        <View className="flex-row-reverse items-center gap-3">
                            <View className="size-10 rounded-xl bg-amber-500/10 items-center justify-center">
                                <Ionicons
                                    name={isDark ? "moon" : "sunny"}
                                    size={20}
                                    color="#f59e0b"
                                />
                            </View>
                            <View className="items-end">
                                <Text
                                    className={`text-base font-sans-bold ${
                                        isDark
                                            ? "text-slate-100"
                                            : "text-slate-900"
                                    }`}>
                                    الوضع الداكن
                                </Text>
                                <Text className="text-xs font-sans-medium text-muted-foreground dark:text-slate-400">
                                    {isDark ? "مفعل" : "معطل"}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </View>

                {/* Notifications Row */}
                <TouchableOpacity className="flex-row-reverse items-center justify-between p-4">
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="size-10 rounded-xl bg-blue-500/10 items-center justify-center">
                            <Ionicons
                                name="notifications-outline"
                                size={20}
                                color="#3b82f6"
                            />
                        </View>
                        <View className="items-end">
                            <Text
                                className={`text-base font-sans-bold ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>
                                الإشعارات
                            </Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground dark:text-slate-400">
                                تنبيهات المواعيد والخدمات
                            </Text>
                        </View>
                    </View>
                    <View className="rounded-full bg-main/10 px-2.5 py-1">
                        <Text className="text-xs font-sans-bold text-main dark:text-emerald-400">
                            مفعلة
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Language Row */}
                <TouchableOpacity className="flex-row-reverse items-center justify-between p-4">
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="size-10 rounded-xl bg-purple-500/10 items-center justify-center">
                            <Ionicons
                                name="globe-outline"
                                size={20}
                                color="#a855f7"
                            />
                        </View>
                        <View className="items-end">
                            <Text
                                className={`text-base font-sans-bold ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>
                                لغة التطبيق
                            </Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground dark:text-slate-400">
                                العربية
                            </Text>
                        </View>
                    </View>
                    <Ionicons
                        name="chevron-back-outline"
                        size={18}
                        color={isDark ? "#64748b" : "#94a3b8"}
                    />
                </TouchableOpacity>

                {/* App Version */}
                <View className="flex-row-reverse items-center justify-between p-4">
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="size-10 rounded-xl bg-slate-500/10 items-center justify-center">
                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color="#64748b"
                            />
                        </View>
                        <View className="items-end">
                            <Text
                                className={`text-base font-sans-bold ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>
                                إصدار التطبيق
                            </Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground dark:text-slate-400">
                                Version 1.0.0
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AppSettingsSection;
