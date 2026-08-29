import {z} from "zod";

import {paginationSchema} from "@/validation/paginationSchema";

export const departmentSchema = z.object({
    // معرف القسم
    depart_id: z.number(),

    // اسم القسم
    depart_name: z.string(),

    // صورة القسم
    path_image: z.string().nullable(),

    // عدد الأطباء داخل القسم
    doctors_count: z.number().default(0),

    // تاريخ الإنشاء
    created_at: z.string().optional(),
});

export type Department = z.infer<typeof departmentSchema>;

export const departmentsResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    pagination: paginationSchema,

    results: z.array(departmentSchema),
});

export type DepartmentsResponse = z.infer<typeof departmentsResponseSchema>;

export const departmentResponseSchema = z.object({
    status: z.literal("success"),

    message: z.string(),

    results: departmentSchema,
});

export type DepartmentResponse = z.infer<typeof departmentResponseSchema>;
