import { z } from "zod";

export const bookingAppointmentSchema = z.object({
    patient_name: z
        .string("يرجى إدخال اسم المريض الكامل")
        .trim()
        .min(1, "يرجى إدخال اسم المريض الكامل")
        .min(3, "اسم المريض يجب أن يتكون من 3 أحرف على الأقل"),
    patient_phone: z
        .string("يرجى إدخال رقم هاتف المريض")
        .trim()
        .min(1, "يرجى إدخال رقم هاتف المريض")
        .min(9, "يرجى إدخال رقم هاتف صحيح (9 أرقام على الأقل)"),
    patient_age: z
        .string("يرجى إدخال عمر المريض")
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
    schedule_id: z
        .number("يرجى اختيار موعد الدوام")
        .positive("يرجى اختيار موعد الدوام"),
    appointment_date: z
        .string("يرجى اختيار تاريخ الموعد")
        .min(1, "يرجى اختيار تاريخ الموعد"),
    notes: z.string().optional(),
    payment_receipt: z
        .object(
            {
                uri: z.string(),
                name: z.string(),
                type: z.string(),
            },
            {
                error: "يرجى رفع صورة سند الدفع",
            }
        )
        .nullable()
        .refine((val) => val !== null && !!val?.uri, {
            message: "يرجى رفع صورة سند الدفع",
        }),
});

export type BookingAppointmentFormValues = z.infer<
    typeof bookingAppointmentSchema
>;
