import {z} from "zod";
import {GENDER} from "@/types/enums";

export const updateMyProfileSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(3, "الاسم قصير جدًا")
        .max(50, "الاسم طويل جدًا"),

    email: z
        .string()
        .trim()
        .email("البريد الإلكتروني غير صالح")
        .optional()
        .or(z.literal("")),

    gender: z.enum(GENDER),

    date_of_birth: z
        .date("تاريخ الميلاد غير صالح")
        .refine(
            (date) => date <= new Date(),
            "لا يمكن أن يكون تاريخ الميلاد في المستقبل",
        ),
});

export type UpdateMyProfileSchema = z.infer<typeof updateMyProfileSchema>;
