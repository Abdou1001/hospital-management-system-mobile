import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToastStore, ToastMessage } from "@/store/toast.store";

const ToastItem = ({ item }: { item: ToastMessage }) => {
    const hideToast = useToastStore((state) => state.hideToast);

    const getBgColor = () => {
        switch (item.type) {
            case "success":
                return "bg-emerald-600 border-emerald-500";
            case "error":
                return "bg-rose-600 border-rose-500";
            case "warning":
                return "bg-amber-600 border-amber-500";
            default:
                return "bg-blue-600 border-blue-500";
        }
    };

    const getIcon = () => {
        switch (item.type) {
            case "success":
                return "✓";
            case "error":
                return "⚠️";
            case "warning":
                return "⚡";
            default:
                return "ℹ️";
        }
    };

    return (
        <Pressable
            onPress={() => hideToast(item.id)}
            className={`my-1 flex-row-reverse items-center justify-between rounded-2xl border px-4 py-3.5 shadow-xl ${getBgColor()}`}>
            <View className="flex-1 flex-row-reverse items-center gap-2.5">
                <Text className="text-base text-white">{getIcon()}</Text>
                <Text className="flex-1 text-right font-sans-semibold text-sm leading-5 text-white">
                    {item.message}
                </Text>
            </View>
            <Text className="mr-2 text-xs font-sans-bold text-white/70">✕</Text>
        </Pressable>
    );
};

export const ToastContainer = () => {
    const toasts = useToastStore((state) => state.toasts);

    if (!toasts.length) return null;

    return (
        <SafeAreaView
            pointerEvents="box-none"
            className="absolute left-0 right-0 top-0 z-[9999] px-4 pt-2">
            {toasts.map((item) => (
                <ToastItem key={item.id} item={item} />
            ))}
        </SafeAreaView>
    );
};

export default ToastContainer;
