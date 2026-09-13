import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import DoctorDetailsSkeleton from "@/components/skeletons/DoctorDetailsSkeleton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { useDoctor } from "@/hooks/doctors/useDoctor";
import { useThemeStore } from "@/store/theme.store";
import { getDoctorImageSource } from "@/components/doctors/ShowDoctors";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

const DoctorDetailsScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isDark } = useThemeStore();

    const doctorId = Number(id);
    const { data: doctor, isLoading } = useDoctor(doctorId);

    // رسوم التطبيق من .env
    const appFeeRaw =
        process.env.EXPO_PUBLIC_CONSULTATION_FEE ||
        process.env.EXPO_PUBLIC_PLATFORM_FEE ||
        process.env.consultation_fee ||
        process.env.PLATFORM_FEE ||
        "500";
    const appFee = Number(appFeeRaw) || 0;

    // حالة التحميل
    if (isLoading) {
        return <DoctorDetailsSkeleton />;
    }

    // إذا كان الطبيب غير موجود أو مخفي (is_hidden === true) لا يظهر في التطبيق
    if (!doctor || doctor.is_hidden) {
        return (
            <SafeAreaView className="flex-1 bg-background p-5 dark:bg-slate-900">
                {/* Left Side: Back Arrow Button */}
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    className={`size-11 items-center justify-center rounded-2xl border ${
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

                <View className="flex-1 items-center justify-center rounded-3xl border border-border bg-card p-6">
                    <Text className="text-center font-sans-bold text-lg text-primary dark:text-white">
                        هذا الطبيب غير متاح
                    </Text>
                    <Text className="mt-2 text-center font-sans-medium text-sm text-muted-foreground dark:text-slate-400">
                        عذراً، هذا الطبيب غير متوفر حالياً في التطبيق.
                    </Text>
                    <Pressable
                        onPress={() => router.back()}
                        className="mt-6 rounded-xl bg-main px-6 py-3">
                        <Text className="font-sans-bold text-sm text-white">
                            العودة للخلف
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // الحسابات
    const doctorFee = doctor.consultation_fee || 0;
    const totalFee = doctorFee + appFee;

    // فحص حالة الحجز للطبيب
    const isInactive = doctor.status === "inactive";

    // تجميع التخصصات
    const departments =
        doctor.doctor_department
            ?.map((dep: any) => dep.department?.depart_name)
            .filter(Boolean) || [];

    const imageSource = getDoctorImageSource(doctor);

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <SafeAreaView className="p-5 pb-28">
                    {/* Header bar */}
                    <View className="mb-4 flex-row items-center justify-between">
                        {/* Left Side: Back Arrow Button */}
                        <Pressable
                            onPress={() => router.back()}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            className={`size-11 items-center justify-center rounded-2xl border ${
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
                        <Text
                            className={`font-sans-bold text-xl ${isDark ? "text-white" : "text-slate-800"}`}>
                            تفاصيل الطبيب
                        </Text>
                        <View className="w-10" />
                    </View>

                    {/* Card الطبيب الرئيسي */}
                    <View
                        className={`overflow-hidden rounded-3xl border p-4 shadow-sm ${
                            isDark
                                ? "border-slate-700/60 bg-slate-800"
                                : "border-slate-100 bg-white"
                        }`}>
                        <View className="flex-row-reverse items-center gap-4">
                            {/* صورة الطبيب */}
                            <View
                                className={`h-32 w-28 overflow-hidden rounded-2xl ${
                                    isDark ? "bg-slate-700" : "bg-slate-100"
                                }`}>
                                <Image
                                    source={imageSource}
                                    resizeMode="cover"
                                    className="size-full"
                                />
                            </View>

                            {/* تفاصيل الاسم والتخصص */}
                            <View className="flex-1">
                                <Text
                                    className={`text-right font-sans-bold text-xl ${
                                        isDark ? "text-white" : "text-slate-800"
                                    }`}>
                                    {doctor.full_name}
                                </Text>

                                {/* حالة الطبيب */}
                                <View className="mt-1 flex-row-reverse items-center">
                                    <View
                                        className={`rounded-full px-2.5 py-0.5 ${
                                            isInactive
                                                ? "bg-red-500/10"
                                                : "bg-green-500/10"
                                        }`}>
                                        <Text
                                            className={`font-sans-semibold text-xs ${
                                                isInactive
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                            }`}>
                                            {isInactive
                                                ? "غير متاح حالياً"
                                                : "متاح للحجز"}
                                        </Text>
                                    </View>
                                </View>

                                {/* التخصصات */}
                                <View className="mt-2.5 flex-row-reverse flex-wrap gap-1.5">
                                    {departments.length > 0 ? (
                                        departments.map(
                                            (depName: string, idx: number) => (
                                                <View
                                                    key={`${depName}-${idx}`}
                                                    className={`rounded-full px-3 py-1 ${
                                                        isDark
                                                            ? "bg-green-900/40"
                                                            : "bg-green-50"
                                                    }`}>
                                                    <Text
                                                        className={`font-sans-semibold text-xs ${
                                                            isDark
                                                                ? "text-green-300"
                                                                : "text-green-700"
                                                        }`}>
                                                        {depName}
                                                    </Text>
                                                </View>
                                            ),
                                        )
                                    ) : (
                                        <Text className="font-sans-medium text-xs text-muted-foreground">
                                            عام
                                        </Text>
                                    )}
                                </View>

                                {/* سنوات الخبرة والدراسة */}
                                {doctor.years_exper ? (
                                    <Text className="mt-2 text-right font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                        🎓 {doctor.education || "خبرة طبية"} •
                                        ⏳ {doctor.years_exper} سنوات خبرة
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    {/* قسم النبذة التعريفية */}
                    <View
                        className={`mt-4 rounded-3xl border p-5 ${
                            isDark
                                ? "border-slate-700/60 bg-slate-800"
                                : "border-slate-100 bg-white"
                        }`}>
                        <Text
                            className={`text-right font-sans-bold text-base ${isDark ? "text-white" : "text-slate-800"}`}>
                            نبذة عن الطبيب
                        </Text>
                        <Text className="mt-2 text-right font-sans-medium text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {doctor.bio || "لا توجد نبذة متوفرة عن الطبيب."}
                        </Text>
                    </View>

                    {/* جدول المواعيد المتاحة */}
                    {doctor.doctor_schedule &&
                    doctor.doctor_schedule.length > 0 ? (
                        <View
                            className={`mt-4 rounded-3xl border p-5 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <Text
                                className={`mb-3 text-right font-sans-bold text-base ${isDark ? "text-white" : "text-slate-800"}`}>
                                مواعيد الدوام
                            </Text>
                            <View className="gap-2.5">
                                {doctor.doctor_schedule.map(
                                    (sched: any, idx: number) => (
                                        <View
                                            key={sched.schedule_id || idx}
                                            className={`flex-row-reverse items-center justify-between rounded-2xl p-3 ${
                                                isDark
                                                    ? "bg-slate-700/50"
                                                    : "bg-slate-50"
                                            }`}>
                                            <View className="flex-row-reverse items-center gap-2">
                                                <Text className="font-sans-bold text-sm text-primary dark:text-green-400">
                                                    {sched.day_of_week}
                                                </Text>
                                                <Text className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400">
                                                    ({sched.shift_type})
                                                </Text>
                                            </View>
                                            <Text className="font-sans-semibold text-sm text-slate-600 dark:text-slate-300">
                                                ⏱️ {sched.start_time} -{" "}
                                                {sched.end_time}
                                            </Text>
                                        </View>
                                    ),
                                )}
                            </View>
                        </View>
                    ) : null}

                    {/* تفاصيل الرسوم */}
                    <View
                        className={`mt-4 rounded-3xl border p-5 ${
                            isDark
                                ? "border-slate-700/60 bg-slate-800"
                                : "border-slate-100 bg-white"
                        }`}>
                        <Text
                            className={`mb-3 text-right font-sans-bold text-base ${isDark ? "text-white" : "text-slate-800"}`}>
                            تفاصيل الرسوم
                        </Text>
                        <View className="gap-2">
                            <View className="flex-row-reverse justify-between">
                                <Text className="font-sans-medium text-sm text-slate-500 dark:text-slate-400">
                                    رسوم الكشفية:
                                </Text>
                                <Text className="font-sans-semibold text-sm text-slate-800 dark:text-white">
                                    {doctorFee} ر.ي
                                </Text>
                            </View>
                            <View className="flex-row-reverse justify-between">
                                <Text className="font-sans-medium text-sm text-slate-500 dark:text-slate-400">
                                    رسوم الخدمة والتطبيق:
                                </Text>
                                <Text className="font-sans-semibold text-sm text-slate-800 dark:text-white">
                                    {appFee} ر.ي
                                </Text>
                            </View>
                            <View className="mt-2 flex-row-reverse justify-between border-t border-border pt-2 dark:border-slate-700">
                                <Text className="font-sans-bold text-base text-primary dark:text-green-400">
                                    الإجمالي:
                                </Text>
                                <Text className="font-sans-bold text-base text-primary dark:text-green-400">
                                    {totalFee} ر.ي
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* قسم الملاحظات */}
                    {doctor.notes ? (
                        <View
                            className={`mt-4 rounded-3xl border p-5 ${
                                isDark
                                    ? "border-slate-700/60 bg-slate-800"
                                    : "border-slate-100 bg-white"
                            }`}>
                            <Text
                                className={`text-right font-sans-bold text-base ${isDark ? "text-white" : "text-slate-800"}`}>
                                ملاحظات التواجد
                            </Text>
                            <Text className="mt-2 text-right font-sans-medium text-sm text-slate-600 dark:text-slate-300">
                                📌 {doctor.notes}
                            </Text>
                        </View>
                    ) : null}
                </SafeAreaView>
            </ScrollView>

            {/* الشريط السفلي لزر الحجز */}
            <View
                className={`absolute bottom-0 left-0 right-0 border-t p-4 shadow-lg ${
                    isDark
                        ? "border-slate-700 bg-slate-800"
                        : "border-slate-200 bg-white"
                }`}>
                <Pressable
                    disabled={isInactive}
                    onPress={() => {
                        if (!isInactive) {
                            router.push(
                                `/doctor/${doctor.doctor_id}/appointment` as any,
                            );
                        }
                    }}
                    className={`items-center justify-center rounded-2xl py-4 shadow-md ${
                        isInactive
                            ? isDark
                                ? "bg-slate-700"
                                : "bg-slate-300"
                            : "bg-main"
                    }`}>
                    <Text className="font-sans-bold text-base text-white">
                        {isInactive ? "لا يوجد حجز حاليا" : "حجز موعد"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default DoctorDetailsScreen;