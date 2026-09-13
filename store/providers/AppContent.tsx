import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/ToastConfig";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "../theme.store";
import { registerForPushNotificationsAsync } from "@/services/notifications/registerForPushNotifications";

const AppContent = () => {
    const { data: user, isLoading, isError } = useCurrentUser();
    const { isDark } = useThemeStore();

    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        if (user) {
            setUser(user);
            registerForPushNotificationsAsync();
        }

        if (isError) {
            clearUser();
        }

        setLoading(isLoading);
    }, [user, isLoading, isError]);

    return (
        <View className="flex-1 relative">
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
            <Toast config={toastConfig} />
        </View>
    );
};

export default AppContent;
