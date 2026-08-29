import {useQuery} from "@tanstack/react-query";
import {statistics} from "@/api/dashboard.api";

export const useDashboardStatistics = () => {
    return useQuery({
        queryKey: ["dashboard-statistics"],
        queryFn: statistics,
    });
};
