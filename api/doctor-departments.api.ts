import api from "@/lib/axios";
import { AssignDoctorDepartmentPayload, DoctorDepartmentResponse, DoctorDepartmentsResponse, UpdateDoctorDepartmentPayload } from "@/types/data";

/* ============================
   Types
============================ */


/* ============================
   Get All
============================ */

export async function getDoctorDepartments() {
    const {data} = await api.get<DoctorDepartmentsResponse>(
        "/doctor-departments",
    );

    return data;
}

/* ============================
   Get One
============================ */

export async function getOneDoctorDepartment(id: number) {
    const {data} = await api.get<DoctorDepartmentResponse>(
        `/doctor-departments/${id}`,
    );

    return data;
}

/* ============================
   Assign Doctor To Department
============================ */

export async function assignDoctorToDepartment(
    body: AssignDoctorDepartmentPayload,
) {
    const {data} = await api.post("/doctor-departments", body);

    return data;
}

/* ============================
   Update Doctor Department
============================ */

export async function updateDoctorDepartment(
    id: number,
    body: UpdateDoctorDepartmentPayload,
) {
    const {data} = await api.put(`/doctor-departments/${id}`, body);

    return data;
}

/* ============================
   Delete Doctor Department
============================ */

export async function deleteDoctorDepartment(id: number) {
    const {data} = await api.delete(`/doctor-departments/${id}`);

    return data;
}

/* ============================
   Get Doctors By Department
============================ */

export async function getDoctorsByDepartment(departId: number) {
    const {data} = await api.get(`/doctor-departments/department/${departId}`);

    return data.results;
}

/* ============================
   Get Departments By Doctor
============================ */

export async function getDepartmentsByDoctor(doctorId: number) {
    const {data} = await api.get(`/doctor-departments/doctor/${doctorId}`);

    return data;
}
