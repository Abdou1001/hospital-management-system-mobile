import ShowDoctors from "@/components/doctors/ShowDoctors";
import SectionTitle from "@/components/shared/SectionTitle";
import UpperSection from "@/components/shared/UpperSection";
import {icons} from "@/constants/icons";
import {useDepartment} from "@/hooks/departments/useDepartment";
import {useDoctorsByDepartment} from "@/hooks/doctor-departments/useDoctorsByDepartment";
import {useThemeStore} from "@/store/theme.store";
import {Ionicons} from "@expo/vector-icons";
import {router, useLocalSearchParams} from "expo-router";
import {styled} from "nativewind";
import {Pressable, ScrollView, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const DepartmentDetails = () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const departmentId = Number(id);
    const {isDark} = useThemeStore();

    // جلب معلومات القسم
    const {data: department, isLoading: isDeptLoading} =
        useDepartment(departmentId);

    // جلب الأطباء المرتبطين بالقسم
    const {data: doctorsData, isLoading: isDoctorsLoading} =
        useDoctorsByDepartment(departmentId);

    const apiDoctors = Array.isArray(doctorsData) ? doctorsData : [];
    const isLoading = isDeptLoading || isDoctorsLoading;

    return (
        <ScrollView className="bg-background dark:bg-slate-900">
            <SafeAreaView className="flex-1 p-5 mb-20">
                {/* الهيدر والبحث */}
                <UpperSection />

                <View className={"flex-row-reverse justify-between items-center"}>
                    {/* العنوان */}
                    <SectionTitle
                        title={
                            department?.depart_name
                                ? `أطباء قسم ${department.depart_name}`
                                : "أطباء القسم"
                        }
                        icon={icons.doctors}
                    />
                    {/* Left Side: Back Arrow Button */}
                    <Pressable
                        onPress={() => router.back()}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        className={`size-9 items-center justify-center rounded-2xl border mt-2 ${
                            isDark
                                ? "border-slate-800 bg-slate-800/80 active:bg-slate-700"
                                : "border-slate-200/80 bg-white/80 shadow-xs active:bg-slate-100"
                        }`}>
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={isDark ? "#ffffff" : "#081126"}
                        />
                    </Pressable>
                </View>

                {/* قائمة الأطباء */}
                <ShowDoctors data={apiDoctors} isLoading={isLoading} />
            </SafeAreaView>
        </ScrollView>
    );
};

export default DepartmentDetails;
