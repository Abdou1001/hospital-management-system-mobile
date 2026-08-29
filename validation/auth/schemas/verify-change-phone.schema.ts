import {z} from "zod";

export const verifyChangePhoneSchema = z.object({
    otp: z
        .string( "رمز التحقق مطلوب")
        .length(6, "رمز التحقق يجب أن يتكون من 6 أرقام"),
});

export type VerifyChangePhoneSchema = z.infer<typeof verifyChangePhoneSchema>;

export const verifyChangePhoneResponseSchema = z.object({
    status: z.literal("success"),
    message: z.string(),
});

export type VerifyChangePhoneResponse = z.infer<
    typeof verifyChangePhoneResponseSchema
>;
