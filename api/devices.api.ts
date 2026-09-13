import api from "@/lib/axios";

export interface RegisterDevicePayload {
    expo_push_token: string;
    platform: string;
}

export interface UserDevice {
    device_id: number;
    user_id: number | null;
    expo_push_token: string;
    platform: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface RegisterDeviceResponse {
    status: string;
    message: string;
    results: UserDevice;
}

// @Desc Register user device
// @Route POST : /api/devices
// @Access Public
export async function registerDeviceApi(
    payload: RegisterDevicePayload
): Promise<RegisterDeviceResponse> {
    const { data } = await api.post<RegisterDeviceResponse>("/devices", payload);
    return data;
}

// @Desc Remove user device
// @Route DELETE : /api/devices
// @Access Public
export async function removeDeviceApi(payload: { expo_push_token: string }) {
    const { data } = await api.delete("/devices", {
        data: payload,
    });
    return data;
}
