import { useAuth } from "@/hooks/auth/useAuth";
import React, { memo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import LoginMessage from "./LoginMessage";
import ShowAppointments from "./ShowAppointments";

interface AppointmentsSectionProps {
    keyword?: string;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ keyword }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading)
        return (
            <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="mt-3 font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                    جارٍ تحميل حجوزاتك ومواعيدك...
                </Text>
            </View>
        );
    return (
        <View className="flex-1 mt-3">
            {isAuthenticated && user ? (
                <ShowAppointments keyword={keyword} />
            ) : (
                <LoginMessage />
            )}
        </View>
    );
};

export default memo(AppointmentsSection);
