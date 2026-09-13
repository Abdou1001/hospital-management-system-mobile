import {useThemeStore} from "@/store/theme.store";
import {AppNotification, NotificationType} from "@/types/notifications.type";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React, {memo} from "react";
import {Pressable, Text, View} from "react-native";

interface NotificationCardProps {
    notification: AppNotification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

interface TypeStyleConfig {
    iconName: keyof typeof Ionicons.glyphMap;
    bgColorLight: string;
    bgColorDark: string;
    iconColorLight: string;
    iconColorDark: string;
    badgeLabel: string;
    badgeColor: string;
}

const TYPE_CONFIGS: Record<NotificationType, TypeStyleConfig> = {
    appointment: {
        iconName: "calendar",
        bgColorLight: "bg-emerald-50",
        bgColorDark: "bg-emerald-900/60",
        iconColorLight: "#10b981",
        iconColorDark: "#34d399",
        badgeLabel: "موعد",
        badgeColor: `text-emerald-600 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/40`,
    },
    reminder: {
        iconName: "alarm",
        bgColorLight: "bg-blue-50",
        bgColorDark: "bg-blue-900/60",
        iconColorLight: "#3b82f6",
        iconColorDark: "#60a5fa",
        badgeLabel: "تذكير",
        badgeColor:
            "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/40",
    },
    system: {
        iconName: "notifications",
        bgColorLight: "bg-amber-50",
        bgColorDark: "bg-amber-900/60",
        iconColorLight: "#f59e0b",
        iconColorDark: "#fbbf24",
        badgeLabel: "تنبيه",
        badgeColor:
            "text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/40",
    },
    ad: {
        iconName: "megaphone",
        bgColorLight: "bg-indigo-50",
        bgColorDark: "bg-indigo-900/60",
        iconColorLight: "#6366f1",
        iconColorDark: "#818cf8",
        badgeLabel: "إعلان",
        badgeColor:
            "text-indigo-600 dark:text-indigo-400 bg-indigo-100/50 dark:bg-indigo-900/40",
    },
    discovery: {
        iconName: "compass",
        bgColorLight: "bg-cyan-50",
        bgColorDark: "bg-cyan-900/60",
        iconColorLight: "#06b6d4",
        iconColorDark: "#22d3ee",
        badgeLabel: "استكشاف",
        badgeColor:
            "text-cyan-600 dark:text-cyan-400 bg-cyan-100/70 dark:bg-cyan-900/40",
    },
};

function formatArabicTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "الآن";
        if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays === 1) return "أمس";
        if (diffDays < 7) return `منذ ${diffDays} أيام`;

        return date.toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "short",
        });
    } catch {
        return "";
    }
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
}) => {
    const {isDark} = useThemeStore();
    const router = useRouter();
    const config = TYPE_CONFIGS[notification.type] || TYPE_CONFIGS.system;
    const timeFormatted = formatArabicTime(notification.created_at);

    const handlePress = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }

        // Navigate to related resource if available
        if (notification.data?.doctor_id) {
            router.push(`/doctor/${notification.data.doctor_id}` as any);
        } else if (notification.data?.appointment_id) {
            router.push("/(tabs)/appointments" as any);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            className={`mb-3.5 rounded-3xl border p-4 transition-all active:scale-[0.99] ${
                !notification.is_read
                    ? isDark
                        ? "border-main/30 bg-slate-800/95 shadow-md shadow-emerald-950/20"
                        : "border-main/20 bg-emerald-50/30 shadow-sm"
                    : isDark
                      ? "border-slate-800/80 bg-slate-800/50"
                      : "border-slate-100 bg-white shadow-xs"
            }`}>
            <View className="flex-row-reverse items-start gap-3.5">
                {/* Type Icon Badge */}
                <View
                    className={`size-12 rounded-2xl flex-col  items-center justify-center shrink-0 ${
                        isDark ? config.bgColorDark : config.bgColorLight
                    }`}>
                    <Ionicons
                        name={config.iconName}
                        size={22}
                        color={
                            isDark
                                ? config.iconColorDark
                                : config.iconColorLight
                        }
                    />
                </View>

                {/* Content Area */}
                <View className="flex-1">
                    {/* Header Row: Type Badge + Time + Unread indicator */}
                    <View className="flex-row-reverse items-center justify-between mb-1.5">
                        <View className="flex-row-reverse items-center gap-2">
                            <View
                                className={`rounded-full px-2.5 py-0.5 ${config.badgeColor}`}>
                                <Text
                                    className={`font-sans-bold text-[10px] ${isDark ? "text-white" : "text-primary"}`}>
                                    {config.badgeLabel}
                                </Text>
                            </View>

                            {!notification.is_read && (
                                <View className="flex-row items-center gap-1">
                                    <View className="size-1.5 rounded-full bg-main" />
                                    <Text className="font-sans-bold text-[9px] text-main">
                                        جديد
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text className="font-sans-medium text-[11px] text-muted-foreground dark:text-slate-400">
                            {timeFormatted}
                        </Text>
                    </View>

                    {/* Notification Title */}
                    <Text
                        className={`text-right font-sans-bold text-sm leading-6 mb-2 ${
                            !notification.is_read
                                ? isDark
                                    ? "text-white"
                                    : "text-slate-900"
                                : isDark
                                  ? "text-slate-300"
                                  : "text-slate-700"
                        }`}>
                        {notification.title}
                    </Text>

                    {/* Notification Message */}
                    <Text
                        className={`mt-1 text-right font-sans-medium text-xs leading-8 ${
                            isDark ? "text-slate-300" : "text-slate-600"
                        }`}>
                        {notification.message}
                    </Text>

                    {/* Card Actions Footer */}
                    <View className="mt-3 pt-2.5 border-t border-border/40 dark:border-slate-700/50 flex-row-reverse items-center justify-between">
                        {/* Action Link (if relevant) */}
                        {notification.data?.appointment_id ||
                        notification.data?.doctor_id ? (
                            <View className="flex-row-reverse items-center gap-1">
                                <Text className="font-sans-bold text-xs text-main">
                                    عرض التفاصيل
                                </Text>
                                <Ionicons
                                    name="arrow-back"
                                    size={12}
                                    color="#10b981"
                                />
                            </View>
                        ) : (
                            <View />
                        )}

                        {/* Control Buttons */}
                        <View className="flex-row items-center gap-2">
                            {!notification.is_read && (
                                <Pressable
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification.id);
                                    }}
                                    hitSlop={{
                                        top: 8,
                                        bottom: 8,
                                        left: 8,
                                        right: 8,
                                    }}
                                    className={`flex-row items-center gap-1 rounded-xl px-2.5 py-1 ${
                                        isDark
                                            ? "bg-slate-700/60 active:bg-slate-700"
                                            : "bg-slate-100 active:bg-slate-200"
                                    }`}>
                                    <Ionicons
                                        name="checkmark-done"
                                        size={13}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                    <Text className="font-sans-medium text-[11px] text-muted-foreground dark:text-slate-300">
                                        مقروء
                                    </Text>
                                </Pressable>
                            )}

                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onDelete(notification.id);
                                }}
                                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                                className={`rounded-xl p-1.5 ${
                                    isDark
                                        ? "hover:bg-red-500/10 active:bg-red-500/20"
                                        : "hover:bg-red-50 active:bg-red-100"
                                }`}>
                                <Ionicons
                                    name="trash-outline"
                                    size={14}
                                    color="#ef4444"
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default memo(NotificationCard);
