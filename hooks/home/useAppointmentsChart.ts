import {useQuery} from "@tanstack/react-query";
import {appointmentsChart} from "@/api/dashboard.api";

export const useAppointmentsChart = (year: number) => {
    return useQuery({
        queryKey: ["appointments-chart", year],
        queryFn: () => appointmentsChart(year),
    });
};
