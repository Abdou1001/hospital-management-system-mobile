import {z} from "zod";
import {GENDER} from "@/types/enums";

export const updateDoctorSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(3, "اسم الطبيب يجب أن يكون 3 أحرف على الأقل")
        .max(100, "اسم الطبيب طويل جدًا"),

    bio: z.string().trim().min(3, "النبذة مطلوبة").max(500).optional(),

    education: z
        .string()
        .trim()
        .min(3, "المؤهل العلمي مطلوب")
        .max(255)
        .optional(),

    gender: z.enum(GENDER),

    department_ids: z.array(z.number()).min(1, "يجب اختيار قسم واحد على الأقل"),

    email: z
        .union([
            z.literal(""),
            z.string().email("البريد الإلكتروني غير صالح").trim(),
        ])
        .optional(),

    phone_number: z
        .string()
        .trim()
        .min(7, "رقم الهاتف غير صالح")
        .max(20)
        .optional(),

    years_exper: z.coerce
        .number()
        .int()
        .min(0, "سنوات الخبرة غير صحيحة")
        .optional(),

    consultation_fee: z.coerce.number().min(0, "رسوم الكشف غير صحيحة"),

    notes: z.string().trim().max(500).optional(),

    path_image: z
        .instanceof(File, {
            message: "يرجى اختيار صورة الطبيب",
        })
        .optional(),
});

export type UpdateDoctorValues = z.infer<typeof updateDoctorSchema>;
