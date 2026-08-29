import {z} from "zod";

import {GENDER, STATUS} from "@/types/enums";
import {paginationSchema} from "@/validation/paginationSchema";

export const departmentSchema = z.object({
    depart_id: z.number(),
    depart_name: z.string(),
    path_image: z.string().nullable(),
});

export const doctorDepartmentSchema = z.object({
    doctor_deprtment_id: z.number(),
    department: departmentSchema,
});

export const doctorScheduleSchema = z.object({
    schedule_id: z.number(),

    day_of_week: z.string(),

    shift_type: z.string(),

    start_time: z.string(),

    end_time: z.string(),

    status: z.enum(STATUS),

    max_patients: z.number(),

    notes: z.string().nullable().optional(),
});

export const doctorSchema = z.object({
    doctor_id: z.number(),

    full_name: z.string(),

    email: z
        .union([z.literal(""), z.string().email("البريد الإلكتروني غير صالح")])
        .optional(),

    bio: z.string().nullable(),

    education: z.string().nullable(),

    gender: z.enum(GENDER),

    years_exper: z.number(),

    phone_number: z.string().nullable(),

    path_image: z.string().nullable(),

    notes: z.string().nullable(),

    status: z.enum(STATUS),

    consultation_fee: z.number(),

    is_hidden: z.boolean(),

    doctor_department: z.array(doctorDepartmentSchema),

    doctor_schedule: z.array(doctorScheduleSchema),

    created_at: z.string().optional(),
});

export type Doctor = z.infer<typeof doctorSchema>;

export const doctorsResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    pagination: paginationSchema,

    results: z.array(doctorSchema),
});

export type DoctorsResponse = z.infer<typeof doctorsResponseSchema>;

export const doctorResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    results: doctorSchema,
});

export type DoctorResponse = z.infer<typeof doctorResponseSchema>;
