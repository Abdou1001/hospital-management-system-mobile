import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {logout} from "@/api/auth.api";
import {useAuth} from "@/hooks/auth/useAuth";
import {useRouter} from "next/navigation";

export const useLogout = () => {
    const router = useRouter();

    const {clearUser} = useAuth();

    return useMutation({
        mutationFn: logout,

        onSuccess(data) {
            clearUser();
            toast.success(data.message);
            router.replace("/login");
        },

        onError(error: any) {
            toast.error(
                error?.response?.data?.message ?? "حدث خطأ أثناء تسجل الخروج",
            );
        },
    });
};
