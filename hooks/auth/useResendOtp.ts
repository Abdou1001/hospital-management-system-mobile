import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,

        onSuccess(data) {
            toast.success(data?.message || "تمت إعادة إرسال رمز التحقق بنجاح");
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
                toast.error("حدث خطأ أثناء إعادة إرسال الرمز، يرجى المحاولة لاحقاً");
            }
            console.log("Resend OTP error:", error);
        },
    });
};
