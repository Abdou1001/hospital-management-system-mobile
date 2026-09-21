import images from "@/constants/images";
import {ImageSourcePropType} from "react-native";

export const getAdImageSource = (item: any): ImageSourcePropType => {
    if (!item) return images.ad_1;

    // إذا تم تمرير الصورة المحلية مباشرة (number أو object)
    if (typeof item === "number" || (typeof item === "object" && item !== null && "uri" in item)) {
        return item;
    }

    if (typeof item === "string") {
        if (item.startsWith("http://") || item.startsWith("https://")) {
            return {uri: item};
        }
        const baseUrl =
            process.env.EXPO_PUBLIC_STORAGE_URL || process.env.EXPO_PUBLIC_API_URL || "";
        const cleanBase = baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
        const cleanPath = item.startsWith("/") ? item : `/${item}`;
        return {uri: `${cleanBase}${cleanPath}`};
    }

    const path = item.image_url || item.path_image || item.image || item.url;

    // إذا كانت الصورة محلية من import/require (مثل إعلانات الـ fallback)
    if (typeof path === "number" || (typeof path === "object" && path !== null && "uri" in path)) {
        return path;
    }

    if (typeof path === "string" && path.trim().length > 0) {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return {uri: path};
        }
        const baseUrl =
            process.env.EXPO_PUBLIC_STORAGE_URL ||
            process.env.EXPO_PUBLIC_API_URL ||
            "";
        const cleanBase = baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return {uri: `${cleanBase}${cleanPath}`};
    }

    return images.ad_1;
};
