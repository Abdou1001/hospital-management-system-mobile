import { useInfiniteQuery } from "@tanstack/react-query";
import { getDepartments } from "@/api/departments.api";
import { DepartmentFilters, DEPARTMENT_FILTERS } from "@/types/filter";

export function useDepartments(params?: Partial<DepartmentFilters>) {
    const filters = { ...DEPARTMENT_FILTERS, ...params };
    return useInfiniteQuery({
        queryKey: ["departments", filters],
        queryFn: ({ pageParam = 1 }) =>
            getDepartments({ ...filters, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.nextPage ?? undefined,
    });
}


