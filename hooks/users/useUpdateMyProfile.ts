import { updateMyProfile } from "@/api/user.api";
import { UpdateMyProfileSchema } from "@/validation/users/schemas/update-my-profile.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (value: UpdateMyProfileSchema) => updateMyProfile(value),

        onSuccess(data) {
            toast.success(data?.message || "تم تحديث البيانات الشخصية بنجاح");

            queryClient.invalidateQueries({
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

