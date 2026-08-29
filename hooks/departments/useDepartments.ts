import {useQuery} from "@tanstack/react-query";

import {getDepartments} from "@/api/departments.api";
import {DepartmentFilters, DEPARTMENT_FILTERS} from "@/types/filter";

export function useDepartments(params?: Partial<DepartmentFilters>) {
    const filters = { ...DEPARTMENT_FILTERS, ...params };
    return useQuery({
        queryKey: ["departments", filters],
        queryFn: () => getDepartments(filters),
    });
}

