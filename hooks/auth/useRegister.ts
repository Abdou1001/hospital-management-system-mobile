import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useRegister = () => {
    return useMutation({
        mutationFn: register,

        onSuccess(data) {
            toast.success(data?.message || "تم إنشاء الحساب بنجاح، يرجى تأكيد رقم الهاتف");
        },

        onError(error: any) {
            const serverErrors = error?.response?.data?.errors;
            const serverMsg = error?.response?.data?.message;

            if (Array.isArray(serverErrors) && serverErrors.length > 0) {
                serverErrors.forEach((err: any) => {
                    toast.error(typeof err === "string" ? err : err.message || err.msg);
                });
            } else if (serverMsg) {
                toast.error(serverMsg);
            } else {
                toast.error("حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً");
            }
            console.log("Register error:", error);
        },
    });
};
