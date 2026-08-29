import {z} from "zod";

import {GENDER, STATUS} from "@/types/enums";

/* ============================================================
   Doctor Schedule Form
============================================================ */

export const doctorScheduleFormSchema = z.object({
    schedule_id: z.number().nullable().optional(),

    day_of_week: z.string(),

    shift_type: z.string(),

    start_time: z
        .string("وقت بداية الدوام مطلوب")
        .regex(
            /^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/,
            "صيغة وقت البداية غير صحيحة",
        ),

    end_time: z
        .string("وقت نهاية الدوام مطلوب")
        .regex(
            /^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/,
            "صيغة وقت النهاية غير صحيحة",
        ),

    max_patients: z
        .number("الحد الأقصى للمرضى مطلوب")
        .int("يجب أن يكون عدداً صحيحاً")
        .min(5, "الحد الأدنى خمسة مرضة")
        .max(100, "الحد الأقصى غير منطقي"),

    status: z.enum(STATUS),

    notes: z.string().optional(),
});

/* ============================================================
   Doctor Form Schema
============================================================ */

export const doctorFormSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(3, "اسم الطبيب يجب أن يكون 3 أحرف على الأقل")
        .max(100),

    bio: z.string("الوصف مطلوب").trim().max(500),

    education: z.string().trim().max(255).optional(),

    gender: z.enum(GENDER),

    department_ids: z
        .array(z.number())
        .min(1, "اختر قسمًا واحدًا على الأقل")
        .optional(),

    email: z
        .union([z.literal(""), z.string().email("البريد الإلكتروني غير صالح")])
        .optional(),

    phone_number: z.string().trim().max(20).optional(),

    years_exper: z.number().min(0).optional(),

    consultation_fee: z.number().min(1000).max(50000),

    notes: z.string().optional(),

    path_image: z.instanceof(File).optional(),

    /* ===============================
       الدوامات
    =============================== */

    schedules: z.array(doctorScheduleFormSchema),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
