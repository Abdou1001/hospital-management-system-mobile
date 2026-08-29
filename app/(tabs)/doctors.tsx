import ShowDoctors from "@/components/doctors/ShowDoctors";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import {useDoctors} from "@/hooks/doctors/useDoctors";
import {styled} from "nativewind";
import React from "react";
import {ScrollView, Text} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Doctors = () => {
    const {data, isLoading} = useDoctors();

    const apiDoctors = Array.isArray(data?.results) ? data.results : [];

    return (
        <ScrollView className="bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 mb-20">
                {/* الهيرد */}
                <UpperSection  />
                
                {/* العنوان */}
                <SectionTitle title="قائمة الأطباء" icon={icons.doctors} />

                {/* الاطباء */}
                <ShowDoctors data={apiDoctors} isLoading={isLoading} />
            </SafeAreaView>
        </ScrollView>
    );
};

export default Doctors;
