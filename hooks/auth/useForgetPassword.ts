import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useForgetPassword = () => {
    return useMutation({
        mutationFn: forgetPassword,

        onSuccess(data) {
            toast.success(data?.message || "تم إرسال رمز التحقق إلى رقم هاتفك بنجاح");
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
                toast.error("رقم الهاتف غير مسجل أو حدث خطأ، يرجى المحاولة لاحقاً");
            }
            console.log("Forget password error:", error);
        },
    });
};
