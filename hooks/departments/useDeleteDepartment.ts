import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {deleteDepartment} from "@/api/departments.api";

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDepartment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            toast.success("تم حذف القسم بنجاح.");
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
