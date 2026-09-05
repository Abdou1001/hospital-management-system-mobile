import api from "@/lib/axios";
import {
    DoctorDepartmentResponse,
    DoctorDepartmentsResponse,
} from "@/validation/doctor-departments/schemas/doctor-department.schema";

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
