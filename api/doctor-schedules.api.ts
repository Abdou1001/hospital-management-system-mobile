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
    Create
========================================== */
export const createDoctorSchedule = async (
    values: CreateDoctorSchedule,
) => {
    const {data} = await api.post("/doctor-schedule", values);
    
    return data;
};

/* ==========================================
    Update
========================================== */
export const updateDoctorSchedule = async ({
    id,
    values,
}: {
    id: number;
    values: UpdateDoctorSchedule;
}) => {
    const {data} = await api.put(`/doctor-schedule/${id}`, values);

    return data;
};

/* ==========================================
    Delete
========================================== */
export const deleteDoctorSchedule = async (id: number) => {
    const {data} = await api.delete(`/doctor-schedule/${id}`);

    return data;
};

/* ==========================================
    Change Status
========================================== */
export const changeDoctorScheduleStatus = async (id: number) => {
    const {data} = await api.patch(`/doctor-schedule/status/${id}`);

    return data;
};

