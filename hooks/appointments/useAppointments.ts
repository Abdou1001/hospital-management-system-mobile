import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
    getAppointments,
    AppointmentFilters,
    getOneAppointment,
} from "@/api/appointments.api";

export function useAppointments(params?: AppointmentFilters) {
    return useInfiniteQuery({
        queryKey: ["appointments", params],
        queryFn: ({ pageParam = 1 }) =>
            getAppointments({ ...params, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.nextPage ?? undefined,
    });
}

export function useOneAppointment(id: number) {
    return useQuery({
        queryKey: ["appointments", id],
        queryFn: () => getOneAppointment(id),
        enabled: !!id,
    });
}