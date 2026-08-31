import { useMutation } from "@tanstack/react-query";
import { changePhone } from "@/api/auth.api";
import { toast } from "@/lib/toast";

export const useChangePhone = () => {
    return useMutation({
        mutationFn: (values: { phone_number: string }) => changePhone(values),

        onSuccess(data) {
            toast.success(
                data?.message || "تم إرسال رمز التحقق إلى رقم الهاتف الجديد"
            );
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
                toast.error("حدث خطأ أثناء طلب تغيير رقم الهاتف");
            }
        },
    });
};
