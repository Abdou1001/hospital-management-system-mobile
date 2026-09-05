import React from "react";
import {ActivityIndicator, Text, View} from "react-native";

import images from "@/constants/images";
import CardDoctors, {DoctorData} from "./CardDoctors";
import { useThemeStore } from "@/store/theme.store";



/*
 * تجهيز صورة الطبيب
 */
export const getDoctorImageSource = (doctor: DoctorData) => {
    if (doctor.path_image && doctor.path_image.trim().length > 0) {
        return {
            uri: doctor.path_image,
        };
    }

    if (doctor.gender === "أنثى") {
        return images.femaleDoctor;
    }

    return images.maleDoctor;
};

/*
 * تجميع الأطباء والتخصصات
 */
export const groupDoctors = (data: any[]) => {
    const doctorsMap = new Map<
        string | number,
        {
            doctor: DoctorData;
            departments: string[];
        }
    >();

    data.forEach((item) => {
        if (!item) return;

        const doctor: DoctorData = item.doctor ? item.doctor : item;

        // لا يظهر الطبيب في القوائم إذا كان is_hidden === true
        if (doctor.is_hidden || item.is_hidden) return;

        const doctorId = doctor.doctor_id;

        if (!doctorId) return;

        // استخراج جميع تخصصات الطبيب
        let departmentNames: string[] = [];
        if (item.department?.depart_name) {
            departmentNames = [item.department.depart_name];
        } else if (doctor.doctor_department) {
            departmentNames =
                doctor.doctor_department
                    ?.map(
                        (depItem: any) => depItem.department?.depart_name
                    )
                    .filter(Boolean) || [];
        }

        /*
         * إذا كان الطبيب موجودًا مسبقًا
         * نضيف تخصصاته إلى التخصصات الموجودة
         */
        if (doctorsMap.has(doctorId)) {
            const existing = doctorsMap.get(doctorId)!;

            departmentNames.forEach((departmentName: string) => {
                if (!existing.departments.includes(departmentName)) {
                    existing.departments.push(departmentName);
                }
            });

            return;
        }

        /*
         * أول ظهور للطبيب
         */
        doctorsMap.set(doctorId, {
            doctor,
            departments: departmentNames,
        });
    });

    return Array.from(doctorsMap.values());
};

const ShowDoctors: React.FC<ShowDoctorsProps> = ({data, isLoading, limit}) => {
    const { isDark } = useThemeStore();
    /*
     * Loading
     */
    if (isLoading) {
        return (
            <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#16a34a" />
            </View>
        );
    }

    /*
     * إذا API لم يرسل data نستخدم البيانات التجريبية
     */
    const rawList = data !== undefined ? data : [];

    /*
     * تجميع الأطباء
     */
    const groupedDoctors = groupDoctors(rawList);

    /*
     * تطبيق limit بعد التجميع
     */
    const list = limit ? groupedDoctors.slice(0, limit) : groupedDoctors;

    /*
     * لا يوجد أطباء
     */
    if (list.length === 0) {
        return (
            <View
                className={`mt-4 items-center justify-center rounded-3xl border ${isDark ? "border-white/50 bg-slate-800 " : "border-border bg-card"} px-6 py-8`}>
                <Text className={`mt-3 text-lg font-sans-bold text-primary ${isDark ? "text-white" : "text-black"}`}>
                    لا يوجد أطباء
                </Text>

                <Text className={`mt-1 text-center text-sm font-sans-medium ${isDark ? "text-gray-300" : "text-muted-foreground"}`}>
                    لا يوجد أطباء متاحون حاليًا
                </Text>
            </View>
        );
    }
    return (
        <View className="mt-4 gap-4">
            {list.map(({doctor, departments}) => (
                <CardDoctors
                    key={doctor.doctor_id}
                    doctor={doctor}
                    departments={departments}
                />
            ))}
        </View>
    );
};

export default ShowDoctors;
