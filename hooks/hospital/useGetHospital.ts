import { getHospital } from "@/api/hospital.api";
import { useQuery } from "@tanstack/react-query";

export const useGetHospital = () => {
    return useQuery({
        queryKey: ["get-Hospital"],
        queryFn: getHospital,
    });
};
