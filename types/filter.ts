export interface UserFilters {
    page: number;
    limit: number;
    keyword: string;
    role: string;
    gender: string;
    is_active: string;
    sort: string;
}

export const USER_FILTERS = {
    page: 1,
    limit: 20,
    keyword: "",
    role: "",
    gender: "",
    is_active: "",
    sort: "-created_at",
};

export interface AppointmentFilters {
    page: number;
    limit: number;
    keyword: string;
    status: string;
    patient_gender: string;
    day_of_week: string;
    appointment_date: string;
    from_date: string;
    to_date: string;
    sort: string;
}

export const APPOINTMENT_FILTERS = {
    page: 1,
    limit: 20,
    keyword: "",
    status: "",
    patient_gender: "",
    day_of_week: "",
    appointment_date: "",
    from_date: "",
    to_date: "",
    sort: "-created_at",
};

export interface DoctorFilters {
    page: number;
    limit: number;
    keyword: string;
    status: string;
    gender: string;
    min_experience?: number;
    max_experience?: number;
    min_fee?: number;
    max_fee?: number;
    sort: string;
}

export const DOCTOR_FILTERS: DoctorFilters = {
    page: 1,
    limit: 20,
    keyword: "",
    status: "",
    gender: "",
    min_experience: undefined,
    max_experience: undefined,
    min_fee: undefined,
    max_fee: undefined,
    sort: "full_name",
};

export interface DoctorScheduleFilters {
    page: number;
    limit: number;

    keyword: string;

    doctor_id?: number;

    day_of_week: string;

    shift_type: string;

    status: string;

    sort: string;
}

export type DepartmentFilters = {
    page?: number;
    limit?: number;
    keyword?: string;
    sort?: "name" | "most_doctors" | "least_doctors";
};

export const DEPARTMENT_FILTERS: DepartmentFilters = {
    page: 1,
    limit: 20,
    keyword: "",
    sort: "name",
};

export type AdsFilters = {
    page?: number;
    limit?: number;
    status?: string;
    expired?: string;
    sort?: string;
};

export const ADS_FILTERS: AdsFilters = {
    page: 1,
    limit: 20,
    status: "",
    expired: "",
    sort: "-created_at",
};
