import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/store/theme.store";
import { NotificationFilter } from "@/types/notifications.type";
import { useRouter } from "expo-router";

interface NotificationEmptyStateProps {
    filter: NotificationFilter;
    onResetFilter?: () => void;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
    filter,
    onResetFilter,
}) => {
    const { isDark } = useThemeStore();
    const router = useRouter();

    const getEmptyContent = () => {
        switch (filter) {
            case "unread":
                return {
                    title: "لا توجد إشعارات غير مقروءة",
                    subtitle: "لقد قرأت جميع الإشعارات السابقة، يمكنك الاطلاع على كافة التنبيهات من قسم الكل.",
                    icon: "checkmark-done-circle-outline" as const,
                };
            case "appointment":
                return {
                    title: "لا توجد إشعارات مواعيد",
                    subtitle: "ستظهر هنا جميع التنبيهات والتذكيرات المتعلقة بمواعيدك وحجوزاتك الطبية.",
                    icon: "calendar-outline" as const,
                };
            case "system":
                return {
                    title: "لا توجد تنبيهات نظام",
                    subtitle: "لا توجد أي إعلانات أو تحديثات نظام حالياً.",
                    icon: "notifications-outline" as const,
                };
            case "all":
            default:
                return {
                    title: "لا توجد إشعارات حالياً",
                    subtitle: "كل شيء هادئ هنا! ستتلقى تنبيهات فورية عند تأكيد حجوزاتك، نتائج الفحوصات، أو أي عروض طبية جديدة.",
                    icon: "notifications-off-outline" as const,
                };
        }
    };

    const content = getEmptyContent();

    return (
        <View
            className={`mt-6 items-center justify-center rounded-3xl border p-8 ${
                isDark
                    ? "border-slate-800 bg-slate-800/40"
                    : "border-slate-100 bg-white shadow-xs"
            }`}>
            {/* Animated-like Icon Circle with double layered rings */}
            <View className="relative mb-5 items-center justify-center">
                <View className="size-24 rounded-full bg-main/10 border border-main/20 items-center justify-center">
                    <View className="size-16 rounded-full bg-main/20 items-center justify-center">
                        <Ionicons
                            name={content.icon}
                            size={32}
                            color="#10b981"
                        />
                    </View>
                </View>
                <View className="absolute -bottom-1 -right-1 size-7 rounded-full bg-emerald-500 items-center justify-center border-2 border-background dark:border-slate-900">
                    <Ionicons name="sparkles" size={14} color="#ffffff" />
                </View>
            </View>

            {/* Title */}
            <Text
                className={`text-center font-sans-bold text-lg ${
                    isDark ? "text-slate-100" : "text-slate-800"
                }`}>
                {content.title}
            </Text>

            {/* Subtitle */}
            <Text className="mt-2 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 max-w-xs leading-5">
                {content.subtitle}
            </Text>

            {/* Action buttons */}
            {filter !== "all" && onResetFilter ? (
                <Pressable
                    onPress={onResetFilter}
                    className="mt-6 rounded-2xl bg-main/10 border border-main/30 px-5 py-2.5 active:bg-main/20">
                    <Text className="font-sans-bold text-xs text-main">
                        عرض جميع الإشعارات
                    </Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => router.push("/(tabs)/doctors" as any)}
                    className="mt-6 rounded-2xl bg-main px-6 py-3 shadow-sm active:opacity-80">
                    <Text className="font-sans-bold text-xs text-white">
                        تصفح الأطباء والخدمات
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

export default NotificationEmptyState;
