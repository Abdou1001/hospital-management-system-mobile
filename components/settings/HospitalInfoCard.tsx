import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useThemeStore } from "@/store/theme.store";

const HospitalInfoCard = () => {
    const { isDark } = useThemeStore();

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`).catch(() => {});
    };

    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-muted-foreground dark:text-slate-400 text-right mb-3 px-1">
                معلومات عن المستشفى
            </Text>

            <View
                className={`w-full rounded-3xl border p-5 shadow-sm ${
                    isDark
                        ? "border-slate-800 bg-slate-800/90"
                        : "border-slate-100 bg-white"
                }`}>
                {/* Hospital Header */}
                <View className="flex-row-reverse items-center gap-3 pb-4 border-b border-border dark:border-slate-700/70">
                    <View className="size-12 rounded-2xl bg-main/15 border border-main/30 items-center justify-center">
                        <Ionicons
                            name="medkit-outline"
                            size={24}
                            color="#10b981"
                        />
                    </View>
                    <View className="flex-1 items-end">
                        <Text
                            className={`font-sans-bold text-base ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                            style={{ textAlign: "right" }}>
                            مستشفى التعاون التخصصي
                        </Text>
                        <Text
                            className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mt-0.5"
                            style={{ textAlign: "right" }}>
                            رعاية طبية متكاملة بأحدث الأجهزة والكوادر
                        </Text>
                    </View>
                </View>

                {/* Info Items */}
                <View className="pt-4 gap-3">
                    {/* Location */}
                    <View className="flex-row-reverse items-center justify-between">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <View className="size-8 rounded-xl bg-blue-500/10 items-center justify-center">
                                <Ionicons
                                    name="location-outline"
                                    size={16}
                                    color="#3b82f6"
                                />
                            </View>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                الموقع:
                            </Text>
                        </View>
                        <Text
                            className={`font-sans-bold text-xs ${
                                isDark ? "text-slate-200" : "text-slate-800"
                            }`}>
                            حضرموت - المكلا - الشارع العام
                        </Text>
                    </View>

                    {/* Working Hours */}
                    <View className="flex-row-reverse items-center justify-between">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <View className="size-8 rounded-xl bg-amber-500/10 items-center justify-center">
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#f59e0b"
                                />
                            </View>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                أوقات العمل:
                            </Text>
                        </View>
                        <View className="rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                            <Text className="font-sans-bold text-[10px] text-emerald-600 dark:text-emerald-400">
                                24 ساعة / طوارئ مستمرة
                            </Text>
                        </View>
                    </View>

                    {/* Emergency Hotline */}
                    <Pressable
                        onPress={() => handleCall("05350105")}
                        className="flex-row-reverse items-center justify-between py-1">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <View className="size-8 rounded-xl bg-red-500/10 items-center justify-center">
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#ef4444"
                                />
                            </View>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                طوارئ المستشفى:
                            </Text>
                        </View>
                        <View className="flex-row-reverse items-center gap-1">
                            <Text className="font-sans-bold text-sm text-red-500">
                                05350105
                            </Text>
                            <Ionicons name="call" size={12} color="#ef4444" />
                        </View>
                    </Pressable>

                    {/* Contact Phone */}
                    <Pressable
                        onPress={() => handleCall("739712162")}
                        className="flex-row-reverse items-center justify-between py-1">
                        <View className="flex-row-reverse items-center gap-2.5">
                            <View className="size-8 rounded-xl bg-emerald-500/10 items-center justify-center">
                                <Ionicons
                                    name="call-outline"
                                    size={16}
                                    color="#10b981"
                                />
                            </View>
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                الاستعلامات والاستقبال:
                            </Text>
                        </View>
                        <View className="flex-row-reverse items-center gap-1">
                            <Text
                                className={`font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-800"
                                }`}>
                                739712162
                            </Text>
                            <Ionicons name="call-outline" size={12} color="#10b981" />
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default HospitalInfoCard;
