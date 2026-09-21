import BookingPageSkeleton from "@/components/skeletons/BookingPageSkeleton";
import {Ionicons} from "@expo/vector-icons";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLocalSearchParams, useRouter} from "expo-router";
import {styled} from "nativewind";
import {useCallback, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
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
import {
    BookingAppointmentFormValues,
    bookingAppointmentSchema,
} from "@/validation/appointments/schemas/booking-appointment.schema";

import AppointmentCalendar from "@/components/appointments/booking/AppointmentCalendar";
import BankAccountsSection from "@/components/appointments/booking/BankAccountsSection";
import BookingNotesInput from "@/components/appointments/booking/BookingNotesInput";
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
    const {user, isAuthenticated, isLoading} = useAuth();

    const doctorId = Number(id);
    const {data: doctor, isLoading: isDoctorLoading} = useDoctor(doctorId);
    const {mutate: createAppointment, isPending} = useCreateAppointment();

    // جلب الدوامات من API مستقل
    const {data: schedulesData, isLoading: isSchedulesLoading} =
        useDoctorSchedulesByDoctor(doctorId);
    const schedules = useMemo(
        () => schedulesData?.results ?? [],
        [schedulesData?.results],
    );

    // جلب الحسابات البنكية
    const {data: bankAccountsData, isLoading: isBankAccountsLoading} =
        useBankAccounts();
    const bankAccounts = useMemo(
        () => bankAccountsData?.results ?? [],
        [bankAccountsData?.results],
    );

    // ============================
    // react-hook-form إدارة النموذج
    // ============================
    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<BookingAppointmentFormValues>({
        resolver: zodResolver(bookingAppointmentSchema),
        defaultValues: {
            patient_name: user?.full_name || "",
            patient_phone: user?.phone_number?.replace(/^967/, "") || "",
            patient_age: "",
            patient_gender: (user?.gender as "ذكر" | "أنثى") || "ذكر",
            notes: "",
            schedule_id: undefined as any,
            appointment_date: "",
            payment_receipt: null,
        },
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // ============================
    // دوال اختيار الحقول بكفاءة
    // ============================
    const handleSelectSchedule = useCallback(
        (schedId: number) => {
            setValue("schedule_id", schedId, {shouldValidate: true});
            setValue("appointment_date", "", {shouldValidate: true});
        },
        [setValue],
    );

    const handleSelectDate = useCallback(
        (date: string) => {
            setValue("appointment_date", date, {shouldValidate: true});
        },
        [setValue],
    );

    const handleSelectPaymentImage = useCallback(
        (img: {uri: string; name: string; type: string} | null) => {
            setValue("payment_receipt", img, {shouldValidate: true});
        },
        [setValue],
    );

    const handleViewAppointments = useCallback(() => {
        setShowSuccessModal(false);
        router.push("/(tabs)/appointments" as any);
    }, [router]);

    const handleGoBack = useCallback(() => {
        setShowSuccessModal(false);
        router.back();
    }, [router]);

    // ============================
    // التحقق والإرسال
    // ============================
    const onSubmit = useCallback(
        (data: BookingAppointmentFormValues) => {
            Keyboard.dismiss();
            createAppointment(
                {
                    patient_name: data.patient_name.trim(),
                    patient_phone: data.patient_phone.trim(),
                    patient_age: Number(data.patient_age),
                    patient_gender: data.patient_gender,
                    appointment_date: data.appointment_date,
                    schedule_id: data.schedule_id,
                    notes: data.notes?.trim() || undefined,
                    payment_receipt: data.payment_receipt || undefined,
                },
                {
                    onSuccess: () => {
                        setShowSuccessModal(true);
                    },
                },
            );
        },
        [createAppointment],
    );

    const onError = useCallback((formErrors: typeof errors) => {
        Keyboard.dismiss();
        const firstKey = Object.keys(
            formErrors,
        )[0] as keyof BookingAppointmentFormValues;
        if (firstKey && formErrors[firstKey]?.message) {
            toast.error(formErrors[firstKey]!.message as string);
        }
    }, []);

    // رسوم الطبيب
    const appFeeRaw = process.env.PLATFORM_FEE || "500";
    const appFee = Number(appFeeRaw) || 0;
    const doctorFee = doctor?.consultation_fee || 0;
    const totalFee = doctorFee + appFee;

    const imageSource = useMemo(
        () => (doctor ? getDoctorImageSource(doctor) : null),
        [doctor],
    );

    // ============================
    // حالة التحميل
    // ============================
    if (isDoctorLoading || isLoading) {
        return <BookingPageSkeleton />;
    }

    if (!doctor) {
        return (
            <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5">
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
                <View className="flex-1 items-center justify-center">
                    <Text
                        className={`font-sans-bold text-lg ${
                            isDark ? "text-white" : "text-primary"
                        }`}>
                        الطبيب غير متاح
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-background dark:bg-slate-900 p-5">
                <Pressable
                    onPress={() => router.back()}
                    className={`mb-4 size-10 items-center justify-center rounded-full ${
                        isDark ? "bg-slate-800 active:bg-slate-700" : "bg-slate-100 active:bg-slate-200"
                    }`}>
                    <Image
                        source={icons.back}
                        className="size-5"
                        resizeMode="contain"
                        style={{tintColor: isDark ? "#ffffff" : "#1e293b"}}
                    />
                </Pressable>
                <View
                    className={`flex-1 items-center justify-center rounded-3xl border p-6 ${
                        isDark
                            ? "border-slate-800 bg-slate-850"
                            : "border-slate-100 bg-white"
                    }`}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={48}
                        color="#10b981"
                    />
                    <Text
                        className={`mt-4 text-center font-sans-bold text-lg ${
                            isDark ? "text-white" : "text-primary"
                        }`}>
                        يجب تسجيل الدخول أولاً
                    </Text>
                    <Text
                        className={`mt-2 text-center font-sans-medium text-sm ${
                            isDark ? "text-slate-400" : "text-muted-foreground"
                        }`}>
                        لحجز موعد يرجى تسجيل الدخول أو إنشاء حساب جديد
                    </Text>

                    {/* زر تسجيل الدخول */}
                    <Pressable
                        onPress={() => router.push("/(auth)/login")}
                        className="mt-5 w-full items-center justify-center rounded-xl bg-main py-3.5 active:opacity-80">
                        <Text className="text-base font-sans-bold text-white">
                            تسجيل الدخول
                        </Text>
                    </Pressable>

                    {/* زر إنشاء حساب جديد */}
                    <Pressable
                        onPress={() => router.push("/(auth)/register")}
                        className={`mt-5 w-full items-center justify-center rounded-xl border-2 border-main bg-transparent py-3.5 active:opacity-80`}>
                        <Text
                            className={`text-base font-sans-bold ${
                                isDark ? "text-emerald-400" : "text-main"
                            }`}>
                            إنشاء حساب جديد
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className="flex-1 bg-background dark:bg-slate-900">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                nestedScrollEnabled={true}>
                <View className="p-5">
                    {/* ============================
                            الهيدر
                        ============================ */}
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
                                ? "border-slate-800 bg-slate-850"
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
                            className={`mt-1 font-sans-medium text-xs ${
                                isDark ? "text-slate-400" : "text-muted-foreground"
                            }`}
                            style={{textAlign: "right"}}>
                            يرجى ملء البيانات التالية لإتمام الحجز
                        </Text>

                        {/* حقول بيانات المريض */}
                        <PatientInfoForm
                            control={control}
                            errors={errors}
                            isDark={isDark}
                        />

                        {/* اختيار الدوام */}
                        <SchedulePicker
                            schedules={schedules}
                            isLoading={isSchedulesLoading}
                            control={control}
                            onSelectSchedule={handleSelectSchedule}
                            errorMessage={errors.schedule_id?.message}
                            isDark={isDark}
                        />

                        {/* التقويم لاختيار التاريخ */}
                        <AppointmentCalendar
                            schedules={schedules}
                            control={control}
                            onSelectDate={handleSelectDate}
                            errorMessage={errors.appointment_date?.message}
                            isDark={isDark}
                        />

                        {/* الحسابات البنكية */}
                        <BankAccountsSection
                            bankAccounts={bankAccounts}
                            isLoading={isBankAccountsLoading}
                            totalFee={totalFee}
                            isDark={isDark}
                        />

                        {/* رفع سند الدفع */}
                        <PaymentReceiptUploader
                            control={control}
                            onSelectImage={handleSelectPaymentImage}
                            errorMessage={errors.payment_receipt?.message}
                            isDark={isDark}
                        />

                        {/* ملاحظات */}
                        <BookingNotesInput control={control} isDark={isDark} />

                        {/* ملاحظة مهمة حول سند الدفع */}
                        <View
                            className={`mt-5 rounded-2xl border p-4 ${
                                isDark
                                    ? "border-amber-500/20 bg-amber-500/10"
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
                                        className={`font-sans-bold text-sm ${
                                            isDark ? "text-amber-400" : "text-amber-700"
                                        }`}
                                        style={{textAlign: "right"}}>
                                        تنبيه مهم
                                    </Text>
                                    <Text
                                        className={`mt-1 font-sans-medium text-xs leading-6 ${
                                            isDark ? "text-amber-300" : "text-amber-600"
                                        }`}
                                        style={{textAlign: "right"}}>
                                        • حافظ على سند الدفع وأحضره معك عند
                                        مراجعة الطبيب{"\n"}• اذا كان موعدك
                                        ساخداكثر من يومين سيتم مراجعة طلبك قبل
                                        الموعد بيوم و سيتم ارسال لك اشعار وأحضره
                                        معك عند {"\n"}• في حالة إلغاء الحجز أو
                                        عدم الحضور، يمكنك إعادة التسجيل أو إحضار
                                        السند لاسترجاع المبلغ
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
                            onPress={handleSubmit(onSubmit, onError)}
                            disabled={isPending}
                            className={`mt-6 h-14 items-center justify-center rounded-2xl shadow-md ${
                                isPending ? "bg-main/60" : "bg-main"
                            } active:opacity-90`}>
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
                </View>
            </ScrollView>

            {/* مودال النجاح */}
            <SuccessModal
                visible={showSuccessModal}
                onViewAppointments={handleViewAppointments}
                onGoBack={handleGoBack}
                isDark={isDark}
            />
        </SafeAreaView>
    );
};

export default AppointmentBookingScreen;
