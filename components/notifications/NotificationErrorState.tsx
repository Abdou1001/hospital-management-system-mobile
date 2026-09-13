import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/store/theme.store";

interface NotificationErrorStateProps {
    onRetry: () => void;
    isRetrying?: boolean;
    errorMessage?: string;
}

const NotificationErrorState: React.FC<NotificationErrorStateProps> = ({
    onRetry,
    isRetrying = false,
    errorMessage,
}) => {
    const { isDark } = useThemeStore();

    return (
        <View
            className={`mt-6 items-center justify-center rounded-3xl border p-8 ${
                isDark
                    ? "border-red-500/20 bg-red-950/20"
                    : "border-red-200 bg-red-50/50"
            }`}>
            {/* Error Icon */}
            <View className="size-20 rounded-full bg-red-500/10 border-2 border-red-500/20 items-center justify-center mb-4">
                <Ionicons
                    name="alert-circle-outline"
                    size={38}
                    color="#ef4444"
                />
            </View>

            {/* Error Title */}
            <Text className="text-center font-sans-bold text-lg text-red-500">
                تعذر تحميل الإشعارات
            </Text>

            {/* Error Message */}
            <Text className="mt-2 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 max-w-xs leading-5">
                {errorMessage ||
                    "حدث خطأ أثناء جلب قائمة الإشعارات من الخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة."}
            </Text>

            {/* Retry Button */}
            <Pressable
                onPress={onRetry}
                disabled={isRetrying}
                className="mt-6 flex-row items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 active:bg-red-600">
                {isRetrying ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Ionicons name="refresh-outline" size={18} color="#ffffff" />
                )}
                <Text className="font-sans-bold text-xs text-white">
                    {isRetrying ? "جارٍ المحاولة..." : "إعادة المحاولة"}
                </Text>
            </Pressable>
        </View>
    );
};

export default NotificationErrorState;
