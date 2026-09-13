import { useAuth } from "@/hooks/auth/useAuth";
import React, { memo } from "react";
import { View } from "react-native";
import LoginMessage from "./LoginMessage";
import ShowAppointments from "./ShowAppointments";
import AppointmentCardSkeleton from "@/components/skeletons/AppointmentCardSkeleton";

interface AppointmentsSectionProps {
    keyword?: string;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ keyword }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading)
        return (
            <View className="mt-3">
                <AppointmentCardSkeleton count={3} />
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
