import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment } from "@/api/appointments.api";
import { toast } from "@/lib/toast";

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cancelAppointment(id),

        onSuccess(data) {
            toast.success(data?.message || "تم إلغاء الحجز بنجاح");
            queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["pending-appointments"] });
        },

        onError(error: any) {
            const serverMsg = error?.response?.data?.message;
            if (serverMsg) {
                toast.error(serverMsg);
            } else {
                toast.error("حدث خطأ أثناء إلغاء الحجز، يرجى المحاولة لاحقاً");
            }
            console.log("Cancel appointment error:", error);
        },
    });
};

export default useCancelAppointment;
