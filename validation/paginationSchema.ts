import z from "zod";

export const paginationSchema = z.object({
    page: z.number(),
    limit: z.number(),
    totalResults: z.number(),
    totalPages: z.number(),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
});

export type Pagination = z.infer<typeof paginationSchema>;