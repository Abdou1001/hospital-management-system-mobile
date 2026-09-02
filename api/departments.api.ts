import api from "@/lib/axios";

import {
    DepartmentResponse,
    DepartmentsResponse,
} from "@/validation/departments/schemas/department.schema";
import {DepartmentFilters} from "@/types/filter";


/* -------------------- Get All Departments -------------------- */

export async function getDepartments(
    params?: DepartmentFilters,
): Promise<DepartmentsResponse> {
    const {data} = await api.get<DepartmentsResponse>("/departments", {
        params,
    });
    return data;
}

/* -------------------- Get One Department -------------------- */

export async function getOneDepartment(
    id: number,
) {
    const {data} = await api.get<DepartmentResponse>(`/departments/${id}`);

    return data.results;
}


