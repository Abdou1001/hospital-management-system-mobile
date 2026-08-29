import {z} from "zod";
import {GENDER} from "@/types/enums";

export const updateAppointmentSchema = z.object({
    patient_name: z.string().trim().min(3).max(100),

    patient_phone: z.string().trim().min(9).max(15),

    patient_age: z.coerce.number().int().min(1).max(120),

    patient_gender: z.enum(GENDER),

    appointment_date: z.string(),

    notes: z.string().optional(),

    payment_receipt: z.any().optional(),
});

export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;
