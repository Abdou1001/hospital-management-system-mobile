import {useQuery} from "@tanstack/react-query";

import {getDoctorsByDepartment} from "@/api/doctor-departments.api";

export function useDoctorsByDepartment(departId: number) {
    return useQuery({
        queryKey: ["department-doctors", departId],
        queryFn: () => getDoctorsByDepartment(departId),
        enabled: !!departId,
    });
}
