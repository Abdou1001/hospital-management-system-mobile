import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {updateDoctorDepartment} from "@/api/doctor-departments.api";
import {UpdateDoctorDepartmentPayload} from "@/types/data";

export function useUpdateDoctorDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: number;
            body: UpdateDoctorDepartmentPayload;
        }) => updateDoctorDepartment(id, body),

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
                    error.response?.data?.message ||
                        "حدث خطأ أثناء تحديث القسم",
                );
            }
        },
    });
}
