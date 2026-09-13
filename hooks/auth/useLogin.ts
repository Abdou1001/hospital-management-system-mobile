import { login } from "@/api/auth.api";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export const useLogin = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: login,

        onSuccess(data) {
            const userData = data?.results || data?.user;
            if (userData) {
                setUser(userData);
            }
            toast.success(data?.message || "تم تسجيل الدخول بنجاح");
            if (userData?.role === "reception" || userData?.role === "admin") {
                router.replace("/(reception)/pending" as any);
            } else {
                router.replace("/(tabs)");
            }
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
