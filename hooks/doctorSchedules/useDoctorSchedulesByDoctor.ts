import { useQuery } from "@tanstack/react-query";
import { getDoctorSchedulesByDoctor } from "@/api/doctor-schedules.api";

export function useDoctorSchedulesByDoctor(doctorId: number) {
    return useQuery({
        queryKey: ["doctor-schedules-by-doctor", doctorId],
        queryFn: () => getDoctorSchedulesByDoctor(doctorId),
        enabled: !!doctorId,
    });
}
