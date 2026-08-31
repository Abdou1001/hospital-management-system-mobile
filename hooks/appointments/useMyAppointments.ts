import { useQuery } from "@tanstack/react-query";
import { getMyAppointments, AppointmentFilters } from "@/api/appointments.api";

export function useMyAppointments(params?: AppointmentFilters) {
    return useQuery({
        queryKey: ["my-appointments", params],
        queryFn: () => getMyAppointments(params),
    });
}
