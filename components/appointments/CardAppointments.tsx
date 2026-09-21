import images from "@/constants/images";
import {useThemeStore} from "@/store/theme.store";
import {Appointment} from "@/validation/appointments/schemas/appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    ImageSourcePropType,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";
import PaymentReceiptModal from "./PaymentReceiptModal";
import EditAppointmentModal from "./EditAppointmentModal";
import {useDoctorSchedule} from "@/hooks/doctorSchedules/useDoctorSchedule";
import {useCancelAppointment} from "@/hooks/appointments/useCancelAppointment";

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

export interface CardAppointmentsProps {
    appointment: Appointment;
    className?: string;
    actionArea?: React.ReactNode;
    onPress?: () => void;
}

const getDoctorImage = (appointment: Appointment): ImageSourcePropType => {
    const doctor = appointment.doctor_schedule?.doctor;

    if (doctor?.path_image && doctor.path_image.trim().length > 0) {
        return {
            uri: doctor.path_image,
        };
    }

    if (appointment.patient_gender === "أنثى") {
        return images.femaleDoctor;
    }

    return images.maleDoctor;
};

const CardAppointments: React.FC<CardAppointmentsProps> = ({
    appointment,
    className = "",
    actionArea,
    onPress,
}) => {
    const {isDark} = useThemeStore();
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const cancelMutation = useCancelAppointment();

    const doctorId =
        appointment.doctor_schedule?.doctor_id ||
        appointment.doctor_id ||
        0;

    const directSchedule = appointment.doctor_schedule;
    const hasDirectSchedule = !!(
        directSchedule?.day_of_week || directSchedule?.shift_type
    );

    const { data: scheduleQueryData } = useDoctorSchedule(
        !hasDirectSchedule && !!doctorId ? doctorId : 0
    );

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

    const scheduleTitle =
        dayOfWeek && shiftType
            ? `${dayOfWeek} - ${shiftType}`
            : dayOfWeek || shiftType || "";

    const scheduleTime =
        activeSchedule?.start_time && activeSchedule?.end_time
            ? `${activeSchedule.start_time.slice(0, 5)} - ${activeSchedule.end_time.slice(0, 5)}`
            : "";

    const handleConfirmCancel = () => {
        cancelMutation.mutate(appointment.appointment_id, {
            onSuccess: () => {
                setShowCancelConfirm(false);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return {
                    label: "مؤكد ومقبول",
                    icon: "checkmark-circle" as const,
                    bgClass: isDark
                        ? "bg-emerald-950/60 border-emerald-800/80"
                        : "bg-emerald-50 border-emerald-200",
                    textClass: isDark ? "text-emerald-400" : "text-emerald-700",
                    iconColor: "#10b981",
                };
            case "pending":
                return {
                    label: "قيد المراجعة",
                    icon: "time" as const,
                    bgClass: isDark
                        ? "bg-amber-950/60 border-amber-800/80"
                        : "bg-amber-50 border-amber-200",
                    textClass: isDark ? "text-amber-400" : "text-amber-700",
                    iconColor: "#f59e0b",
                };
            case "rejected":
                return {
                    label: "مرفوض",
                    icon: "close-circle" as const,
                    bgClass: isDark
                        ? "bg-red-950/60 border-red-800/80"
                        : "bg-red-50 border-red-200",
                    textClass: isDark ? "text-red-400" : "text-red-700",
                    iconColor: "#ef4444",
                };
            case "cancelled":
                return {
                    label: "ملغي",
                    icon: "ban" as const,
                    bgClass: isDark
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-100 border-slate-200",
                    textClass: isDark ? "text-slate-400" : "text-slate-600",
                    iconColor: "#64748b",
                };
            default:
                return {
                    label: status,
                    icon: "help-circle" as const,
                    bgClass: isDark ? "bg-slate-800" : "bg-slate-100",
                    textClass: "text-slate-500",
                    iconColor: "#64748b",
                };
        }
    };

    const statusInfo = getStatusBadge(appointment.status);
    const doctorName =
        appointment.doctor_schedule?.doctor?.full_name || "العيادات التخصصية";
    const doctorImage = getDoctorImage(appointment);

    return (
        <>
            <Pressable
                onPress={onPress}
                disabled={!onPress}
                className={`w-full overflow-hidden rounded-3xl border p-4 shadow-sm mb-4 transition-all ${
                    onPress ? "active:scale-[0.99]" : ""
                } ${
                    isDark
                        ? "border-slate-700/60 bg-slate-800"
                        : "border-slate-200 bg-white"
                } ${className}`}>
                {/* الجزء العلوي: صورة الطبيب / العيادة والمعلومات والحالة */}
                <View className="flex-row-reverse">
                    {/* صورة الطبيب */}
                    <View
                        className={`h-28 w-24 overflow-hidden rounded-2xl ${
                            isDark ? "bg-slate-700" : "bg-slate-100"
                        }`}>
                        <Image
                            source={doctorImage}
                            resizeMode="cover"
                            className="size-full"
                        />
                    </View>

                    {/* تفاصيل الموعد والطبيب */}
                    <View className="mr-3 flex-1">
                        {/* شارة الحالة وتاريخ الحجز */}
                        <View className="flex-row-reverse items-center justify-between">
                            <View
                                className={`flex-row-reverse items-center gap-1.5 rounded-full px-2.5 py-1 border ${statusInfo.bgClass}`}>
                                <Ionicons
                                    name={statusInfo.icon}
                                    size={13}
                                    color={statusInfo.iconColor}
                                />
                                <Text
                                    className={`font-sans-bold text-[11px] ${statusInfo.textClass}`}>
                                    {statusInfo.label}
                                </Text>
                            </View>

                            <Text
                                className={`font-sans-medium text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                #{appointment.appointment_id}
                            </Text>
                        </View>

                        {/* اسم الطبيب */}
                        <Text
                            numberOfLines={1}
                            className={`mt-2 text-right text-base font-sans-bold ${
                                isDark ? "text-slate-100" : "text-slate-900"
                            }`}>
                            {doctorName}
                        </Text>

                        {/* شارة فترة الدوام والشفت */}
                        {scheduleTitle ? (
                            <View className="mt-1 flex-row-reverse items-center gap-1.5 flex-wrap">
                                <View className="flex-row-reverse items-center gap-1 rounded-md bg-main/10 dark:bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/20">
                                    <Ionicons
                                        name="time-outline"
                                        size={12}
                                        color="#10b981"
                                    />
                                    <Text className="font-sans-bold text-[11px] text-main dark:text-emerald-400">
                                        {scheduleTitle}
                                    </Text>
                                    {scheduleTime ? (
                                        <Text className="font-sans-medium text-[10px] text-emerald-700/80 dark:text-emerald-300/80">
                                            ({scheduleTime})
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        ) : null}

                        {/* تاريخ الموعد */}
                        <View className="mt-1 flex-row-reverse items-center gap-1.5">
                            <Ionicons
                                name="calendar-outline"
                                size={13}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                className={`font-sans-medium text-xs ${
                                    isDark ? "text-slate-300" : "text-slate-600"
                                }`}>
                                موعد الحجز: {appointment.appointment_date}
                            </Text>
                        </View>

                        {/* اسم المريض */}
                        <View className="mt-1 flex-row-reverse items-center gap-1.5">
                            <Ionicons
                                name="person-outline"
                                size={13}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                numberOfLines={1}
                                className={`font-sans-medium text-xs mt-1 ${
                                    isDark ? "text-slate-300" : "text-slate-600"
                                }`}>
                                المريض: {appointment.patient_name}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* تفاصيل إضافية: الرسوم والملاحظات */}
                <View className="mt-3.5 pt-3 border-t border-border dark:border-slate-700/60">
                    <View className="flex-row-reverse items-center justify-between">
                        {/* الرسوم الإجمالية */}
                        <View className="flex-row-reverse items-center gap-1.5">
                            <Text
                                className={`font-sans-medium text-xs ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                المبلغ الإجمالي:
                            </Text>
                            <Text className="font-sans-bold text-sm text-main dark:text-emerald-400">
                                {appointment.total_amount ||
                                    appointment.doctor_fee ||
                                    0}{" "}
                                ر.ي
                            </Text>
                        </View>

                        {/* الهاتف */}
                        <View className="flex-row items-center gap-1">
                            <Ionicons
                                name="call-outline"
                                size={13}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                className={`font-sans-medium text-xs mt-1 ${
                                    isDark ? "text-slate-300" : "text-slate-600"
                                }`}>
                                {appointment.patient_phone}
                            </Text>
                        </View>
                    </View>

                    {/* ملاحظات الإدارة إن وجدت */}
                    {appointment.admin_notes ? (
                        <View className="mt-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2.5 flex-row-reverse items-start gap-2">
                            <Ionicons
                                name="alert-circle-outline"
                                size={16}
                                color="#f59e0b"
                            />
                            <Text
                                className="flex-1 font-sans-medium text-xs text-amber-800 dark:text-amber-300 py-0.5"
                                style={{textAlign: "right"}}>
                                ملاحظة الإدارة: {appointment.admin_notes}
                            </Text>
                        </View>
                    ) : null}

                    {/* ملاحظات المريض إن وجدت */}
                    {appointment.notes ? (
                        <View className="mt-2 rounded-2xl bg-slate-100 dark:bg-slate-700/40 p-2.5 flex-row-reverse items-start gap-2">
                            <Ionicons
                                name="document-text-outline"
                                size={15}
                                color={isDark ? "#94a3b8" : "#64748b"}
                            />
                            <Text
                                className="flex-1 font-sans-medium text-xs text-muted-foreground dark:text-slate-300 p-0.5"
                                style={{textAlign: "right"}}>
                                {appointment.notes}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* أزرار الإجراءات */}
                {appointment.payment_receipt ? (
                    <View className="mt-3">
                        <Pressable
                            onPress={() => setIsReceiptOpen(true)}
                            className={`w-full flex-row-reverse items-center justify-center gap-2 rounded-2xl border py-2.5 ${
                                isDark
                                    ? "border-emerald-500/40 bg-emerald-950/30"
                                    : "border-emerald-300 bg-emerald-50/70"
                            }`}>
                            <Ionicons
                                name="receipt-outline"
                                size={16}
                                color="#10b981"
                            />
                            <Text className="font-sans-bold text-xs text-main dark:text-emerald-400">
                                عرض سند الدفع
                            </Text>
                        </Pressable>
                    </View>
                ) : null}

                {/* أزرار الإجراءات الخاصة بالحجز المعلق للمستخدم (تعديل وإلغاء) */}
                {appointment.status === "pending" && !actionArea ? (
                    <View className="mt-3 pt-3 border-t border-border dark:border-slate-700/60 flex-row-reverse items-center gap-2.5">
                        <Pressable
                            onPress={() => setIsEditOpen(true)}
                            className={`flex-1 flex-row-reverse items-center justify-center gap-1.5 rounded-2xl border py-2.5 ${
                                isDark
                                    ? "border-blue-500/40 bg-blue-950/30 active:bg-blue-900/40"
                                    : "border-blue-300 bg-blue-50/80 active:bg-blue-100"
                            }`}>
                            <Ionicons
                                name="create-outline"
                                size={15}
                                color="#3b82f6"
                            />
                            <Text className="font-sans-bold text-xs text-blue-600 dark:text-blue-400">
                                تعديل الحجز
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowCancelConfirm(true)}
                            disabled={cancelMutation.isPending}
                            className={`flex-1 flex-row-reverse items-center justify-center gap-1.5 rounded-2xl border py-2.5 ${
                                isDark
                                    ? "border-red-500/40 bg-red-950/30 active:bg-red-900/40"
                                    : "border-red-200 bg-red-50/80 active:bg-red-100"
                            }`}>
                            <Ionicons
                                name="close-circle-outline"
                                size={15}
                                color="#ef4444"
                            />
                            <Text className="font-sans-bold text-xs text-red-600 dark:text-red-400">
                                إلغاء الحجز
                            </Text>
                        </Pressable>
                    </View>
                ) : null}

                {/* أزرار الإجراءات الخاصة بـ Reception أو مخصصة */}
                {actionArea ? <View className="mt-3">{actionArea}</View> : null}
            </Pressable>

            {/* نافذة عرض سند الدفع (Receipt Modal) */}
            {appointment.payment_receipt ? (
                <PaymentReceiptModal
                    appointment={appointment}
                    isReceiptOpen={isReceiptOpen}
                    setIsReceiptOpen={setIsReceiptOpen}
                />
            ) : null}

            {/* نافذة تعديل الحجز للمستخدم */}
            <EditAppointmentModal
                visible={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                appointment={appointment}
            />

            {/* مودال تأكيد إلغاء الحجز */}
            <Modal
                visible={showCancelConfirm}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCancelConfirm(false)}>
                <View className="flex-1 items-center justify-center bg-black/60 px-5">
                    <View
                        className={`w-full max-w-sm rounded-3xl p-5 border ${
                            isDark
                                ? "border-slate-700 bg-slate-900"
                                : "border-slate-100 bg-white"
                        }`}>
                        <View className="size-12 rounded-full bg-red-500/10 items-center justify-center self-center mb-3">
                            <Ionicons
                                name="warning-outline"
                                size={24}
                                color="#ef4444"
                            />
                        </View>
                        <Text
                            className={`text-center font-sans-bold text-base ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                            تأكيد إلغاء الحجز
                        </Text>
                        <Text className="mt-2 text-center font-sans-medium text-xs text-muted-foreground dark:text-slate-400 leading-6">
                            هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ لا يمكنك
                            التراجع عن الإلغاء بعد تأكيده.
                            {"\n"}في حالة إلغاء الحجز، يمكنك .إعادة التسجيل أو
                            إحضار السند لاسترجاع المبلغ (حافظ على السند)
                        </Text>

                        <View className="mt-5 flex-row-reverse items-center gap-3">
                            <Pressable
                                onPress={handleConfirmCancel}
                                disabled={cancelMutation.isPending}
                                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-red-500 py-3 active:opacity-80">
                                {cancelMutation.isPending ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#ffffff"
                                    />
                                ) : (
                                    <Text className="font-sans-bold text-xs text-white">
                                        نعم، إلغاء الحجز
                                    </Text>
                                )}
                            </Pressable>
                            <Pressable
                                onPress={() => setShowCancelConfirm(false)}
                                disabled={cancelMutation.isPending}
                                className={`flex-1 items-center justify-center rounded-2xl border py-3 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-800"
                                        : "border-slate-200 bg-slate-100"
                                }`}>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        isDark
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    تراجع
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default CardAppointments;

