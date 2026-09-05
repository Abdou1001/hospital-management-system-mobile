import api from "@/lib/axios";
import { HospitalSchema } from "@/validation/hospitals/schemas/hospital.schema";

// getHospital
export const getHospital = async () => {
    const { data } = await api.get("/hospital");
    const { results }: { results: HospitalSchema } = data;
    return results;
};

// editHospital
export const editHospital = async (formData: FormData) => {
    const { data } = await api.put("/hospital", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};
