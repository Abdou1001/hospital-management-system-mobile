import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {editHospital} from "@/api/hospital.api";

export const useEditHospital = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => editHospital(formData),

        onSuccess(data) {
            toast.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["hospital"],
            });
        },

        onError(error: any) {
            toast.error(
                error?.response?.data?.message ??
                    "حدث خطأ أثناء تحديث بيانات المستشفى",
            );
        },
    });
};
