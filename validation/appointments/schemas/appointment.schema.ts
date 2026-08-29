import {z} from "zod";

import {APPOINTMENT_STATUS, GENDER} from "@/types/enums";
import {paginationSchema} from "@/validation/paginationSchema";

// =========================
// Doctor
// =========================

export const appointmentDoctorSchema = z.object({
    doctor_id: z.number(),
    full_name: z.string(),
    path_image: z.string().url(),
});

// =========================
// Doctor Schedule
// =========================

export const appointmentDoctorScheduleSchema = z.object({
    doctor: appointmentDoctorSchema,
    doctor_id: z.number(),
    schedule_id: z.number(),
});

// =========================
// User
// =========================

export const appointmentUserSchema = z.object({
    user_id: z.number(),
    full_name: z.string(),
    email: z.email(),
    phone_number: z.string(),
    gender: z.enum(GENDER),
    date_of_birth: z.string().nullable(),
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

    patient_age: z.number(),

    patient_gender: z.enum(GENDER),

    notes: z.string().nullable(),

    payment_receipt: z.string().url().nullable(),

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
