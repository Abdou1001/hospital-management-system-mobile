import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment, CreateAppointmentPayload } from "@/api/appointments.api";
import { toast } from "@/lib/toast";

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAppointmentPayload) =>
            createAppointment(payload),

        onSuccess(data) {
            toast.success(
                data?.message || "تم إنشاء الحجز بنجاح"
            );
            // إعادة جلب قائمة حجوزاتي
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },

        onError(error: any) {
            const serverErrors = error?.response?.data?.errors;
            const serverMsg = error?.response?.data?.message;

            if (Array.isArray(serverErrors) && serverErrors.length > 0) {
                serverErrors.forEach((err: any) => {
                    toast.error(
                        typeof err === "string"
                            ? err
                            : err.message || err.msg
                    );
                });
            } else if (serverMsg) {
                toast.error(serverMsg);
            } else {
                toast.error("حدث خطأ أثناء إنشاء الحجز، يرجى المحاولة لاحقاً");
            }
            console.log("Create appointment error:", error);
        },
    });
};
