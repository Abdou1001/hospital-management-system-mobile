import {useQuery} from "@tanstack/react-query";

import {getDepartmentsByDoctor} from "@/api/doctor-departments.api";

export function useDepartmentsByDoctor(doctorId: number) {
    return useQuery({
        queryKey: ["doctor-departments-by-doctor", doctorId],
        queryFn: () => getDepartmentsByDoctor(doctorId),
        enabled: !!doctorId,
    });
}
