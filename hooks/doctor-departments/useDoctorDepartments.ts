import {useQuery} from "@tanstack/react-query";

import {getDoctorDepartments} from "@/api/doctor-departments.api";

export function useDoctorDepartments() {
    return useQuery({
        queryKey: ["doctor-departments"],
        queryFn: getDoctorDepartments,
    });
}
