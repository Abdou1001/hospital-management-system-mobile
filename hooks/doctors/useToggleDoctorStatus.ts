import {useMutation, useQueryClient} from "@tanstack/react-query";

import {toast} from "sonner";

import {toggleDoctorStatus} from "@/api/doctor.api";

export function useToggleDoctorStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => toggleDoctorStatus(id),

        onSuccess: ({message}) => {
            toast.success(message);

            queryClient.invalidateQueries({
                queryKey: ["doctors"],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء تغيير حالة الطبيب");
            }
        },
    });
}
