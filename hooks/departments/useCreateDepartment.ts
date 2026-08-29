import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {createDepartment} from "@/api/departments.api";

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDepartment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            toast.success("تم إنشاء القسم بنجاح.");
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
