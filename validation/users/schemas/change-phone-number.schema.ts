import {z} from "zod";

export const changePhoneNumberSchema = z.object({
    phone_number: z
        .string( "رقم الهاتف مطلوب",)
        .trim()
        .regex(/^7\d{8}$/, "رقم الهاتف اليمني غير صالح"),
});

export type ChangePhoneNumberSchema = z.infer<typeof changePhoneNumberSchema>;

export const changePhoneNumberResponseSchema = z.object({
    status: z.literal("success"),
    message: z.string(),
});

export type ChangePhoneNumberResponse = z.infer<
    typeof changePhoneNumberResponseSchema
>;
