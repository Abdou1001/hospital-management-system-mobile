import {useQuery} from "@tanstack/react-query";

import {getOneDepartment} from "@/api/departments.api";

export function useDepartment(id: number) {
    return useQuery({
        queryKey: ["department", id],
        queryFn: () => getOneDepartment(id),
        enabled: !!id,
    });
}
