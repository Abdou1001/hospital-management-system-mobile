import {useQuery} from "@tanstack/react-query";

import {getDoctorSchedules} from "@/api/doctor-schedules.api";

import {DoctorScheduleFilters} from "@/types/filter";

export function useDoctorSchedules(filters: DoctorScheduleFilters) {
    return useQuery({
        queryKey: ["doctor-schedules", filters],

        queryFn: () => getDoctorSchedules(filters),
    });
}
