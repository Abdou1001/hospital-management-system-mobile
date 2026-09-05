import api from "@/lib/axios";
import {
    CreateDoctorSchedule,
    DoctorSchedule,
    UpdateDoctorSchedule,
} from "@/validation/doctor-schedules/schemas/doctor-schedule.schema";

import {DoctorScheduleFilters} from "@/types/filter";

/* ==========================================
    Get All
========================================== */
export const getDoctorSchedules = async (
    filters: DoctorScheduleFilters,
) => {
    const {data} = await api.get("/doctor-schedule", {
        params: filters,
    });

    return data;
};

/* ==========================================
    Get One
========================================== */
export const getDoctorSchedule = async (
    id: number,
) => {
    const {data} = await api.get(`/doctor-schedule/${id}`);

    return data;
};


/* ==========================================
    Get Schedules By Doctor ID
========================================== */
export interface DoctorScheduleItem {
    schedule_id: number;
    day_of_week: string;
    shift_type: string;
    start_time: string;
    end_time: string;
    notes: string | null;
    doctor_id: number;
    status: string;
    max_patients: number;
}

export interface DoctorScheduleByDoctorResponse {
    status: string;
    message: string;
    results: DoctorScheduleItem[];
}

export const getDoctorSchedulesByDoctor = async (
    doctorId: number,
): Promise<DoctorScheduleByDoctorResponse> => {
    const {data} = await api.get(`/doctor-schedule/${doctorId}`);

    return data;
};

