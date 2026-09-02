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

export async function getMyAppointments(
    params?: AppointmentFilters,
): Promise<AppointmentsResponse> {
    const {data} = await api.get("/appointments/my-appointments", {
        params,
    });

    return data;
}

export interface CreateAppointmentPayload {
    patient_name: string;
    patient_phone: string;
    patient_age: number;
    patient_gender: string;
    appointment_date: string;
    schedule_id: number;
    notes?: string;
    payment_receipt?: {
        uri: string;
        name: string;
        type: string;
    };
}

export async function createAppointment(payload: CreateAppointmentPayload) {
    const formData = new FormData();
    formData.append("patient_name", payload.patient_name);
    formData.append("patient_phone", payload.patient_phone);
    formData.append("patient_age", String(payload.patient_age));
    formData.append("patient_gender", payload.patient_gender);
    formData.append("appointment_date", payload.appointment_date);
    formData.append("schedule_id", String(payload.schedule_id));

    if (payload.notes) {
        formData.append("notes", payload.notes);
    }

    if (payload.payment_receipt) {
        formData.append("payment_receipt", payload.payment_receipt as any);
    }

    const {data} = await api.post("/appointments", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
}