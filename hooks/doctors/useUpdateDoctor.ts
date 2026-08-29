import {useMutation, useQueryClient} from "@tanstack/react-query";

import {toast} from "sonner";

import {updateDoctor} from "@/api/doctor.api";

export function useUpdateDoctor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, formData}: {id: number; formData: FormData}) =>
            updateDoctor(id, formData),

        onSuccess: (_, variables) => {
            toast.success("تم تعديل الطبيب بنجاح");

            queryClient.invalidateQueries({
                queryKey: ["doctors"],
            });

            queryClient.invalidateQueries({
                queryKey: ["doctor", variables.id],
            });
        },

        onError: (error: any) => {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                errors.forEach((err: any) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("حدث خطأ أثناء تعديل الطبيب");
            }
        },
    });
}
