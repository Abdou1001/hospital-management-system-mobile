import { useToastStore, ToastType } from "@/store/toast.store";

export const toast = {
    show: (message: string, type?: ToastType) => {
        useToastStore.getState().showToast(message, type);
    },
    success: (message: string) => {
        useToastStore.getState().showToast(message, "success");
    },
    error: (message: string) => {
        useToastStore.getState().showToast(message, "error");
    },
    info: (message: string) => {
        useToastStore.getState().showToast(message, "info");
    },
    warning: (message: string) => {
        useToastStore.getState().showToast(message, "warning");
    },
};
