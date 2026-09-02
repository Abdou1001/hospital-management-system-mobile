import {Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {styled} from "nativewind";
import React, {useMemo, useState} from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

import {getDoctorImageSource} from "@/components/doctors/ShowDoctors";
import {icons} from "@/constants/icons";
import {useCreateAppointment} from "@/hooks/appointments/useCreateAppointment";
import {useAuth} from "@/hooks/auth/useAuth";
import {useDoctor} from "@/hooks/doctors/useDoctor";
import {useDoctorSchedulesByDoctor} from "@/hooks/doctorSchedules/useDoctorSchedulesByDoctor";
import {useBankAccounts} from "@/hooks/shared/useBankAccounts";
import {toast} from "@/lib/toast";
import {useThemeStore} from "@/store/theme.store";

import AppointmentCalendar from "@/components/appointments/booking/AppointmentCalendar";
import BankAccountsSection from "@/components/appointments/booking/BankAccountsSection";
import DoctorMiniCard from "@/components/appointments/booking/DoctorMiniCard";
import FeesSummary from "@/components/appointments/booking/FeesSummary";
import PatientInfoForm from "@/components/appointments/booking/PatientInfoForm";
import PaymentReceiptUploader from "@/components/appointments/booking/PaymentReceiptUploader";
import SchedulePicker from "@/components/appointments/booking/SchedulePicker";
import SuccessModal from "@/components/appointments/booking/SuccessModal";

const SafeAreaView = styled(RNSafeAreaView);

const AppointmentBookingScreen = () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const router = useRouter();
    const {isDark} = useThemeStore();
    const {user, isAuthenticated} = useAuth();

    const doctorId = Number(id);
    const {data: doctor, isLoading: isDoctorLoading} = useDoctor(doctorId);
    const {mutate: createAppointment, isPending} = useCreateAppointment();

    // جلب الدوامات من API مستقل
    const {data: schedulesData, isLoading: isSchedulesLoading} =
        useDoctorSchedulesByDoctor(doctorId);
    const schedules = schedulesData?.results ?? [];

    // جلب الحسابات البنكية
    const {data: bankAccountsData, isLoading: isBankAccountsLoading} =
        useBankAccounts();
    const bankAccounts = bankAccountsData?.results ?? [];

    // ============================
    // حالات النموذج
    // ============================
    const [patientName, setPatientName] = useState(user?.full_name || "");
    const [patientPhone, setPatientPhone] = useState(
        user?.phone_number?.replace(/^967/, "") || "",
    );
    const [patientAge, setPatientAge] = useState("");
    const [patientGender, setPatientGender] = useState<"ذكر" | "أنثى">(
        user?.gender || "ذكر",
    );
    const [notes, setNotes] = useState("");
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
        null,
    );
    const [appointmentDate, setAppointmentDate] = useState("");
    const [paymentImage, setPaymentImage] = useState<{
        uri: string;
        name: string;
        type: string;
    } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    // ============================
    // حساب الدوام المختار
    // ============================
    const selectedSchedule = useMemo(() => {
        if (!selectedScheduleId) return null;
        return (
            schedules.find((s) => s.schedule_id === selectedScheduleId) ?? null
        );
    }, [schedules, selectedScheduleId]);

    // ============================
    // التحقق والإرسال
    // ============================
    const handleSubmit = () => {
        Keyboard.dismiss();
        const newErrors: Record<string, string> = {};

        if (!patientName.trim()) {
            newErrors.patient_name = "يرجى إدخال اسم المريض الكامل";
        }
        if (!patientPhone.trim() || patientPhone.trim().length < 9) {
            newErrors.patient_phone = "يرجى إدخال رقم هاتف صحيح";
        }
        if (
            !patientAge.trim() ||
            isNaN(Number(patientAge)) ||
            Number(patientAge) <= 0
        ) {
            newErrors.patient_age = "يرجى إدخال عمر صحيح";
        }
        if (!selectedScheduleId) {
            newErrors.schedule_id = "يرجى اختيار موعد الدوام";
        }
        if (!appointmentDate) {
            newErrors.appointment_date = "يرجى اختيار تاريخ الموعد";
        }
        if (!paymentImage) {
            newErrors.payment_receipt = "يرجى رفع صورة سند الدفع";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstMsg = Object.values(newErrors)[0];
            toast.error(firstMsg);
            return;
        }

        createAppointment(
            {
                patient_name: patientName.trim(),
                patient_phone: patientPhone.trim(),
                patient_age: Number(patientAge),
                patient_gender: patientGender,
                appointment_date: appointmentDate,
                schedule_id: selectedScheduleId!,
                notes: notes.trim() || undefined,
                payment_receipt: paymentImage || undefined,
            },
            {
                onSuccess: (data) => {
                    setSuccessData(data);
                    setShowSuccessModal(true);
                },
            },
        );
    };

    // ============================
    // حالة التحميل
    // ============================
    if (isDoctorLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background dark:bg-slate-900">
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    if (!doctor) {
        return (
            <SafeAreaView className="flex-1 bg-background p-5 dark:bg-slate-900">
                <Pressable
                    onPress={() => router.back()}
                    className={`mb-4 size-10 items-center justify-center rounded-full ${
                        isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}>
                    <Image
                        source={icons.back}
                        className="size-5"
                        resizeMode="contain"
                        style={{tintColor: isDark ? "#ffffff" : "#1e293b"}}
                    />
                </Pressable>
                <View className="flex-1 items-center justify-center">
                    <Text className="font-sans-bold text-lg text-primary dark:text-white">
                        الطبيب غير متاح
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-background p-5 dark:bg-slate-900">
                <Pressable
                    onPress={() => router.back()}
                    className={`mb-4 size-10 items-center justify-center rounded-full ${
                        isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}>
                    <Image
                        source={icons.back}
                        className="size-5"
                        resizeMode="contain"
                        style={{tintColor: isDark ? "#ffffff" : "#1e293b"}}
                    />
                </Pressable>
                <View className="flex-1 items-center justify-center rounded-3xl border border-border bg-card p-6">
                    <Ionicons
                        name="lock-closed-outline"
                        size={48}
                        color="#10b981"
                    />
                    <Text className="mt-4 text-center font-sans-bold text-lg text-primary dark:text-white">
                        يجب تسجيل الدخول أولاً
                    </Text>
                    <Text className="mt-2 text-center font-sans-medium text-sm text-muted-foreground dark:text-slate-400">
                        لحجز موعد يرجى تسجيل الدخول أو إنشاء حساب جديد
                    </Text>

                    {/* زر تسجيل الدخول */}
                    <Pressable
                        onPress={() => router.push("/(auth)/login")}
                        className="mt-5 w-full items-center justify-center rounded-xl bg-main py-3.5 active:opacity-80">
                        <Text className="text-base font-sans-bold text-background">
                            تسجيل الدخول
                        </Text>
                    </Pressable>

                    {/* زر تسجيل انشاء حساب */}
                    <Pressable
                        onPress={() => router.push("/(auth)/register")}
                        className="mt-5 w-full items-center justify-center rounded-xl border-2 py-3.5 border-main bg-transparent ">
                        <Text className="text-base font-sans-bold text-main dark:text-emerald-400">
                            إنشاء حساب جديد
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // رسوم الطبيب
    const appFeeRaw = process.env.PLATFORM_FEE || "500";
    const appFee = Number(appFeeRaw) || 0;
    const doctorFee = doctor.consultation_fee || 0;
    const totalFee = doctorFee + appFee;

    const imageSource = getDoctorImageSource(doctor);

    return (
        <View className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{paddingBottom: 40}}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <SafeAreaView className="p-5">
                    {/* ============================
                        الهيدر
                    ============================ */}
                    <View className="mb-4 flex-row items-center justify-between">
                        <Pressable
                            onPress={() => router.back()}
                            className={`size-10 items-center justify-center rounded-full ${
                                isDark ? "bg-slate-800" : "bg-slate-100"
                            }`}>
                            <Image
                                source={icons.back}
                                className="size-5"
                                resizeMode="contain"
                                style={{
                                    tintColor: isDark ? "#ffffff" : "#1e293b",
                                }}
                            />
                        </Pressable>
                        <Text
                            className={`font-sans-bold text-xl ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}>
                            حجز موعد
                        </Text>
                        <View className="w-10" />
                    </View>

                    {/* بطاقة الطبيب المصغرة */}
                    <DoctorMiniCard
                        doctor={doctor}
                        imageSource={imageSource}
                        totalFee={totalFee}
                        isDark={isDark}
                    />

                    {/* ============================
                        كارت نموذج الحجز
                    ============================ */}
                    <View
                        className={`rounded-3xl border p-5 shadow-sm ${
                            isDark
                                ? "border-slate-800 bg-slate-800/90"
                                : "border-slate-100 bg-white"
                        }`}>
                        <Text
                            className={`font-sans-bold text-xl ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}
                            style={{textAlign: "right"}}>
                            بيانات المريض
                        </Text>
                        <Text
                            className="mt-1 font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                            style={{textAlign: "right"}}>
                            يرجى ملء البيانات التالية لإتمام الحجز
                        </Text>

                        {/* حقول بيانات المريض */}
                        <PatientInfoForm
                            patientName={patientName}
                            setPatientName={setPatientName}
                            patientPhone={patientPhone}
                            setPatientPhone={setPatientPhone}
                            patientAge={patientAge}
                            setPatientAge={setPatientAge}
                            patientGender={patientGender}
                            setPatientGender={setPatientGender}
                            errors={errors}
                            isDark={isDark}
                        />

                        {/* اختيار الدوام */}
                        <SchedulePicker
                            schedules={schedules}
                            isLoading={isSchedulesLoading}
                            selectedScheduleId={selectedScheduleId}
                            setSelectedScheduleId={setSelectedScheduleId}
                            setAppointmentDate={setAppointmentDate}
                            showDropdown={showScheduleDropdown}
                            setShowDropdown={setShowScheduleDropdown}
                            errors={errors}
                            isDark={isDark}
                        />

                        {/* التقويم لاختيار التاريخ */}
                        {selectedSchedule && (
                            <AppointmentCalendar
                                selectedDayOfWeek={selectedSchedule.day_of_week}
                                appointmentDate={appointmentDate}
                                setAppointmentDate={setAppointmentDate}
                                errors={errors}
                                isDark={isDark}
                            />
                        )}

                        {/* ملاحظات */}
                        <View className="mt-5">
                            <Text
                                className={`mb-2 font-sans-bold text-sm ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}
                                style={{textAlign: "right"}}>
                                ملاحظات ( اختياري )
                            </Text>
                            <View
                                className={`w-full rounded-2xl border px-4 py-3 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-900/60"
                                        : "border-slate-200 bg-slate-50"
                                }`}>
                                <TextInput
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder="أكتب ملاحظات إضافية عن الحالة (مثل: أعاني من ألم...)"
                                    placeholderTextColor={
                                        isDark ? "#64748b" : "#94a3b8"
                                    }
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    className={`font-sans-medium text-sm leading-6 ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                    style={{textAlign: "right", minHeight: 80}}
                                />
                            </View>
                        </View>

                        {/* الحسابات البنكية */}
                        <BankAccountsSection
                            bankAccounts={bankAccounts}
                            isLoading={isBankAccountsLoading}
                            totalFee={totalFee}
                            isDark={isDark}
                        />

                        {/* رفع سند الدفع */}
                        <PaymentReceiptUploader
                            paymentImage={paymentImage}
                            setPaymentImage={setPaymentImage}
                            errors={errors}
                            isDark={isDark}
                        />

                        {/* ملاحظة مهمة حول سند الدفع */}
                        <View
                            className={`mt-5 rounded-2xl border p-4 ${
                                isDark
                                    ? "border-amber-500/20 bg-amber-500/5"
                                    : "border-amber-200 bg-amber-50"
                            }`}>
                            <View className="flex-row-reverse items-start gap-2">
                                <Ionicons
                                    name="warning-outline"
                                    size={20}
                                    color="#f59e0b"
                                />
                                <View className="flex-1">
                                    <Text
                                        className="font-sans-bold text-sm text-amber-700 dark:text-amber-400"
                                        style={{textAlign: "right"}}>
                                        تنبيه مهم
                                    </Text>
                                    <Text
                                        className="mt-1 font-sans-medium text-xs leading-5 text-amber-600 dark:text-amber-300"
                                        style={{textAlign: "right"}}>
                                        • حافظ على سند الدفع وأحضره معك عند
                                        مراجعة الطبيب{"\n"}• في حالة إلغاء الحجز
                                        أو عدم الحضور، يمكنك إعادة التسجيل أو
                                        إحضار السند لاسترجاع المبلغ
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ملخص الرسوم */}
                        <FeesSummary
                            doctorFee={doctorFee}
                            appFee={appFee}
                            totalFee={totalFee}
                            isDark={isDark}
                        />

                        {/* زر تأكيد الحجز */}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={isPending}
                            className={`mt-6 h-14 items-center justify-center rounded-2xl shadow-md ${
                                isPending ? "bg-main/60" : "bg-main"
                            }`}>
                            {isPending ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />
                            ) : (
                                <Text className="font-sans-bold text-base text-white">
                                    تأكيد الحجز
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </SafeAreaView>
            </ScrollView>

            {/* مودال النجاح */}
            <SuccessModal
                visible={showSuccessModal}
                onViewAppointments={() => {
                    setShowSuccessModal(false);
                    router.push("/(tabs)/appointments" as any);
                }}
                onGoBack={() => {
                    setShowSuccessModal(false);
                    router.back();
                }}
                isDark={isDark}
            />
        </View>
    );
};

export default AppointmentBookingScreen;
