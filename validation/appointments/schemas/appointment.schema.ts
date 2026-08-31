import {z} from "zod";

import {APPOINTMENT_STATUS, GENDER} from "@/types/enums";
import {paginationSchema} from "@/validation/paginationSchema";

// =========================
// Doctor
// =========================

export const appointmentDoctorSchema = z.object({
    doctor_id: z.number(),
    full_name: z.string(),
    path_image: z.string().nullable().optional(),
});

// =========================
// Doctor Schedule
// =========================

export const appointmentDoctorScheduleSchema = z.object({
    doctor: appointmentDoctorSchema.nullable().optional(),
    doctor_id: z.number().nullable().optional(),
    schedule_id: z.number().nullable().optional(),
});

// =========================
// User
// =========================

export const appointmentUserSchema = z.object({
    user_id: z.number(),
    full_name: z.string(),
    email: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    gender: z.enum(GENDER).nullable().optional(),
    date_of_birth: z.string().nullable().optional(),
});

// =========================
// Appointment
// =========================

export const appointmentSchema = z.object({
    appointment_id: z.number(),

    user_id: z.number(),

    doctor_id: z.number().nullable(),

    schedule_id: z.number().nullable(),

    patient_name: z.string(),

    patient_phone: z.string(),

    patient_age: z.number().nullable().optional(),

    patient_gender: z.enum(GENDER).nullable().optional(),

    notes: z.string().nullable(),

    payment_receipt: z.string().nullable().optional(),

    appointment_date: z.string(),

    status: z.enum(APPOINTMENT_STATUS),

    admin_notes: z.string().nullable(),

    created_at: z.string(),

    doctor_fee: z.number(),

    platform_fee: z.number(),

    total_amount: z.number(),

    doctor_schedule: appointmentDoctorScheduleSchema.nullable(),

    user: appointmentUserSchema,
});

// =========================
// Response
// =========================

export const appointmentsResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    pagination: paginationSchema,

    results: z.array(appointmentSchema),
});

// =========================
// Types
// =========================

export type AppointmentDoctor = z.infer<typeof appointmentDoctorSchema>;

export type AppointmentDoctorSchedule = z.infer<
    typeof appointmentDoctorScheduleSchema
>;

export type AppointmentUser = z.infer<typeof appointmentUserSchema>;

export type Appointment = z.infer<typeof appointmentSchema>;

export type AppointmentsResponse = z.infer<typeof appointmentsResponseSchema>;
