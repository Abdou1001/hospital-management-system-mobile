import api from "@/lib/axios";
import {AppointmentsResponse} from "@/validation/appointments/schemas/appointment.schema";

export interface AppointmentFilters {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    patient_gender?: string;
    day_of_week?: string;
    appointment_date?: string;
    from_date?: string;
    to_date?: string;
    sort?: string;
}

export async function getAppointments(
    params: AppointmentFilters,
): Promise<AppointmentsResponse> {
    const {data} = await api.get("/appointments", {
        params,
    });

    return data;
}

export async function getOneAppointment(
    id: number,
): Promise<AppointmentsResponse> {
    const {data} = await api.get(`/appointments/${id}`);

    return data;
}