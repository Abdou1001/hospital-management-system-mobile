import { z } from "zod";
import { GENDER } from "@/types/enums";

export const registerSchema = z
    .object({
        full_name: z
            .string()
            .trim()
            .min(3, "الاسم الكامل يجب أن يتكون من 3 أحرف على الأقل"),
        phone_number: z
            .string()
            .trim()
            .min(9, "رقم الهاتف يجب أن يتكون من 9 أرقام على الأقل")
            .regex(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
        email: z
            .string()
            .trim()
            .refine(
                (val) => val === "" || z.string().email().safeParse(val).success,
                {
                    message: "يرجى إدخال بريد إلكتروني صحيح أو تركه فارغاً",
                }
            ),
        date_of_birth: z
            .string()
            .trim()
            .min(1, "تاريخ الميلاد مطلوب"),
        gender: z.enum(GENDER, {
            message: "يرجى اختيار النوع (ذكر / أنثى)",
        }),
        password: z
            .string()
            .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
        confirmPassword: z
            .string()
            .min(6, "تأكيد كلمة المرور مطلوب"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "كلمات المرور غير متطابقة",
        path: ["confirmPassword"],
    });

export type RegisterSchema = z.infer<typeof registerSchema>;
