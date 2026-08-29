import api from "@/lib/axios";
import {DoctorFilters} from "@/types/filter";

import {
    DoctorResponse,
    DoctorsResponse,
} from "@/validation/doctors/schemas/doctor.schema";

export async function getDoctors(
    params: DoctorFilters,
): Promise<DoctorsResponse> {
    const {data} = await api.get("/doctors", {
        params,
    });

    return data;
}

export async function getOneDoctor(id: number) {
    const {data} = await api.get<DoctorResponse>(`/doctors/${id}`);
    return data.results;
}
