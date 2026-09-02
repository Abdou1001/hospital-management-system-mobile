import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyAppointments, AppointmentFilters } from "@/api/appointments.api";
import { useAuthStore } from "@/store/auth.store";

export function useMyAppointments(params?: AppointmentFilters) {
    const user = useAuthStore((state) => state.user);

    return useInfiniteQuery({
        queryKey: ["my-appointments", params],
        queryFn: ({ pageParam = 1 }) =>
            getMyAppointments({ ...params, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.nextPage ?? undefined,
        enabled: !!user,
    });
}
