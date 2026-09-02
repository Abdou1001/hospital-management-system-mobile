import {useAuth} from "@/hooks/auth/useAuth";
import React from "react";
import {ActivityIndicator, Text, View} from "react-native";
import LoginMessage from "./LoginMessage";
import ShowAppointments from "./ShowAppointments";

const AppointmentsSection = () => {
    const {isAuthenticated, user, isLoading} = useAuth();

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
            {isAuthenticated && user ? <ShowAppointments /> : <LoginMessage />}
        </View>
    );
};

export default AppointmentsSection;
