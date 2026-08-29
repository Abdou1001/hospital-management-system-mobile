import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {createDoctorSchedule} from "@/api/doctor-schedules.api";

export function useCreateDoctorSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDoctorSchedule,

        onSuccess: (data) => {
            toast.success(data.message);

            queryClient.invalidateQueries({
                queryKey: ["doctor-schedules"],
            });

            queryClient.invalidateQueries({
                queryKey: ["doctor-schedule", data.results.schedule_id],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء إضافة دوام للطبيب");
            }
        },
    });
}
