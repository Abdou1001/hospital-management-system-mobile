import {useQuery} from "@tanstack/react-query";

import {
    getAppointments,
    AppointmentFilters,
    getOneAppointment,
} from "@/api/appointments.api";

export function useAppointments(params: AppointmentFilters) {
    return useQuery({
        queryKey: ["appointments", params],
        queryFn: () => getAppointments(params),
    });
}

export function useOneAppointment(id: number) {
    return useQuery({
        queryKey: ["appointments", id],
        queryFn: () => getOneAppointment(id),
        enabled: !!id,
    });
}