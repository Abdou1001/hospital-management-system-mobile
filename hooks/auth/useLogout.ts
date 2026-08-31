import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth.api";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "@/lib/toast";

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearUser } = useAuth();

    return useMutation({
        mutationFn: logout,

        onSuccess(data) {
            clearUser();
            queryClient.removeQueries({ queryKey: ["current-user"] });
            toast.success(data?.message || "تم تسجيل الخروج بنجاح");
            router.replace("/(tabs)");
        },

        onError(error: any) {
            // Even if server error occurs, clear local session
            clearUser();
            queryClient.removeQueries({ queryKey: ["current-user"] });
            toast.info("تم تسجيل الخروج محلياً");
        },
    });
};

