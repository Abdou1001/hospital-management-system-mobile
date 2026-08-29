import {z} from "zod";
import {STATUS, USER_ROLES} from "@/types/enums";

export const updateUserSchema = z.object({
    role: z.enum(USER_ROLES),

    is_active: z.enum(STATUS),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
