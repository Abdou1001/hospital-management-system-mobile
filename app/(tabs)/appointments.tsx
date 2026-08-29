import ShowAppointments from "@/components/appointments/ShowAppointments";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { styled } from "nativewind";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Appointments = () => {
    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5">
            {/* الهيرد */}
            <UpperSection />

            {/* title */}
            <SectionTitle title="حجوزاتي ومواعيدي" icon={icons.appointments} />

            <ShowAppointments />
        </SafeAreaView>
    );
};

export default Appointments;
