import AppointmentsSection from "@/components/appointments/AppointmentsSection";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { styled } from "nativewind";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useMyAppointments } from "@/hooks/appointments/useMyAppointments";

const SafeAreaView = styled(RNSafeAreaView);

const Appointments = () => {
    const { refetch, isRefetching } = useMyAppointments();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    colors={["#10b981"]}
                    tintColor="#10b981"
                />
            }
            className="flex-1 bg-background dark:bg-slate-900 p-5">
            <SafeAreaView className="flex-1 mb-16">
                {/* الهيدر */}
                <UpperSection />

                {/* العنوان */}
                <SectionTitle title="حجوزاتي ومواعيدي" icon={icons.appointments} />

                {/* المحتوى */}
                <AppointmentsSection />
            </SafeAreaView>
        </ScrollView>
    );
};

export default Appointments;
