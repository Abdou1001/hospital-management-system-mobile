import {useRouter} from "next/navigation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {logout, verifyChangePhone} from "@/api/auth.api";

import {useAuthStore} from "@/store/auth.store";

import {VerifyChangePhoneSchema} from "@/validation/auth/schemas/verify-change-phone.schema";

export const useVerifyChangePhone = () => {
    const router = useRouter();

    const queryClient = useQueryClient();

    const clearUser = useAuthStore((state) => state.clearUser);

    return useMutation({
        mutationFn: (value: VerifyChangePhoneSchema) =>
            verifyChangePhone(value),

        async onSuccess(data) {
            toast.success(data.message);

            // حذف الـ Cookie من السيرفر
            await logout();

            // حذف جميع بيانات React Query
            queryClient.clear();

            // حذف بيانات المستخدم من Zustand
            clearUser();

            // الانتقال إلى تسجيل الدخول
            router.replace("/login");
        },

        onError(error: any) {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error(
                    error.response?.data?.message ?? "فشل التحقق من رمز التحقق",
                );
            }
        },
    });
};
