import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useLogout } from "@/hooks/auth/useLogout";

const LogoutButton = () => {
    const { mutate: logoutMutate, isPending } = useLogout();

    const handleConfirmLogout = () => {
        Alert.alert(
            "تسجيل الخروج",
            "هل أنت متأكد من رغبتك في تسجيل الخروج من التطبيق؟",
            [
                { text: "إلغاء", style: "cancel" },
                {
                    text: "تسجيل الخروج",
                    style: "destructive",
                    onPress: () => logoutMutate(),
                },
            ]
        );
    };

    return (
        <View className="mt-2 mb-8">
            <Pressable
                disabled={isPending}
                onPress={handleConfirmLogout}
                className={`w-full h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 flex-row-reverse items-center justify-center gap-2 ${
                    isPending ? "opacity-60" : "active:opacity-80"
                }`}>
                {isPending ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                    <>
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text className="font-sans-bold text-base text-red-600 dark:text-red-400">
                            تسجيل الخروج
                        </Text>
                    </>
                )}
            </Pressable>
        </View>
    );
};

export default LogoutButton;
