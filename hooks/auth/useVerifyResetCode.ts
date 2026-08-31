import { useMutation } from "@tanstack/react-query";
import { verifyResetCode } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useVerifyResetCode = () => {
    return useMutation({
        mutationFn: verifyResetCode,

        onSuccess(data) {
            toast.success(data?.message || "تم تأكيد الرمز بنجاح، يمكنك الآن تعيين كلمة سر جديدة");
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
                toast.error("رمز التعيين غير صحيح أو منتهي الصلاحية");
            }
            console.log("Verify reset code error:", error);
        },
    });
};
