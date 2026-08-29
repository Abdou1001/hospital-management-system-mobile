import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {updateDepartment} from "@/api/departments.api";

export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Parameters<typeof updateDepartment>[1];
        }) => updateDepartment(id, data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            queryClient.invalidateQueries({
                queryKey: ["department", data.results.depart_id],
            });

            toast.success("تم تحديث القسم بنجاح.");
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => toast.error(err.message));
            } else {
                toast.error(
                    error.response?.data?.message || "حدث خطأ أثناء حذف القسم",
                );
            }
        },
    });
}
