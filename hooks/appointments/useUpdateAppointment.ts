import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment, UpdateAppointmentPayload } from "@/api/appointments.api";
import { toast } from "@/lib/toast";

interface UpdateAppointmentParams {
    id: number;
    payload: UpdateAppointmentPayload;
}

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: UpdateAppointmentParams) =>
            updateAppointment(id, payload),

        onSuccess(data) {
            toast.success(data?.message || "تم تعديل الحجز بنجاح");
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["pending-appointments"] });
        },

        onError(error: any) {
            const serverErrors = error?.response?.data?.errors;
            const serverMsg = error?.response?.data?.message;

            if (Array.isArray(serverErrors) && serverErrors.length > 0) {
                serverErrors.forEach((err: any) => {
                    toast.error(
                        typeof err === "string" ? err : err.message || err.msg
                    );
                });
            } else if (serverMsg) {
                toast.error(serverMsg);
            } else {
                toast.error("حدث خطأ أثناء تعديل الحجز، يرجى المحاولة لاحقاً");
            }
            console.log("Update appointment error:", error);
        },
    });
};

export default useUpdateAppointment;
