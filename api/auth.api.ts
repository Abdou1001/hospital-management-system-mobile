import api from "@/lib/axios";
import { LoginSchema } from "@/validation/auth/schemas/login.schema";
import { RegisterSchema } from "@/validation/auth/schemas/register.schema";
import {
    VerifyChangePhoneResponse,
    VerifyChangePhoneSchema,
} from "@/validation/auth/schemas/verify-change-phone.schema";

// login
export const login = async (values: LoginSchema) => {
    const { data } = await api.post("/auth/login", values);
    return data;
};

// register
export const register = async (values: RegisterSchema) => {
    const { data } = await api.post("/auth/register", values);
    return data;
};

// verify phone
export const verifyPhone = async (values: { phone_number: string; otp: string }) => {
    const { data } = await api.post("/auth/verify-phone", values);
    return data;
};

// forget password
export const forgetPassword = async (values: { phone_number: string }) => {
    const { data } = await api.post("/auth/forget-password", values);
    return data;
};

// verify reset code
export const verifyResetCode = async (values: { phone_number: string; resetCode: string }) => {
    const { data } = await api.post("/auth/verify-reset-code", values);
    return data;
};

// resend otp
export const resendOtp = async (values: { phone_number: string }) => {
    const { data } = await api.post("/auth/resend-otp", values);
    return data;
};

// reset password
export const resetPassword = async (values: {
    phone_number: string;
    resetCode?: string;
    password: string;
    confirmPassword: string;
}) => {
    const { data } = await api.post("/auth/reset-password", values);
    return data;
};

// logout
export const logout = async () => {
    const { data } = await api.post("/auth/logout");
    return data;
};

// change phone
export const changePhone = async (values: { phone_number: string }) => {
    const { data } = await api.post("/auth/change-phone", values);
    return data;
};

// verify change phone
export async function verifyChangePhone(
    value: VerifyChangePhoneSchema,
): Promise<VerifyChangePhoneResponse> {
    const { data } = await api.post("/auth/verify-change-phone", value);
    return data;
}

// resend change phone otp
export const resendChangePhoneOtp = async () => {
    const { data } = await api.post("/auth/resend-change-phone-otp");
    return data;
};