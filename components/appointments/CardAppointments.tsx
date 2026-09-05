import images from "@/constants/images";
import {useThemeStore} from "@/store/theme.store";
import {Appointment} from "@/validation/appointments/schemas/appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Image, ImageSourcePropType, Pressable, Text, View} from "react-native";
import PaymentReceiptModal from "./PaymentReceiptModal";

export interface CardAppointmentsProps {
    appointment: Appointment;
    className?: string;
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
}) => {
    const {isDark} = useThemeStore();
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

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
            <View
                className={`w-full overflow-hidden rounded-3xl border p-4 shadow-sm mb-4 ${
                    isDark
                        ? "border-slate-700/60 bg-slate-800"
                        : "border-slate-100 bg-white"
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

                        {/* تاريخ الموعد */}
                        <View className="mt-1.5 flex-row-reverse items-center gap-1.5">
                            <Ionicons
                                name="calendar-outline"
                                size={14}
                                color="#10b981"
                            />
                            <Text
                                className={`font-sans-bold text-sm ${
                                    isDark
                                        ? "text-emerald-400"
                                        : "text-emerald-600"
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
            </View>

            {/* نافذة عرض سند الدفع (Receipt Modal) */}
            {appointment.payment_receipt ? (
                <PaymentReceiptModal
                    appointment={appointment}
                    isReceiptOpen={isReceiptOpen}
                    setIsReceiptOpen={setIsReceiptOpen}
                />
            ) : null}
        </>
    );
};

export default CardAppointments;
