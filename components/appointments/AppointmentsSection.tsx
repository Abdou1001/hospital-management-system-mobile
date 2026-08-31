import React from "react";
import { View } from "react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import LoginMessage from "./LoginMessage";
import ShowAppointments from "./ShowAppointments";

const AppointmentsSection = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <View className="flex-1 mt-3">
            {isAuthenticated && user ? <ShowAppointments /> : <LoginMessage />}
        </View>
    );
};

export default AppointmentsSection;