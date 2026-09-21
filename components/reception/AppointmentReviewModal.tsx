import PaymentReceiptModal from "@/components/appointments/PaymentReceiptModal";
import ExpandableModal from "@/components/ui/ExpandableModal";
import images from "@/constants/images";
import {useDoctorSchedule} from "@/hooks/doctorSchedules/useDoctorSchedule";
import {useThemeStore} from "@/store/theme.store";
import {Appointment} from "@/validation/appointments/schemas/appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

function getDayNameFromDate(dateString?: string): string {
    if (!dateString) return "";
    try {
        const [year, month, day] = dateString.split("-").map(Number);
        if (!year || !month || !day) return "";
        const date = new Date(year, month - 1, day);
        const dayNames = [
            "الاحد",
            "الاثنين",
            "الثلاثاء",
            "الاربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
        ];
        return dayNames[date.getDay()] || "";
    } catch {
        return "";
    }
}

interface AppointmentReviewModalProps {
    visible: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onAccept: (adminNotes?: string) => void;
    onOpenReject: () => void;
    isSubmitting: boolean;
}

const AppointmentReviewModal: React.FC<AppointmentReviewModalProps> = ({
    visible,
    onClose,
    appointment,
    onAccept,
    onOpenReject,
    isSubmitting,
}) => {
    const {isDark} = useThemeStore();
    const [adminNotes, setAdminNotes] = useState("");
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const doctor_id = appointment?.doctor_schedule?.doctor_id || 0;

    const directSchedule = appointment?.doctor_schedule;
    const hasDirectSchedule = !!(
        directSchedule?.day_of_week || directSchedule?.shift_type
    );

    // Fetch schedule if not already present in appointment
    const {data: scheduleQueryData, isLoading: isScheduleLoading} =
        useDoctorSchedule(
            visible && !!appointment && !hasDirectSchedule && !!doctor_id
                ? doctor_id
                : 0,
        );

    if (!appointment) return null;

    const schedulesList: any[] = Array.isArray(scheduleQueryData?.results)
        ? scheduleQueryData.results
        : scheduleQueryData?.results
        ? [scheduleQueryData.results]
        : [];

    const targetScheduleId =
        appointment.schedule_id || appointment.doctor_schedule?.schedule_id;

    const activeSchedule = hasDirectSchedule
        ? directSchedule
        : schedulesList.find((s) => s.schedule_id === targetScheduleId) ||
          directSchedule ||
          null;

    const dayOfWeek =
        activeSchedule?.day_of_week ||
        getDayNameFromDate(appointment.appointment_date);

    const shiftType = activeSchedule?.shift_type;

    // Display title e.g. "السبت - فترة صباحية"
    const scheduleTitle =
        dayOfWeek && shiftType
            ? `${dayOfWeek} - ${shiftType}`
            : dayOfWeek || shiftType || "";

    // Timing e.g. "09:00 - 12:00"
    const scheduleTime =
        activeSchedule?.start_time && activeSchedule?.end_time
            ? `${activeSchedule.start_time.slice(0, 5)} - ${activeSchedule.end_time.slice(0, 5)}`
            : "";

    const doctor = appointment.doctor_schedule?.doctor;
    const doctorName = doctor?.full_name || "العيادات التخصصية";
    const doctorImage = doctor?.path_image
        ? {uri: doctor.path_image}
        : appointment.patient_gender === "أنثى"
          ? images.femaleDoctor
          : images.maleDoctor;

    const handleAccept = () => {
        onAccept(adminNotes.trim() ? adminNotes.trim() : undefined);
    };

    return (
        <>
            <ExpandableModal
                visible={visible}
                onClose={() => {
                    if (isReceiptOpen) {
                        setIsReceiptOpen(false);
                        return;
                    }
                    if (!isSubmitting) onClose();
                }}
                title="مراجعة طلب الحجز"
                subtitle={`حجز رقم #${appointment.appointment_id} - قيد المراجعة`}
                iconName="clipboard-outline"
                iconColor="#10b981"
                iconBgClass="bg-main/15"
                overlay={
                    appointment.payment_receipt ? (
                        <PaymentReceiptModal
                            appointment={appointment}
                            isReceiptOpen={isReceiptOpen}
                            setIsReceiptOpen={setIsReceiptOpen}
                            inModal
                        />
                    ) : null
                }>
                <View className="p-4 space-y-4">
                    {/* بطاقة معلومات المريض */}
                    <View
                        className={`rounded-2xl border p-3.5 ${
                            isDark
                                ? "border-slate-700/80 bg-slate-800/80"
                                : "border-slate-200/80 bg-slate-50"
                        }`}>
                        <View className="flex-row-reverse items-center justify-between border-b border-border/60 pb-2 mb-2.5">
                            <View className="flex-row-reverse items-center gap-1.5">
                                <Ionicons
                                    name="person"
                                    size={15}
                                    color="#10b981"
                                />
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                    بيانات المريض
                                </Text>
                            </View>
                            <Text
                                className={`font-sans-medium text-[11px] ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                #{appointment.appointment_id}
                            </Text>
                        </View>

                        <View className="grid grid-cols-2 gap-2 text-right">
                            {/* الاسم */}
                            <View className="flex-row-reverse items-center justify-between py-1">
                                <Text
                                    className={`font-sans-medium text-xs ${
                                        isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}>
                                    الاسم:
                                </Text>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        isDark
                                            ? "text-slate-100"
                                            : "text-slate-800"
                                    }`}>
                                    {appointment.patient_name}
                                </Text>
                            </View>

                            {/* رقم الهاتف */}
                            <View className="flex-row-reverse items-center justify-between py-1">
                                <Text
                                    className={`font-sans-medium text-xs ${
                                        isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}>
                                    الهاتف:
                                </Text>
                                <Text
                                    className={`font-sans-bold text-sm text-main ${
                                        isDark
                                            ? "text-emerald-400"
                                            : "text-emerald-600"
                                    }`}>
                                    {appointment.patient_phone}
                                </Text>
                            </View>

                            {/* العمر والجنس */}
                            <View className="flex-row-reverse items-center justify-between py-1">
                                <Text
                                    className={`font-sans-medium text-xs ${
                                        isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}>
                                    العمر / الجنس:
                                </Text>
                                <Text
                                    className={`font-sans-bold text-sm ${
                                        isDark
                                            ? "text-slate-100"
                                            : "text-slate-800"
                                    }`}>
                                    {appointment.patient_age} سنة /{" "}
                                    {appointment.patient_gender}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* بطاقة تفاصيل الموعد والطبيب */}
                    <View
                        className={`mt-3 rounded-2xl border p-3.5 ${
                            isDark
                                ? "border-slate-700/80 bg-slate-800/80"
                                : "border-slate-200/80 bg-slate-50"
                        }`}>
                        <View className="flex-row-reverse items-center gap-1.5 border-b border-border/60 pb-2 mb-2.5">
                            <Ionicons
                                name="calendar"
                                size={15}
                                color="#3b82f6"
                            />
                            <Text
                                className={`font-sans-bold text-xs ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                تفاصيل الموعد والعيادة
                            </Text>
                        </View>

                        <View className="flex-row-reverse items-center gap-3">
                            <Image
                                source={doctorImage}
                                resizeMode="cover"
                                className="size-14 rounded-2xl"
                            />
                            <View className="flex-1 text-right">
                                <Text
                                    className={`font-sans-bold text-sm text-right ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}>
                                    {doctorName}
                                </Text>

                                {/* دوام وشفت الحجز */}
                                {isScheduleLoading ? (
                                    <Text className="font-sans-medium text-xs text-slate-400 text-right mt-1">
                                        جاري جلب بيانات الدوام...
                                    </Text>
                                ) : scheduleTitle ? (
                                    <View className="mt-1.5 flex-row-reverse items-center gap-1.5 flex-wrap">
                                        <View className="flex-row-reverse items-center gap-1 rounded-lg bg-main/10 dark:bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/20">
                                            <Ionicons
                                                name="time-outline"
                                                size={13}
                                                color="#10b981"
                                            />
                                            <Text className="font-sans-bold text-xs text-main dark:text-emerald-400">
                                                {scheduleTitle}
                                            </Text>
                                            {scheduleTime ? (
                                                <Text className="font-sans-medium text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                                                    ({scheduleTime})
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                ) : null}

                                {/* تاريخ الموعد تحت الدوام */}
                                <View className="mt-1 flex-row-reverse items-center gap-1.5">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={13}
                                        color={isDark ? "#94a3b8" : "#64748b"}
                                    />
                                    <Text
                                        className={`font-sans-medium text-xs text-right ${
                                            isDark
                                                ? "text-slate-300"
                                                : "text-slate-600"
                                        }`}>
                                        تاريخ الموعد:{" "}
                                        {appointment.appointment_date}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ملاحظات الدوام إذا وجدت */}
                        {activeSchedule?.notes ? (
                            <View className="mt-2.5 pt-2 border-t border-border/50 flex-row-reverse items-center gap-1.5">
                                <Ionicons
                                    name="information-circle-outline"
                                    size={14}
                                    color="#f59e0b"
                                />
                                <Text
                                    className={`font-sans-medium text-xs text-right ${
                                        isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}>
                                    ملاحظة الدوام: {activeSchedule.notes}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {/* الرسوم وسند الدفع */}
                    <View
                        className={`mt-3 rounded-2xl border p-3.5 ${
                            isDark
                                ? "border-slate-700/80 bg-slate-800/80"
                                : "border-slate-200/80 bg-slate-50"
                        }`}>
                        <View className="flex-row-reverse items-center justify-between">
                            <Text
                                className={`font-sans-medium text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                إجمالي المبلغ المطلوب:
                            </Text>
                            <Text className="font-sans-bold text-base text-main dark:text-emerald-400">
                                {appointment.total_amount ||
                                    appointment.doctor_fee ||
                                    0}{" "}
                                ر.ي
                            </Text>
                        </View>

                        {appointment.payment_receipt ? (
                            <Pressable
                                onPress={() => setIsReceiptOpen(true)}
                                className={`mt-2.5 flex-row-reverse items-center justify-center gap-2 rounded-xl border py-2 ${
                                    isDark
                                        ? "border-emerald-500/40 bg-emerald-950/30 active:bg-emerald-900/40"
                                        : "border-emerald-300 bg-emerald-50 active:bg-emerald-100"
                                }`}>
                                <Ionicons
                                    name="receipt-outline"
                                    size={15}
                                    color="#10b981"
                                />
                                <Text className="font-sans-bold text-xs text-main dark:text-emerald-400">
                                    معاينة سند الدفع المرفق
                                </Text>
                            </Pressable>
                        ) : (
                            <Text
                                className={`mt-1 text-right font-sans-medium text-[11px] ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                الدفع عند الحضور (لا يوجد سند مرفق)
                            </Text>
                        )}
                    </View>

                    {/* ملاحظات المريض إن وجدت */}
                    {appointment.notes ? (
                        <View className="mt-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
                            <Text className="font-sans-bold text-xs text-amber-800 dark:text-amber-300 text-right mb-1">
                                ملاحظات المريض:
                            </Text>
                            <Text className="font-sans-medium text-xs text-amber-700 dark:text-amber-200 text-right leading-5">
                                {appointment.notes}
                            </Text>
                        </View>
                    ) : null}

                    {/* حقل ملاحظات إدارية اختيارية */}
                    <View className="mt-3">
                        <Text
                            className={`text-right font-sans-medium text-xs mb-1.5 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                            ملاحظة إدارية (اختيارية):
                        </Text>
                        <TextInput
                            value={adminNotes}
                            onChangeText={setAdminNotes}
                            placeholder="أضف ملاحظة للمريض أو السجل..."
                            placeholderTextColor={
                                isDark ? "#64748b" : "#94a3b8"
                            }
                            textAlign="right"
                            style={{textAlign: "right"}}
                            className={`w-full rounded-xl border px-3 py-2 font-sans-medium text-xs ${
                                isDark
                                    ? "bg-slate-800 border-slate-700 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-900"
                            }`}
                        />
                    </View>

                    {/* أزرار الإجراء: قبول / رفض */}
                    <View className="mt-5 flex-row-reverse items-center gap-3">
                        {/* زر قبول الحجز */}
                        <Pressable
                            onPress={handleAccept}
                            disabled={isSubmitting}
                            className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5 bg-main ${
                                isSubmitting
                                    ? "opacity-60"
                                    : "active:opacity-85 shadow-sm shadow-emerald-900/20"
                            }`}>
                            {isSubmitting ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={18}
                                        color="#ffffff"
                                    />
                                    <Text className="font-sans-bold text-sm text-white">
                                        قبول الحجز
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        {/* زر رفض الحجز */}
                        <Pressable
                            onPress={onOpenReject}
                            disabled={isSubmitting}
                            className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5 border border-red-500/50 ${
                                isDark
                                    ? "bg-red-500/10 active:bg-red-500/20"
                                    : "bg-red-50 active:bg-red-100"
                            }`}>
                            <Ionicons
                                name="close-circle"
                                size={18}
                                color="#ef4444"
                            />
                            <Text className="font-sans-bold text-sm text-red-500">
                                رفض الحجز
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ExpandableModal>
        </>
    );
};

export default AppointmentReviewModal;
