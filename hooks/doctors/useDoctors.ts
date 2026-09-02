import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getDoctors, getOneDoctor } from "@/api/doctor.api";
import { DOCTOR_FILTERS, DoctorFilters } from "@/types/filter";

export function useDoctors(params?: Partial<DoctorFilters>) {
    const filters = { ...DOCTOR_FILTERS, ...params };
    return useInfiniteQuery({
        queryKey: ["doctors", filters],
        queryFn: ({ pageParam = 1 }) =>
            getDoctors({ ...filters, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.nextPage ?? undefined,
    });
}

export function useOneDoctor(id: number) {
    return useQuery({
        queryKey: ["doctor", id],
        queryFn: () => getOneDoctor(id),
        enabled: !!id,
    });
}

