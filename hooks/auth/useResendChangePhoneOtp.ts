import { useMutation } from "@tanstack/react-query";
import { resendChangePhoneOtp } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useResendChangePhoneOtp = () => {
    return useMutation({
        mutationFn: resendChangePhoneOtp,

        onSuccess(data) {
            toast.success(data?.message || "تمت إعادة إرسال رمز التحقق بنجاح");
        },

        onError(error: any) {
            const message = error?.response?.data?.message;
            toast.error(message || "فشلت إعادة إرسال رمز التحقق");
        },
    });
};
