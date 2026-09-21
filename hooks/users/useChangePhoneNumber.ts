import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "expo-router";
import { toast } from "@/lib/toast";
import {useAuth} from "@/hooks/auth/useAuth";
import {changePhoneNumber} from "@/api/user.api";
import {ChangePhoneNumberSchema} from "@/validation/users/schemas/change-phone-number.schema";

export const useChangePhoneNumber = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const {clearUser} = useAuth();

    return useMutation({
        mutationFn: (value: ChangePhoneNumberSchema) =>
            changePhoneNumber(value),

        onSuccess: (data) => {
            toast.success(data.message || "تم تغيير رقم الهاتف بنجاح، يرجى تسجيل الدخول مجدداً");
            clearUser();
            queryClient.removeQueries({queryKey: ["current-user"]});
            queryClient.clear();
            router.replace("/(auth)/login");
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => toast.error(err.message));
            } else {
                toast.error(
                    error.response?.data?.message ??
                        "حدث خطأ أثناء تغيير رقم الهاتف",
                );
            }
        },
    });
};
