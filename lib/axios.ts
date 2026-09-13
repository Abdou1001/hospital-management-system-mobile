import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const DEVICE_ID_STORAGE_KEY = "@hospital_device_id";

let cachedDeviceId: string | null = null;
let deviceReadyResolver: ((id: string) => void) | null = null;
let deviceReadyPromise: Promise<string> | null = null;

export const setCachedDeviceId = (id: string | number | null) => {
    cachedDeviceId = id !== null && id !== undefined ? String(id) : null;
    if (cachedDeviceId && deviceReadyResolver) {
        deviceReadyResolver(cachedDeviceId);
        deviceReadyResolver = null;
    }
};

export const getCachedDeviceId = (): string | null => cachedDeviceId;

export const waitForDeviceId = async (
    timeoutMs = 2500,
): Promise<string | null> => {
    if (cachedDeviceId) return cachedDeviceId;
    try {
        const storedId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
        if (storedId) {
            cachedDeviceId = storedId;
            return storedId;
        }
    } catch {
        // ignore
    }

    if (!deviceReadyPromise) {
        deviceReadyPromise = new Promise((resolve) => {
            deviceReadyResolver = resolve;
            setTimeout(() => resolve(""), timeoutMs);
        });
    }

    const resolved = await deviceReadyPromise;
    return resolved || cachedDeviceId;
};

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    try {
        if (!config.headers["x-device-id"]) {
            let deviceId = cachedDeviceId;
            if (!deviceId) {
                deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
                if (deviceId) {
                    cachedDeviceId = deviceId;
                }
            }

            // For notifications endpoints, wait briefly for device registration if not ready yet
            if (!deviceId && config.url?.includes("notification")) {
                deviceId = await waitForDeviceId(2500);
            }

            if (deviceId) {
                config.headers["x-device-id"] = deviceId;
            }
        }
    } catch {
        // Fallback gracefully
    }
    return config;
});

export default api;
