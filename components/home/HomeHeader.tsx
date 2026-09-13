import { icons } from "@/constants/icons";
import { useAuth } from "@/hooks/auth/useAuth";
import { useThemeStore } from "@/store/theme.store";
import { useNotificationStore } from "@/store/notification.store";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Icon from "../ui/icons/Icon";

import { Ionicons } from "@expo/vector-icons";

const HomeHeader = () => {
    const { isDark, toggleTheme } = useThemeStore();
    const { isAuthenticated, isLoading, role } = useAuth();
    const router = useRouter();
    const unreadCount = useNotificationStore((state) => state.getUnreadCount());
    const isReception = role === "reception" || role === "admin";

    return (
        <View className="home-header">
            <View className="flex-row gap-1 items-center">
                <Pressable
                    onPress={toggleTheme}
                    className="header-buttons p-2 rounded-full active:opacity-60">
                    <Icon
                        icon={isDark ? icons.sun : icons.moon}
                        size={22}
                        className={isDark ? "text-amber-400" : "text-primary"}
                        color={isDark ? "#f59e0b" : "#081126"}
                    />
                </Pressable>
                <Pressable
                    onPress={() => router.push("/notifications" as any)}
                    className="header-buttons p-2 rounded-full active:opacity-60 relative">
                    <Icon
                        icon={icons.bell}
                        size={22}
                        className="home-icons"
                        color={isDark ? "#ffffff" : "#081126"}
                    />
                    {unreadCount > 0 && (
                        <View className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-emerald-500 border border-background dark:border-slate-900" />
                    )}
                </Pressable>
                {isReception && (
                    <Pressable
                        onPress={() => router.push("/(reception)/pending" as any)}
                        className="header-buttons p-2 rounded-full active:opacity-60 relative"
                        accessibilityLabel="لوحة الاستقبال">
                        <Ionicons
                            name="desktop-outline"
                            size={20}
                            color={isDark ? "#34d399" : "#10b981"}
                        />
                    </Pressable>
                )}
                {!isAuthenticated && !isLoading && (
                    <Pressable
                        onPress={() => router.push("/(auth)/login")}
                        className="header-buttons p-2 rounded-full active:opacity-60">
                        <Icon
                            icon={icons.doctors}
                            size={22}
                            className="home-icons"
                            color={isDark ? "#ffffff" : "#081126"}
                        />
                    </Pressable>
                )}
            </View>

            {/* الصوره و الاسم */}
            <View className="home-user">
                {/* الاسم */}
                <View>
                    <View>
                        <Text
                            className={`mr-2 text-xs text-right font-sans-bold ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
                            مرحبا بكم في تطبيق
                        </Text>
                        <Text
                            className={`mr-2 text-lg text-right font-sans-bold ${isDark ? "text-white" : "text-primary"}`}>
                            مستشفى التعاون
                        </Text>
                    </View>
                </View>
                {/* الشعار */}
                <Image source={icons.logo} className="home-avatar" />
            </View>
        </View>
    );
};

export default HomeHeader;
