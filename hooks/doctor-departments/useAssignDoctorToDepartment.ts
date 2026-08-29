import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {assignDoctorToDepartment} from "@/api/doctor-departments.api";
import {AssignDoctorDepartmentPayload} from "@/types/data";

export function useAssignDoctorToDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: AssignDoctorDepartmentPayload) =>
            assignDoctorToDepartment(body),

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
                        "حدث خطأ أثناء ربط الطبيب بالقسم",
                );
            }
        },
    });
}
