import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { login } from "@/api/auth.api";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "@/lib/toast";

export const useLogin = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: login,

        onSuccess(data) {
            if (data?.results || data?.user) {
                setUser(data.results || data.user);
            }
            toast.success(data?.message || "تم تسجيل الدخول بنجاح");
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
                toast.error("رقم الهاتف / البريد الإلكتروني أو كلمة المرور غير صحيحة");
            }
            console.log("Login error:", error);
        },
    });
};
