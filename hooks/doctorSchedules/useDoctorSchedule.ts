import {useQuery} from "@tanstack/react-query";

import {getDoctorSchedule} from "@/api/doctor-schedules.api";

export function useDoctorSchedule(id: number) {
    return useQuery({
        queryKey: ["doctor-schedule", id],

        queryFn: () => getDoctorSchedule(id),

        enabled: !!id,
    });
}
