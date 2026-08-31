import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { verifyPhone } from "@/api/auth.api";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "@/lib/toast";

export const useVerifyPhone = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: verifyPhone,

        onSuccess(data) {
            if (data?.results || data?.user) {
                setUser(data.results || data.user);
            }
            toast.success(data?.message || "تم تأكيد رقم الهاتف وتأطير الحساب بنجاح");
            router.replace("/(tabs)");
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
                toast.error("رمز التحقق غير صحيح، يرجى إعادة التأكد");
            }
            console.log("Verify Phone error:", error);
        },
    });
};
