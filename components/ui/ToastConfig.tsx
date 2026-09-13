import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { useThemeStore } from "@/store/theme.store";

export type CustomToastType = "success" | "error" | "warning" | "info";

interface ToastStyleConfig {
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgLight: string;
    iconBgDark: string;
    borderColorLight: string;
    borderColorDark: string;
    indicatorColor: string;
}

const TOAST_STYLES: Record<CustomToastType, ToastStyleConfig> = {
    success: {
        iconName: "checkmark-circle",
        iconColor: "#10b981",
        iconBgLight: "bg-emerald-50",
        iconBgDark: "bg-emerald-950/40",
        borderColorLight: "border-emerald-500/30",
        borderColorDark: "border-emerald-500/40",
        indicatorColor: "#10b981",
    },
    error: {
        iconName: "alert-circle",
        iconColor: "#f43f5e",
        iconBgLight: "bg-rose-50",
        iconBgDark: "bg-rose-950/40",
        borderColorLight: "border-rose-500/30",
        borderColorDark: "border-rose-500/40",
        indicatorColor: "#f43f5e",
    },
    warning: {
        iconName: "warning",
        iconColor: "#f59e0b",
        iconBgLight: "bg-amber-50",
        iconBgDark: "bg-amber-950/40",
        borderColorLight: "border-amber-500/30",
        borderColorDark: "border-amber-500/40",
        indicatorColor: "#f59e0b",
    },
    info: {
        iconName: "information-circle",
        iconColor: "#0284c7",
        iconBgLight: "bg-sky-50",
        iconBgDark: "bg-sky-950/40",
        borderColorLight: "border-sky-500/30",
        borderColorDark: "border-sky-500/40",
        indicatorColor: "#0284c7",
    },
};

interface CustomToastProps extends ToastConfigParams<Record<string, unknown>> {
    type: CustomToastType;
}

export const CustomToast = ({
    text1,
    text2,
    onPress,
    hide,
    type,
}: CustomToastProps) => {
    const { isDark } = useThemeStore();
    const styleConfig = TOAST_STYLES[type] || TOAST_STYLES.info;

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            hide();
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={{
                elevation: 10,
                shadowColor: isDark ? "#000000" : styleConfig.indicatorColor,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.4 : 0.15,
                shadowRadius: 12,
            }}
            className={`w-[92%] max-w-[420px] self-center my-2 flex-row-reverse items-center justify-between rounded-2xl border p-3.5 ${
                isDark
                    ? `bg-slate-900/95 ${styleConfig.borderColorDark}`
                    : `bg-white/98 ${styleConfig.borderColorLight}`
            }`}>
            {/* Right side colored accent line */}
            <View
                style={{ backgroundColor: styleConfig.indicatorColor }}
                className="absolute right-0 top-3 bottom-3 w-1 rounded-l-full"
            />

            {/* Content Container (RTL: Icon on right, Text next to it) */}
            <View className="flex-1 flex-row-reverse items-center gap-3 pr-2">
                {/* Icon Badge */}
                <View
                    className={`w-10 h-10 rounded-xl items-center justify-center shrink-0 ${
                        isDark ? styleConfig.iconBgDark : styleConfig.iconBgLight
                    }`}>
                    <Ionicons
                        name={styleConfig.iconName}
                        size={22}
                        color={styleConfig.iconColor}
                    />
                </View>

                {/* Text Details */}
                <View className="flex-1 justify-center">
                    {text1 ? (
                        <Text
                            className={`font-sans-bold text-sm leading-5 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                            style={{ textAlign: "right" }}>
                            {text1}
                        </Text>
                    ) : null}
                    {text2 ? (
                        <Text
                            className={`font-sans-medium text-xs leading-8 mt-0.5 ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                            style={{ textAlign: "right" }}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>

            {/* Close Button on left */}
            <Pressable
                onPress={() => hide()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className={`p-1.5 rounded-full ml-1 items-center justify-center ${
                    isDark
                        ? "bg-white/10 active:bg-white/20"
                        : "bg-slate-100 active:bg-slate-200"
                }`}>
                <Ionicons
                    name="close"
                    size={14}
                    color={isDark ? "#94a3b8" : "#64748b"}
                />
            </Pressable>
        </Pressable>
    );
};

export const toastConfig: ToastConfig = {
    success: (props) => <CustomToast {...props} type="success" />,
    error: (props) => <CustomToast {...props} type="error" />,
    warning: (props) => <CustomToast {...props} type="warning" />,
    info: (props) => <CustomToast {...props} type="info" />,
};

export default toastConfig;
