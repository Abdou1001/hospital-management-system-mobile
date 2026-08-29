import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {deleteDoctorDepartment} from "@/api/doctor-departments.api";

export function useDeleteDoctorDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteDoctorDepartment(id),

        onSuccess: ({message}) => {
            toast.success(message);

            queryClient.invalidateQueries({
                queryKey: ["doctor-departments"],
            });

            queryClient.invalidateQueries({
                queryKey: ["doctors"],
            });
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
