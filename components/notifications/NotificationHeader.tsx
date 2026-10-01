import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme.store";

interface NotificationHeaderProps {
    unreadCount: number;
    totalCount: number;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    isMarkingAll?: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
    unreadCount,
    totalCount,
    onMarkAllAsRead,
    onClearAll,
    isMarkingAll = false,
}) => {
    const router = useRouter();
    const { isDark } = useThemeStore();

    const handleConfirmClearAll = () => {
        Alert.alert(
            "مسح جميع الإشعارات",
            "هل أنت متأكد من رغبتك في حذف كافة الإشعارات من القائمة؟",
            [
                { text: "إلغاء", style: "cancel" },
                {
                    text: "نعم، مسح الكل",
                    style: "destructive",
                    onPress: onClearAll,
                },
            ]
        );
    };

    return (
        <View className="mb-4">
            {/* Top Navigation Row: Left = Back Button, Right = Page Title & Badge */}
            <View className="flex-row items-center justify-between">
                {/* Left Side: Back Arrow Button */}
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className={`size-11 items-center justify-center rounded-2xl border ${
                        isDark
                            ? "border-slate-800 bg-slate-800/80 active:bg-slate-700"
                            : "border-slate-200/80 bg-white/80 shadow-xs active:bg-slate-100"
                    }`}>
                    <Ionicons
                        name="chevron-back"
                        size={22}
                        color={isDark ? "#ffffff" : "#081126"}
                    />
                </Pressable>

                {/* Right Side: Title and unread pill */}
                <View className="items-end">
                    <View className="flex-row-reverse items-center gap-2">
                        <Text
                            className={`font-sans-bold text-2xl ${
                                isDark ? "text-white" : "text-primary"
                            }`}>
                            الإشعارات
                        </Text>

                        {unreadCount > 0 && (
                            <View className="rounded-full bg-main px-2 py-1 shadow-xs mb-1">
                                <Text className="font-sans-bold text-xs text-white mt-0.5">
                                    {unreadCount} جديدة
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        سجل التنبيهات والتحديثات الطبية
                    </Text>
                </View>
            </View>

            {/* Quick Action Buttons Row (Mark all as read & Clear all) */}
            {totalCount > 0 && (
                <View className="mt-3.5 flex-row-reverse items-center justify-between border-t border-gray-400/50 dark:border-slate-800 pt-5 mb-1">
                    <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                        إجمالي {totalCount} إشعار
                    </Text>

                    <View className="flex-row items-center gap-2">
                        {unreadCount > 0 && (
                            <Pressable
                                onPress={onMarkAllAsRead}
                                disabled={isMarkingAll}
                                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                className={`flex-row items-center gap-1.5 rounded-xl px-3 py-1.5 border text-xs ${
                                    isDark
                                        ? "border-emerald-500/30 bg-emerald-950/40 active:bg-emerald-900/60"
                                        : "border-emerald-200 bg-emerald-50 active:bg-emerald-100"
                                }`}>
                                <Ionicons
                                    name="checkmark-done"
                                    size={14}
                                    color="#10b981"
                                />
                                <Text className="font-sans-bold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    قراءة الكل
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            onPress={handleConfirmClearAll}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            className={`flex-row items-center gap-1 rounded-xl px-2.5 py-1.5 border ${
                                isDark
                                    ? "border-slate-800 bg-slate-800/80 active:bg-slate-700"
                                    : "border-slate-200 bg-white active:bg-slate-100"
                            }`}>
                            <Ionicons
                                name="trash-outline"
                                size={14}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                                مسح الكل
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};

export default NotificationHeader;
