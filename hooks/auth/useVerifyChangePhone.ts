import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyChangePhone } from "@/api/auth.api";
import { toast } from "@/lib/toast";
import { VerifyChangePhoneSchema } from "@/validation/auth/schemas/verify-change-phone.schema";

export const useVerifyChangePhone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (value: VerifyChangePhoneSchema) => verifyChangePhone(value),

        onSuccess(data) {
            toast.success(data?.message || "تم تغيير رقم الهاتف بنجاح");
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
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
                toast.error("فشل التحقق من رمز التأكيد، يرجى المحاولة مرة أخرى");
            }
        },
    });
};
