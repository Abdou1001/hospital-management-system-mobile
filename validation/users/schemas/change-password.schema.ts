import {z} from "zod";

export const changePasswordSchema = z
    .object({
        current_password: z
            .string("كلمة المرور الحالية مطلوبة")
            .min(1, "كلمة المرور الحالية مطلوبة"),

        new_password: z
            .string("كلمة المرور الجديدة مطلوبة")
            .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),

        confirm_password: z
            .string("تأكيد كلمة المرور مطلوب")
            .min(1, "تأكيد كلمة المرور مطلوب"),
    })

    .refine((data) => data.new_password === data.confirm_password, {
        path: ["confirm_password"],
        message: "كلمتا المرور غير متطابقتين",
    });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const changePasswordResponseSchema = z.object({
    status: z.literal("success"),
    message: z.string(),
});

export type ChangePasswordResponse = z.infer<
    typeof changePasswordResponseSchema
>;
