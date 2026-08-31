import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { resetPassword } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useResetPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: resetPassword,

        onSuccess(data) {
            toast.success(data?.message || "تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول");
            router.replace("/(auth)/login");
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
                toast.error("حدث خطأ أثناء تغيير كلمة المرور");
            }
            console.log("Reset password error:", error);
        },
    });
};
