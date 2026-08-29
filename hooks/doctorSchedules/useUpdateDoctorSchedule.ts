import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {updateDoctorSchedule} from "@/api/doctor-schedules.api";

export function useUpdateDoctorSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDoctorSchedule,

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
                toast.error("حدث خطأ أثناء تعديل  دوامات الطبيب");
            }
        },
    });
}
