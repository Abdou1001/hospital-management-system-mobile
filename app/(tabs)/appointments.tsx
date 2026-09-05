import AppointmentsSection from "@/components/appointments/AppointmentsSection";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { styled } from "nativewind";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Appointments = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 400);

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5 pb-16">
            {/* الهيدر والبحث */}
            <UpperSection
                placeholder="ابحث باسم الطبيب أو المريض..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* العنوان */}
            <SectionTitle title="حجوزاتي ومواعيدي" icon={icons.appointments} />

            {/* المحتوى */}
            <View className="flex-1 mt-3">
                <AppointmentsSection keyword={debouncedSearch} />
            </View>
        </SafeAreaView>
    );
};

export default Appointments;
