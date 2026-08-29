import api from "@/lib/axios";
import { AppointmentChartResponse} from "@/types/data";

// statistics
export const statistics = async () => {
    const {data} = await api.get("/dashboard/statistics");
    const {results} = data;
    return results;
};

// AppointmentsChart
export const appointmentsChart = async (year: number) => {
    const {data} = await api.get("/dashboard/appointments-chart", {
        params: {
            year,
        },
    });

    return data as AppointmentChartResponse;
};
