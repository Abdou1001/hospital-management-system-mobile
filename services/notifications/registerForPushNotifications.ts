import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerDeviceApi } from "@/api/devices.api";
import { DEVICE_ID_STORAGE_KEY, setCachedDeviceId } from "@/lib/axios";

export const EXPO_PUSH_TOKEN_KEY = "@hospital_expo_push_token";
const FALLBACK_TOKEN_KEY = "@hospital_device_fallback_token";

async function getOrCreateFallbackToken(): Promise<string> {
    const existing = await AsyncStorage.getItem(FALLBACK_TOKEN_KEY);
    if (existing) return existing;
    const newToken = `ExponentPushToken[dev-${Platform.OS}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}]`;
    await AsyncStorage.setItem(FALLBACK_TOKEN_KEY, newToken);
    return newToken;
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    try {
        // إعداد قناة الإشعارات في Android
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }

        let pushToken: string | null = null;

        try {
            // هل المستخدم أعطى الصلاحية سابقًا؟
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // إذا لم يعطِ الصلاحية، نطلبها
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === "granted") {
                const projectId =
                    Constants.expoConfig?.extra?.eas?.projectId ??
                    Constants.easConfig?.projectId;

                if (projectId) {
                    const tokenData = await Notifications.getExpoPushTokenAsync({
                        projectId,
                    });
                    pushToken = tokenData.data;
                }
            }
        } catch (error) {
            console.warn("تعذر الحصول على Expo Push Token المباشر (ربما في المحاكي):", error);
        }

        // إذا لم يتوفر توكن حقيقي (محاكي أو رفض الإذن)، نستخدم معرّف محلي مستمر لتسجيل الجهاز
        if (!pushToken) {
            pushToken = await getOrCreateFallbackToken();
        }

        if (pushToken) {
            await AsyncStorage.setItem(EXPO_PUSH_TOKEN_KEY, pushToken);

            // تسجيل الجهاز لدى الباك اند
            try {
                const response = await registerDeviceApi({
                    expo_push_token: pushToken,
                    platform: Platform.OS,
                });

                if (response?.results?.device_id) {
                    const deviceId = String(response.results.device_id);
                    await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
                    setCachedDeviceId(deviceId);
                    console.log("تم تسجيل الجهاز بنجاح. Device ID:", deviceId);
                }
            } catch (regError) {
                console.warn("خطأ أثناء إرسال بيانات الجهاز للباك اند:", regError);
            }
        }

        return pushToken;
    } catch (err) {
        console.error("حدث خطأ غير متوقع أثناء إعداد الإشعارات:", err);
        return null;
    }
}
