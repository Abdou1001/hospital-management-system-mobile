import AppointmentsSection from "@/components/appointments/AppointmentsSection";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { styled } from "nativewind";
import React from "react";
import { View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Appointments = () => {
    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5 pb-16">
            {/* الهيدر */}
            <UpperSection />

            {/* العنوان */}
            <SectionTitle title="حجوزاتي ومواعيدي" icon={icons.appointments} />

            {/* المحتوى */}
            <View className="flex-1 mt-3">
                <AppointmentsSection />
            </View>
        </SafeAreaView>
    );
};

export default Appointments;
