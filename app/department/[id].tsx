import ShowDoctors from "@/components/doctors/ShowDoctors";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import { icons } from "@/constants/icons";
import { useDepartment } from "@/hooks/departments/useDepartment";
import { useDoctorsByDepartment } from "@/hooks/doctor-departments/useDoctorsByDepartment";
import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const DepartmentDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const departmentId = Number(id);

    // جلب معلومات القسم
    const { data: department, isLoading: isDeptLoading } = useDepartment(departmentId);

    // جلب الأطباء المرتبطين بالقسم
    const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctorsByDepartment(departmentId);

    const apiDoctors = Array.isArray(doctorsData) ? doctorsData : [];
    const isLoading = isDeptLoading || isDoctorsLoading;

    return (
        <ScrollView className="bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 mb-20">
                {/* الهيدر والبحث */}
                <UpperSection />

                {/* العنوان */}
                <SectionTitle 
                    title={department?.depart_name ? `أطباء قسم ${department.depart_name}` : "أطباء القسم"} 
                    icon={icons.doctors} 
                />

                {/* قائمة الأطباء */}
                <ShowDoctors data={apiDoctors} isLoading={isLoading} />
            </SafeAreaView>
        </ScrollView>
    );
};

export default DepartmentDetails;
