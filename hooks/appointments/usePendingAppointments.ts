import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
    getPendingAppointments,
    updateAppointmentStatus,
    UpdateAppointmentStatusPayload,
} from "@/api/appointments.api";
import { toast } from "@/lib/toast";
import { Appointment } from "@/validation/appointments/schemas/appointment.schema";

export const PENDING_APPOINTMENTS_QUERY_KEY = ["appointments", "pending"];

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateAppointmentStatusPayload;
        }) => updateAppointmentStatus(id, payload),

        onSuccess: (_, variables) => {
            const isApproved = variables.payload.status === "approved";
            toast.success(
                isApproved
                    ? "تم قبول الحجز وتأكيده بنجاح"
                    : "تم رفض الحجز وتحديث الحالة بنجاح"
            );

            queryClient.invalidateQueries({
                queryKey: PENDING_APPOINTMENTS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
                queryKey: ["appointments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-appointments"],
            });
        },

        onError: (error: any) => {
            const serverMsg =
                error?.response?.data?.message ||
                "تعذر تحديث حالة الحجز، يرجى المحاولة مرة أخرى";
            toast.error(serverMsg);
        },
    });
}

export function usePendingAppointments(searchQuery?: string) {
    const query = useQuery({
        queryKey: [...PENDING_APPOINTMENTS_QUERY_KEY, searchQuery ?? ""],
        queryFn: () => getPendingAppointments(searchQuery?.trim() || undefined),
        staleTime: 1000 * 30, // 30 sec
    });

    const updateStatusMutation = useUpdateAppointmentStatus();

    const rawList: Appointment[] = useMemo(() => {
        return Array.isArray(query.data?.results) ? query.data.results : [];
    }, [query.data]);

    const totalCount = query.data?.count ?? rawList.length;

    const filteredList = useMemo(() => {
        if (!searchQuery || !searchQuery.trim()) {
            return rawList;
        }
        const q = searchQuery.trim().toLowerCase();
        return rawList.filter(
            (app: Appointment) =>
                app.patient_name?.toLowerCase().includes(q) ||
                app.patient_phone?.includes(q) ||
                app.doctor_schedule?.doctor?.full_name?.toLowerCase().includes(q) ||
                String(app.appointment_id).includes(q)
        );
    }, [rawList, searchQuery]);

    const acceptAppointment = useCallback(
        (id: number, adminNotes?: string, onSuccess?: () => void) => {
            updateStatusMutation.mutate(
                {
                    id,
                    payload: {
                        status: "approved",
                        admin_notes: adminNotes,
                    },
                },
                { onSuccess }
            );
        },
        [updateStatusMutation]
    );

    const rejectAppointment = useCallback(
        (id: number, adminNotes: string, onSuccess?: () => void) => {
            updateStatusMutation.mutate(
                {
                    id,
                    payload: {
                        status: "rejected",
                        admin_notes: adminNotes || undefined,
                    },
                },
                { onSuccess }
            );
        },
        [updateStatusMutation]
    );

    return {
        ...query,
        data: query.data,
        pendingAppointments: filteredList,
        rawAppointments: rawList,
        count: totalCount,
        acceptAppointment,
        rejectAppointment,
        isSubmitting: updateStatusMutation.isPending,
    };
}
