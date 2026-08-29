import api from "@/lib/axios";
import {LoginSchema} from "@/validation/auth/schemas/login.schema";
import {
    VerifyChangePhoneSchema,
    VerifyChangePhoneResponse,
} from "@/validation/auth/schemas/verify-change-phone.schema";


// login
export const login = async (values: LoginSchema) => {
    const {data} = await api.post("/auth/login", values);
    return data;
};

// logout
export const logout = async () => {
    const {data} = await api.post("/auth/logout");
    return data;
};

export async function verifyChangePhone(
    value: VerifyChangePhoneSchema,
): Promise<VerifyChangePhoneResponse> {
    const {data} = await api.post("/auth/verify-change-phone", value);

    return data;
}