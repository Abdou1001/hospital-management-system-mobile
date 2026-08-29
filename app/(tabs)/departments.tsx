import ShowDepartments from "@/components/departments/ShowDepartments";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { useDepartments } from "@/hooks/departments/useDepartments";
import { styled } from "nativewind";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Departments = () => {
    const {data, isLoading} = useDepartments({limit: 100});

    const apiDepartments = Array.isArray(data) ? data : [];

    return (
        <ScrollView className="bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 mb-20">
                {/* الهيرد */}
                <UpperSection />
                
                {/* العنوان */}
                <SectionTitle title="الأقسام الطبية" icon={icons.departments} />

                {/* الاقسام */}
                <ShowDepartments data={apiDepartments} isLoading={isLoading} />
            </SafeAreaView>
        </ScrollView>
    );
};

export default Departments;
