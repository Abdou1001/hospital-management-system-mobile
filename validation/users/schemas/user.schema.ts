import {z} from "zod";
import {GENDER, STATUS, USER_ROLES} from "@/types/enums";
import { paginationSchema } from "@/validation/paginationSchema";

export const userSchema = z.object({
    user_id: z.number(),

    full_name: z.string(),

    email: z.email(),

    phone_number: z.string(),

    gender: z.enum(GENDER),

    age: z.number(),

    role: z.enum(USER_ROLES),

    is_active: z.enum(STATUS),

    created_at: z.string(),
});

export type User = z.infer<typeof userSchema>;


export const usersResponseSchema = z.object({
    status: z.literal("success"),
    message: z.string(),
    pagination: paginationSchema,
    results: z.array(userSchema),
});

export type UsersResponse = z.infer<typeof usersResponseSchema>;