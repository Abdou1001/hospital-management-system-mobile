import {z} from "zod";

export const changePhoneSchema = z.object({
    phone_number: z
        .string()
        .trim()
        .regex(/^7\d{8}$/, "رقم الهاتف اليمني غير صالح"),

    password: z.string().min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});

export type ChangePhoneSchema = z.infer<typeof changePhoneSchema>;
