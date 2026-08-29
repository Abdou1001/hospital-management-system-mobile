import {z} from "zod";

export const verifyPhoneSchema = z.object({
    otp: z.string().length(6, "رمز التحقق يجب أن يتكون من 6 أرقام"),
});

export type VerifyPhoneSchema = z.infer<typeof verifyPhoneSchema>;
