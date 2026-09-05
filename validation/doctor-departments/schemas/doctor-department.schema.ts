import {z} from "zod";

import {departmentSchema} from "@/validation/departments/schemas/department.schema";
import {doctorSchema} from "@/validation/doctors/schemas/doctor.schema";
import {paginationSchema} from "@/validation/paginationSchema";

export const doctorDepartmentSchema = z.object({
    doctor_deprtment_id: z.number().optional(),
    doctor_department_id: z.number().optional(),
    doctor_id: z.number().optional(),
    depart_id: z.number().optional(),
    doctor: doctorSchema.optional(),
    department: departmentSchema.optional(),
    created_at: z.string().optional(),
});

export type DoctorDepartment = z.infer<typeof doctorDepartmentSchema>;

export const doctorDepartmentsResponseSchema = z.object({
    status: z.literal("success").or(z.string()),
    message: z.string(),
    pagination: paginationSchema.optional(),
    results: z.array(doctorDepartmentSchema),
});

export type DoctorDepartmentsResponse = z.infer<
    typeof doctorDepartmentsResponseSchema
>;

export const doctorDepartmentResponseSchema = z.object({
    status: z.literal("success").or(z.string()),
    message: z.string(),
    results: doctorDepartmentSchema,
});

export type DoctorDepartmentResponse = z.infer<
    typeof doctorDepartmentResponseSchema
>;
