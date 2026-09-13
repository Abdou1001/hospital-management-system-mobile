import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import ExpandableModal from "@/components/ui/ExpandableModal";
import PatientInfoForm from "@/components/appointments/booking/PatientInfoForm";
import SchedulePicker from "@/components/appointments/booking/SchedulePicker";
import AppointmentCalendar from "@/components/appointments/booking/AppointmentCalendar";
import PaymentReceiptUploader from "@/components/appointments/booking/PaymentReceiptUploader";
import { useThemeStore } from "@/store/theme.store";
import { Appointment } from "@/validation/appointments/schemas/appointment.schema";
import { useDoctorSchedulesByDoctor } from "@/hooks/doctorSchedules/useDoctorSchedulesByDoctor";
import { useUpdateAppointment } from "@/hooks/appointments/useUpdateAppointment";

const editFormSchema = z.object({
    patient_name: z
        .string()
        .trim()
        .min(1, "يرجى إدخال اسم المريض الكامل")
        .min(3, "اسم المريض يجب أن يتكون من 3 أحرف على الأقل"),
    patient_phone: z
        .string()
        .trim()
        .min(1, "يرجى إدخال رقم هاتف المريض")
        .min(9, "يرجى إدخال رقم هاتف صحيح (9 أرقام على الأقل)"),
    patient_age: z
        .string()
        .trim()
        .min(1, "يرجى إدخال عمر المريض")
        .refine(
            (val) =>
                !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 120,
            { message: "يرجى إدخال عمر صحيح بين 1 و 120" }
        ),
    patient_gender: z.enum(["ذكر", "أنثى"], {
        error: "يرجى اختيار جنس المريض",
    }),
    schedule_id: z.number({
        error: "يرجى اختيار موعد الدوام",
    }),
    appointment_date: z.string().min(1, "يرجى اختيار تاريخ الموعد"),
    notes: z.string().optional(),
    payment_receipt: z
        .object({
            uri: z.string(),
            name: z.string(),
            type: z.string(),
        })
        .nullable()
        .optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface EditAppointmentModalProps {
    visible: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
    visible,
    onClose,
    appointment,
}) => {
    const { isDark } = useThemeStore();
    const updateMutation = useUpdateAppointment();

    const doctorId =
        appointment?.doctor_id ||
        appointment?.doctor_schedule?.doctor_id ||
        0;

    const { data: schedulesData, isLoading: isSchedulesLoading } =
        useDoctorSchedulesByDoctor(visible && !!appointment ? doctorId : 0);

    const schedules = useMemo(
        () => schedulesData?.results ?? [],
        [schedulesData?.results]
    );

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            patient_name: "",
            patient_phone: "",
            patient_age: "",
            patient_gender: "ذكر",
            notes: "",
            schedule_id: undefined as any,
            appointment_date: "",
            payment_receipt: null,
        },
    });

    useEffect(() => {
        if (appointment && visible) {
            reset({
                patient_name: appointment.patient_name || "",
                patient_phone: appointment.patient_phone || "",
                patient_age: appointment.patient_age
                    ? String(appointment.patient_age)
                    : "",
                patient_gender:
                    (appointment.patient_gender as "ذكر" | "أنثى") || "ذكر",
                schedule_id: appointment.schedule_id || undefined as any,
                appointment_date: appointment.appointment_date || "",
                notes: appointment.notes || "",
                payment_receipt: null,
            });
        }
    }, [appointment, visible, reset]);

    const handleSelectSchedule = (schedId: number) => {
        setValue("schedule_id", schedId, { shouldValidate: true });
        setValue("appointment_date", "", { shouldValidate: true });
    };

    const handleSelectDate = (date: string) => {
        setValue("appointment_date", date, { shouldValidate: true });
    };

    const handleSelectPaymentImage = (
        img: { uri: string; name: string; type: string } | null
    ) => {
        setValue("payment_receipt", img, { shouldValidate: true });
    };

    const onSubmit = (data: EditFormValues) => {
        if (!appointment) return;
        Keyboard.dismiss();

        updateMutation.mutate(
            {
                id: appointment.appointment_id,
                payload: {
                    patient_name: data.patient_name,
                    patient_phone: data.patient_phone,
                    patient_age: Number(data.patient_age),
                    patient_gender: data.patient_gender,
                    schedule_id: data.schedule_id,
                    appointment_date: data.appointment_date,
                    notes: data.notes || undefined,
                    payment_receipt: data.payment_receipt || undefined,
                },
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    if (!appointment) return null;

    return (
        <ExpandableModal
            visible={visible}
            onClose={() => {
                if (!updateMutation.isPending) onClose();
            }}
            title="تعديل الحجز"
            subtitle={`طلب حجز رقم #${appointment.appointment_id}`}
            iconName="create-outline"
            iconColor="#3b82f6"
            iconBgClass="bg-blue-500/15">
            <View className="p-4 space-y-4 pb-30">
                {/* تنبيه الحالة المعلقة */}
                <View className="flex-row-reverse items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 mb-2">
                    <Ionicons name="information-circle" size={20} color="#f59e0b" />
                    <Text className="flex-1 font-sans-medium text-xs text-amber-800 dark:text-amber-300 text-right leading-5">
                        يمكنك تعديل بيانات الحجز أو تغيير موعد الدوام طالما أن الحجز لا يزال قيد المراجعة.
                    </Text>
                </View>

                {/* بيانات المريض */}
                <PatientInfoForm
                    control={control as any}
                    errors={errors as any}
                    isDark={isDark}
                />

                {/* اختيار الدوام */}
                <SchedulePicker
                    schedules={schedules}
                    isLoading={isSchedulesLoading}
                    control={control as any}
                    onSelectSchedule={handleSelectSchedule}
                    errorMessage={errors.schedule_id?.message}
                    isDark={isDark}
                />

                {/* اختيار التاريخ */}
                <AppointmentCalendar
                    schedules={schedules}
                    control={control as any}
                    onSelectDate={handleSelectDate}
                    errorMessage={errors.appointment_date?.message}
                    isDark={isDark}
                />

                {/* سند الدفع (اختياري عند التعديل) */}
                <View className="mt-4">
                    <Text
                        className={`mb-2 font-sans-bold text-sm ${
                            isDark ? "text-slate-200" : "text-slate-700"
                        }`}
                        style={{ textAlign: "right" }}>
                        سند الدفع المرفق (اختياري للاستبدال)
                    </Text>
                    {appointment.payment_receipt ? (
                        <View className="mb-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex-row-reverse items-center justify-between">
                            <Text className="font-sans-medium text-xs text-slate-600 dark:text-slate-300">
                                يوجد سند دفع مرفق بالفعل مسبقاً
                            </Text>
                            <Image
                                source={{ uri: appointment.payment_receipt }}
                                className="size-12 rounded-xl"
                                resizeMode="cover"
                            />
                        </View>
                    ) : null}

                    <PaymentReceiptUploader
                        control={control as any}
                        onSelectImage={handleSelectPaymentImage}
                        errorMessage={errors.payment_receipt?.message}
                        isDark={isDark}
                    />
                </View>

                {/* أزرار الحفظ والإلغاء */}
                <View className="mt-6 flex-row-reverse items-center gap-3">
                    <Pressable
                        onPress={handleSubmit(onSubmit)}
                        disabled={updateMutation.isPending}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-main py-3.5 shadow-sm active:opacity-80">
                        {updateMutation.isPending ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <Ionicons
                                    name="checkmark-done"
                                    size={18}
                                    color="#ffffff"
                                />
                                <Text className="font-sans-bold text-sm text-white">
                                    حفظ التعديلات
                                </Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={onClose}
                        disabled={updateMutation.isPending}
                        className={`rounded-2xl border px-5 py-3.5 ${
                            isDark
                                ? "border-slate-700 bg-slate-800 text-white"
                                : "border-slate-200 bg-slate-100"
                        }`}>
                        <Text
                            className={`font-sans-bold text-sm ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                            إلغاء
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ExpandableModal>
    );
};

export default EditAppointmentModal;
