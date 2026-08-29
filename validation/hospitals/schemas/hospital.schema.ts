import {z} from "zod";

export const hospitalSchema = z.object({
    hospital_name: z
        .string()
        .trim()
        .min(3, "اسم المستشفى يجب أن يكون 3 أحرف على الأقل"),

    location: z.string().trim().min(3, "الموقع غير صالح"),

    phone_number: z
        .string()
        .trim()
        .min(6, "رقم الهاتف غير صالح")
        .max(15, "رقم الهاتف غير صالح"),

    path_image: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type HospitalSchema = z.infer<typeof hospitalSchema>;
