import { useQuery } from "@tanstack/react-query";
import { getOneDoctor } from "@/api/doctor.api";

export function useDoctor(id: number) {
    return useQuery({
        queryKey: ["doctor", id],
        queryFn: () => getOneDoctor(id),
        enabled: !!id,
    });
}
