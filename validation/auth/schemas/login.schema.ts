import {z} from "zod";

export const loginSchema = z.object({
    login: z
        .string()
        .trim()
        .min(1, "البريد الإلكتروني أو رقم الهاتف مطلوب")
        .refine(
            (value) => {
                const isEmail = z.string().email().safeParse(value).success;
                const isPhone = /^[0-9]{9,15}$/.test(value);

                return isEmail || isPhone;
            },
            {
                message: "أدخل بريدًا إلكترونيًا أو رقم هاتف صحيحًا",
            },
        ),

    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
