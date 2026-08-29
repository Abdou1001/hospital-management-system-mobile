import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {changePassword} from "@/api/user.api";

import {useRouter} from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/api/auth.api";

export const useChangePassword = () => {
    const router = useRouter();

    const queryClient = useQueryClient();

    const clearUser = useAuthStore((state) => state.clearUser);

    return useMutation({
        mutationFn: changePassword,

        async onSuccess(data) {
            toast.success(data.message);

            // حذف جميع بيانات React Query
            queryClient.clear();

            // حذف المستخدم من Zustand
            clearUser();

            // حذف الـ Cookie من السيرفر
            await logout();

            router.replace("/login");
        },

        onError(error: any) {
            toast.error(
                error.response?.data?.message ??
                    "حدث خطأ أثناء تغيير كلمة المرور",
            );
        },
    });
};
