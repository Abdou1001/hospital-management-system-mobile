import { updateMyProfile } from "@/api/user.api";
import { UpdateMyProfileSchema } from "@/validation/users/schemas/update-my-profile.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth.store";

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const currentUser = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: (value: UpdateMyProfileSchema) => updateMyProfile(value),

        onSuccess(data, variables) {
            toast.success(data?.message || "تم تحديث البيانات الشخصية بنجاح");

            // تحديث بيانات المستخدم في zustand authStore مباشرة حتى تنعكس في الواجهة فوراً
            const updatedUser = data?.user || data?.results;
            if (updatedUser) {
                setUser(updatedUser);
            } else if (currentUser) {
                setUser({
                    ...currentUser,
                    full_name: variables.full_name || currentUser.full_name,
                    email: variables.email !== undefined ? (variables.email || null) : currentUser.email,
                    date_of_birth: variables.date_of_birth !== undefined ? (variables.date_of_birth || null) : currentUser.date_of_birth,
                    gender: variables.gender || currentUser.gender,
                });
            }

            // مسح الكاش وإعادة جلب البيانات الحديثة من السيرفر
            queryClient.invalidateQueries({
                queryKey: ["current-user"],
            });
            queryClient.refetchQueries({
                queryKey: ["current-user"],
            });
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message;

            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((err: any) => {
                    toast.error(typeof err === "string" ? err : err.message || err.msg);
                });
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("حدث خطأ أثناء تعديل بياناتك الشخصية");
            }
        },
    });
};

