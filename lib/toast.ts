import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
    text2?: string;
    visibilityTime?: number;
    autoHide?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    position?: "top" | "bottom";
    onPress?: () => void;
    onHide?: () => void;
    onShow?: () => void;
    props?: Record<string, unknown>;
}

const DEFAULT_VISIBILITY_TIME = 4000;

export const toast = {
    show: (
        message: string,
        type: ToastType = "info",
        options?: ToastOptions
    ) => {
        Toast.show({
            type,
            text1: message,
            text2: options?.text2,
            visibilityTime: options?.visibilityTime ?? DEFAULT_VISIBILITY_TIME,
            autoHide: options?.autoHide ?? true,
            position: options?.position ?? "top",
            topOffset: options?.topOffset ?? 50,
            bottomOffset: options?.bottomOffset ?? 40,
            onPress: options?.onPress,
            onHide: options?.onHide,
            onShow: options?.onShow,
            props: options?.props,
        });
    },

    success: (message: string, options?: ToastOptions | string) => {
        const resolvedOptions =
            typeof options === "string" ? { text2: options } : options;
        toast.show(message, "success", resolvedOptions);
    },

    error: (message: string, options?: ToastOptions | string) => {
        const resolvedOptions =
            typeof options === "string" ? { text2: options } : options;
        toast.show(message, "error", resolvedOptions);
    },

    info: (message: string, options?: ToastOptions | string) => {
        const resolvedOptions =
            typeof options === "string" ? { text2: options } : options;
        toast.show(message, "info", resolvedOptions);
    },

    warning: (message: string, options?: ToastOptions | string) => {
        const resolvedOptions =
            typeof options === "string" ? { text2: options } : options;
        toast.show(message, "warning", resolvedOptions);
    },

    hide: () => {
        Toast.hide();
    },
};

export default toast;
