import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { changePassword } from "@/api/user.api";
import { ChangePasswordSchema } from "@/validation/users/schemas/change-password.schema";
import { toast } from "@/lib/toast";
import { useAuth } from "@/hooks/auth/useAuth";

export const useChangePassword = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearUser } = useAuth();

    return useMutation({
        mutationFn: (values: ChangePasswordSchema) => changePassword(values),

        onSuccess(data) {
            toast.success(data?.message || "تم تغيير كلمة المرور بنجاح، يرجى تسجيل الدخول مجدداً");
            clearUser();
            queryClient.removeQueries({ queryKey: ["current-user"] });
            queryClient.clear();
            router.replace("/(auth)/login");
        },

        onError(error: any) {
            const errors = error?.response?.data?.errors;
            const message = error?.response?.data?.message;

            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((err: any) => {
                    toast.error(typeof err === "string" ? err : err.message || err.msg);
                });
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("حدث خطأ أثناء تغيير كلمة المرور");
            }
        },
    });
};

