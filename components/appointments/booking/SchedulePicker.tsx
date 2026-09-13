import {DoctorScheduleItem} from "@/api/doctor-schedules.api";
import {BookingAppointmentFormValues} from "@/validation/appointments/schemas/booking-appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import React, {memo, useState} from "react";
import {Control, useWatch} from "react-hook-form";
import {Pressable, Text, View} from "react-native";
import SkeletonWrapper from "@/components/skeletons/SkeletonWrapper";

interface SchedulePickerProps {
    schedules: DoctorScheduleItem[];
    isLoading: boolean;
    control: Control<BookingAppointmentFormValues>;
    onSelectSchedule: (id: number) => void;
    errorMessage?: string;
    isDark: boolean;
}

const SchedulePicker: React.FC<SchedulePickerProps> = ({
    schedules,
    isLoading,
    control,
    onSelectSchedule,
    errorMessage,
    isDark,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const selectedScheduleId = useWatch({
        control,
        name: "schedule_id",
    });

    const selectedSchedule = schedules.find(
        (s) => s.schedule_id === selectedScheduleId,
    );

    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{textAlign: "right"}}>
                اختر موعد الدوام
            </Text>

            {isLoading ? (
                <SkeletonWrapper>
                    <View
                        style={{
                            height: 56,
                            width: "100%",
                            borderRadius: 16,
                            backgroundColor: "#000",
                        }}
                    />
                </SkeletonWrapper>
            ) : (
                <>
                    <Pressable
                        onPress={() => setShowDropdown((prev) => !prev)}
                        className={`h-14 w-full flex-row-reverse items-center justify-between rounded-2xl border px-4 ${
                            errorMessage
                                ? "border-red-500 bg-red-50/20"
                                : isDark
                                  ? "border-slate-700 bg-slate-900/60"
                                  : "border-slate-200 bg-slate-50"
                        }`}>
                        <Text
                            className={`font-sans-medium text-base ${
                                selectedSchedule
                                    ? isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                    : isDark
                                      ? "text-slate-500"
                                      : "text-slate-400"
                            }`}>
                            {selectedSchedule
                                ? `${selectedSchedule.day_of_week} - ${selectedSchedule.shift_type} (${selectedSchedule.start_time.slice(0, 5)} - ${selectedSchedule.end_time.slice(0, 5)})`
                                : "اختر موعد الدوام"}
                        </Text>
                        <Ionicons
                            name={showDropdown ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={isDark ? "#94a3b8" : "#64748b"}
                        />
                    </Pressable>

                    {errorMessage ? (
                        <Text
                            className="mt-1 font-sans-medium text-xs text-red-500"
                            style={{textAlign: "right"}}>
                            {errorMessage}
                        </Text>
                    ) : null}

                    {/* قائمة الدوامات */}
                    {showDropdown && schedules.length > 0 && (
                        <View
                            className={`mt-2 overflow-hidden rounded-2xl border ${
                                isDark
                                    ? "border-slate-700 bg-slate-800"
                                    : "border-slate-200 bg-white"
                            }`}>
                            {schedules
                                .filter((s) => s.status === "active")
                                .map((sched, idx, arr) => {
                                    const isSelected =
                                        selectedScheduleId ===
                                        sched.schedule_id;
                                    const isLast = idx === arr.length - 1;
                                    return (
                                        <Pressable
                                            key={sched.schedule_id || idx}
                                            onPress={() => {
                                                onSelectSchedule(
                                                    sched.schedule_id,
                                                );
                                                setShowDropdown(false);
                                            }}
                                            className={`flex-row-reverse items-center justify-between p-4 ${
                                                isSelected ? "bg-main/10" : ""
                                            } ${!isLast ? (isDark ? "border-b border-slate-700" : "border-b border-slate-100") : ""}`}>
                                            <View className="flex-1 flex-row-reverse items-center gap-2">
                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={18}
                                                    color={
                                                        isSelected
                                                            ? "#10b981"
                                                            : isDark
                                                              ? "#94a3b8"
                                                              : "#64748b"
                                                    }
                                                />
                                                <View className="flex-1">
                                                    <Text
                                                        className={`font-sans-bold text-sm ${
                                                            isSelected
                                                                ? "text-main"
                                                                : isDark
                                                                  ? "text-white"
                                                                  : "text-slate-800"
                                                        }`}
                                                        style={{
                                                            textAlign: "right",
                                                        }}>
                                                        {sched.day_of_week} -{" "}
                                                        {sched.shift_type}
                                                    </Text>
                                                    <Text
                                                        className="mt-1 font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                                                        style={{
                                                            textAlign: "right",
                                                        }}>
                                                        {sched.start_time.slice(
                                                            0,
                                                            5,
                                                        )}{" "}
                                                        -{" "}
                                                        {sched.end_time.slice(
                                                            0,
                                                            5,
                                                        )}
                                                        ⏱️{" "}
                                                    </Text>

                                                    {sched.notes ? (
                                                        <Text
                                                            className="font-sans-medium text-xs text-muted-foreground dark:text-slate-400"
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                            }}>
                                                            {" "}
                                                            • {sched.notes}
                                                        </Text>
                                                    ) : null}
                                                </View>
                                            </View>
                                            {isSelected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={22}
                                                    color="#10b981"
                                                />
                                            )}
                                        </Pressable>
                                    );
                                })}
                        </View>
                    )}

                    {showDropdown &&
                        schedules.filter((s) => s.status === "active")
                            .length === 0 && (
                            <View
                                className={`mt-2 items-center rounded-2xl border p-4 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-800"
                                        : "border-slate-200 bg-white"
                                }`}>
                                <Text className="font-sans-medium text-sm text-muted-foreground dark:text-slate-400">
                                    لا توجد دوامات متاحة حالياً
                                </Text>
                            </View>
                        )}
                </>
            )}
        </View>
    );
};

export default memo(SchedulePicker);
