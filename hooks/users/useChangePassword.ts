import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/api/user.api";
import { ChangePasswordSchema } from "@/validation/users/schemas/change-password.schema";
import { toast } from "@/lib/toast";

export const useChangePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: ChangePasswordSchema) => changePassword(values),

        onSuccess(data) {
            toast.success(data?.message || "تم تغيير كلمة المرور بنجاح");
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
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

