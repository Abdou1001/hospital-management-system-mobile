import { ToastMessage, useToastStore } from "@/store/toast.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ToastItem = ({ item }: { item: ToastMessage }) => {
    const hideToast = useToastStore((state) => state.hideToast);

    const getToastStyle = () => {
        switch (item.type) {
            case "success":
                return {
                    bg: "bg-slate-900/95 border-emerald-500/60",
                    iconColor: "#10b981",
                    iconName: "checkmark-circle" as const,
                };
            case "error":
                return {
                    bg: "bg-slate-900/95 border-rose-500/60",
                    iconColor: "#f43f5e",
                    iconName: "alert-circle" as const,
                };
            case "warning":
                return {
                    bg: "bg-slate-900/95 border-amber-500/60",
                    iconColor: "#f59e0b",
                    iconName: "warning" as const,
                };
            default:
                return {
                    bg: "bg-slate-900/95 border-blue-500/60",
                    iconColor: "#3b82f6",
                    iconName: "information-circle" as const,
                };
        }
    };

    const styleInfo = getToastStyle();

    return (
        <Pressable
            onPress={() => hideToast(item.id)}
            style={{ elevation: 12 }}
            className={`my-1 mx-2 flex-row-reverse items-center justify-between rounded-2xl border p-4 shadow-2xl ${styleInfo.bg}`}>
            <View className="flex-1 flex-row-reverse items-center gap-3">
                <Ionicons name={styleInfo.iconName} size={24} color={styleInfo.iconColor} />
                <Text
                    className="flex-1 font-sans-medium text-sm leading-5 text-white"
                    style={{ textAlign: "right" }}>
                    {item.message}
                </Text>
            </View>
            <Pressable
                onPress={() => hideToast(item.id)}
                className="ml-2 p-1.5 rounded-full bg-white/10 active:bg-white/20">
                <Ionicons name="close" size={14} color="#94a3b8" />
            </Pressable>
        </Pressable>
    );
};

export const ToastContainer = () => {
    const toasts = useToastStore((state) => state.toasts);

    if (!toasts.length) return null;

    return (
        <SafeAreaView
            edges={["bottom"]}
            pointerEvents="box-none"
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999999,
                elevation: 999999,
            }}
            className="px-4 pt-2">
            {toasts.map((item) => (
                <ToastItem key={item.id} item={item} />
            ))}
        </SafeAreaView>
    );
};

export default ToastContainer;
