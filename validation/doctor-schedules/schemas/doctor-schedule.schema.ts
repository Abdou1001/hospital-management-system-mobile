import { z } from "zod";

import { STATUS } from "@/types/enums";
import { paginationSchema } from "@/validation/paginationSchema";

/* ==========================================
   Create
========================================== */
export const createDoctorScheduleSchema = z.object({
    doctor_id: z.number(),

    day_of_week: z.string(),

    shift_type: z.string(),

    start_time: z.string(),

    end_time: z.string(),

    max_patients: z.number(),

    status: z.enum(STATUS),

    notes: z.string().optional(),
});

export type CreateDoctorSchedule = z.infer<
    typeof createDoctorScheduleSchema
>;

/* ==========================================
   Update
========================================== */
export const updateDoctorScheduleSchema =
    createDoctorScheduleSchema;

export type UpdateDoctorSchedule = z.infer<
    typeof updateDoctorScheduleSchema
>;

/* ==========================================
   Response
========================================== */
export const doctorScheduleSchema =
    createDoctorScheduleSchema.extend({
        schedule_id: z.number(),
    });

export type DoctorSchedule = z.infer<
    typeof doctorScheduleSchema
>;

/* ==========================================
   Get All Response
========================================== */
export const doctorSchedulesResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    pagination: paginationSchema,

    results: z.array(doctorScheduleSchema),

    count: z.number().optional(),
});

export type DoctorSchedulesResponse = z.infer<
    typeof doctorSchedulesResponseSchema
>;

/* ==========================================
   Get One Response
========================================== */
export const doctorScheduleResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    results: doctorScheduleSchema,
});

export type DoctorScheduleResponse = z.infer<
    typeof doctorScheduleResponseSchema
>;