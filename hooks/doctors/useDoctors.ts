import {useQuery} from "@tanstack/react-query";

import {getDoctors, getOneDoctor} from "@/api/doctor.api";

import {DOCTOR_FILTERS, DoctorFilters} from "@/types/filter";

export function useDoctors(params?: Partial<DoctorFilters>) {
    const filters = {...DOCTOR_FILTERS, ...params};
    return useQuery({
        queryKey: ["doctors", filters],
        queryFn: () => getDoctors(filters),
    });
}

export function useOneDoctor(id: number) {
    return useQuery({
        queryKey: ["doctor", id],
        queryFn: () => getOneDoctor(id),
        enabled: !!id,
    });
}
