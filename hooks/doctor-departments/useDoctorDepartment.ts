import {useQuery} from "@tanstack/react-query";

import {getOneDoctorDepartment} from "@/api/doctor-departments.api";

export function useDoctorDepartment(id: number) {
    return useQuery({
        queryKey: ["doctor-departments", id],
        queryFn: () => getOneDoctorDepartment(id),
        enabled: !!id,
    });
}
