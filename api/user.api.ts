import api from "@/lib/axios";
import {UpdateMyProfileSchema} from "@/validation/users/schemas/update-my-profile.schema";
import {
    ChangePhoneNumberSchema,
    ChangePhoneNumberResponse,
} from "@/validation/users/schemas/change-phone-number.schema";

import {
    ChangePasswordResponse,
    ChangePasswordSchema,
} from "@/validation/users/schemas/change-password.schema";

import {UsersResponse} from "@/validation/users/schemas/user.schema";

export interface GetUsersParams {
    page?: number;
    limit?: number;
    keyword?: string;
    role?: string;
    gender?: string;
    is_active?: string;
    sort?: string;
}

export async function getUsers(
    params: GetUsersParams,
): Promise<UsersResponse> {
    const {data} = await api.get("/users", {
        params,
    });

    return data;
}

export async function updateMyProfile(
    value: UpdateMyProfileSchema,
) {
    const {data} = await api.put("/users/profile", value);
    return data;
}

export async function changePhoneNumber(
    value: ChangePhoneNumberSchema,
): Promise<ChangePhoneNumberResponse> {
    const {data} = await api.post("/auth/change-phone", value);

    return data;
}

export async function changePassword(
    value: ChangePasswordSchema,
): Promise<ChangePasswordResponse> {
    const {data} = await api.patch("/users/change-password", value);

    return data;
}


