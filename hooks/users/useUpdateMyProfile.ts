import {updateMyProfile} from "@/api/user.api";
import {UpdateMyProfileSchema} from "@/validation/users/schemas/update-my-profile.schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, value}: {id: number; value: UpdateMyProfileSchema}) =>
            updateMyProfile(id, value),

        onSuccess(data) {
            toast.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["current-user"],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء تعديل بياناتك");
            }
        },
    });
};
