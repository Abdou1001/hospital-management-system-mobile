import {DoctorScheduleItem} from "@/api/doctor-schedules.api";
import {BookingAppointmentFormValues} from "@/validation/appointments/schemas/booking-appointment.schema";
import {Ionicons} from "@expo/vector-icons";
import React, {memo, useCallback, useMemo, useState} from "react";
import {Control, useWatch} from "react-hook-form";
import {Pressable, Text, View} from "react-native";

// ============================
// أسماء الأيام العربية المختصرة
// ============================
const DAYS_AR_SHORT = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const MONTHS_AR = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
];

// ============================
// خريطة الأيام العربية إلى أرقام
// ============================
const DAY_NAME_TO_NUM: Record<string, number> = {
    الاحد: 0,
    الاثنين: 1,
    الاتنين: 1,
    الثلاثاء: 2,
    الاربعاء: 3,
    الخميس: 4,
    الجمعة: 5,
    السبت: 6,
};

interface AppointmentCalendarProps {
    schedules: DoctorScheduleItem[];
    control: Control<BookingAppointmentFormValues>;
    onSelectDate: (date: string) => void;
    errorMessage?: string;
    isDark: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    schedules,
    control,
    onSelectDate,
    errorMessage,
    isDark,
}) => {
    const selectedScheduleId = useWatch({
        control,
        name: "schedule_id",
    });

    const appointmentDate = useWatch({
        control,
        name: "appointment_date",
    });

    const selectedSchedule = useMemo(() => {
        if (!selectedScheduleId) return null;
        return (
            schedules.find((s) => s.schedule_id === selectedScheduleId) ?? null
        );
    }, [schedules, selectedScheduleId]);

    const selectedDayOfWeek = selectedSchedule?.day_of_week ?? null;

    // ============================
    // حساب الشهر الحالي والشهر التالي فقط
    // ============================
    const {currentYear, currentMonth, nextYear, nextMonth} = useMemo(() => {
        const now = new Date();
        const cYear = now.getFullYear();
        const cMonth = now.getMonth();
        const nYear = cMonth === 11 ? cYear + 1 : cYear;
        const nMonth = cMonth === 11 ? 0 : cMonth + 1;
        return {
            currentYear: cYear,
            currentMonth: cMonth,
            nextYear: nYear,
            nextMonth: nMonth,
        };
    }, []);

    const [calendarMonth, setCalendarMonth] = useState(() => ({
        year: currentYear,
        month: currentMonth,
    }));

    const isCurrentMonth =
        calendarMonth.year === currentYear &&
        calendarMonth.month === currentMonth;

    const isNextMonth =
        calendarMonth.year === nextYear && calendarMonth.month === nextMonth;

    // ============================
    // حساب رقم اليوم المسموح
    // ============================
    const allowedDayNum = useMemo(() => {
        if (!selectedDayOfWeek) return null;
        return DAY_NAME_TO_NUM[selectedDayOfWeek] ?? null;
    }, [selectedDayOfWeek]);

    // معرفة عدد الايام في الشهر
    const calendarDays = useMemo(() => {
        const {year, month} = calendarMonth;
        // معرفت عدد الايام في الشهر
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // معرفة اول يوم في الشهر
        const firstDay = new Date(year, month, 1).getDay();
        return {daysInMonth, firstDay};
    }, [calendarMonth]);

    // الايام المسموح (فيه دوام)
    const isDayAllowed = useCallback(
        (dayNum: number) => {
            if (allowedDayNum === null) return false;
            const {year, month} = calendarMonth;
            const date = new Date(year, month, dayNum);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // يجب أن يكون تاريخ مستقبلي (بعد اليوم) ونفس يوم الدوام
            return date > today && date.getDay() === allowedDayNum;
        },
        [allowedDayNum, calendarMonth],
    );

    const handleSelectDate = (dayNum: number) => {
        const {year, month} = calendarMonth;
        const mStr = String(month + 1).padStart(2, "0");
        const dStr = String(dayNum).padStart(2, "0");
        onSelectDate(`${year}-${mStr}-${dStr}`);
    };

    const handleNextMonth = () => {
        if (isCurrentMonth) {
            setCalendarMonth({year: nextYear, month: nextMonth});
        }
    };

    const handlePrevMonth = () => {
        if (isNextMonth) {
            setCalendarMonth({year: currentYear, month: currentMonth});
        }
    };

    if (!selectedSchedule) return null;

    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{textAlign: "right"}}>
                اختر تاريخ الموعد
            </Text>

            {/* ملاحظة اليوم المسموح */}
            <View className="mb-3 flex-row-reverse items-center gap-2 rounded-xl border border-main/20 bg-main/10 p-3">
                <Ionicons name="information-circle" size={18} color="#10b981" />
                <Text
                    className="flex-1 font-sans-medium text-xs text-main"
                    style={{textAlign: "right"}}>
                    يمكنك فقط اختيار أيام{" "}
                    <Text className="font-sans-bold">{selectedDayOfWeek}</Text>{" "}
                    المتاحة خلال الشهر الحالي والشهر القادم
                </Text>
            </View>

            {/* بطاقة التقويم */}
            <View
                className={`rounded-2xl border p-4 ${
                    errorMessage
                        ? "border-red-500/50"
                        : isDark
                          ? "border-slate-700 bg-slate-900/60"
                          : "border-slate-200 bg-slate-50"
                }`}>
                {/* التنقل بين الشهرين فقط */}
                <View className="mb-3 flex-row-reverse items-center justify-between">
                    <Text
                        className={`font-sans-bold text-base ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>
                        {MONTHS_AR[calendarMonth.month]} {calendarMonth.year}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        {/* زر الشهر التالي */}
                        <Pressable
                            disabled={isNextMonth}
                            onPress={handleNextMonth}
                            className={`size-8 items-center justify-center rounded-lg ${
                                isDark ? "bg-slate-800" : "bg-white"
                            } ${isNextMonth ? "opacity-30" : "active:opacity-70"}`}>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={isDark ? "#fff" : "#1e293b"}
                            />
                        </Pressable>
                        {/* زر الشهر السابق */}
                        <Pressable
                            disabled={isCurrentMonth}
                            onPress={handlePrevMonth}
                            className={`size-8 items-center justify-center rounded-lg ${
                                isDark ? "bg-slate-800" : "bg-white"
                            } ${isCurrentMonth ? "opacity-30" : "active:opacity-70"}`}>
                            <Ionicons
                                name="chevron-back"
                                size={16}
                                color={isDark ? "#fff" : "#1e293b"}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* أسماء الأيام */}
                <View className="mb-2 flex-row-reverse justify-between">
                    {DAYS_AR_SHORT.map((day, idx) => (
                        <View key={idx} className="w-10 items-center">
                            <Text className="font-sans-bold text-xs text-slate-400">
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* شبكة الأيام */}
                <View className="flex-row-reverse flex-wrap">
                    {Array.from({length: calendarDays.firstDay}).map(
                        (_, idx) => (
                            <View
                                key={`empty-${idx}`}
                                className="my-0.5 h-10 w-11"
                            />
                        ),
                    )}
                    {Array.from({length: calendarDays.daysInMonth}).map(
                        (_, idx) => {
                            const dayNum = idx + 1;
                            const allowed = isDayAllowed(dayNum);
                            const {year, month} = calendarMonth;
                            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                            const isSelected = appointmentDate === dateStr;

                            return (
                                <View
                                    key={dayNum}
                                    className="my-0.5 w-11 items-center">
                                    <Pressable
                                        disabled={!allowed}
                                        onPress={() => handleSelectDate(dayNum)}
                                        className={`size-10 items-center justify-center rounded-xl ${
                                            isSelected
                                                ? "bg-main shadow-md"
                                                : allowed
                                                  ? isDark
                                                      ? "bg-slate-800"
                                                      : "bg-white"
                                                  : "bg-transparent"
                                        }`}>
                                        <Text
                                            className={`font-sans-bold text-sm ${
                                                isSelected
                                                    ? "text-white"
                                                    : allowed
                                                      ? isDark
                                                          ? "text-green-400"
                                                          : "text-green-700"
                                                      : isDark
                                                        ? "text-slate-700"
                                                        : "text-slate-300"
                                            }`}>
                                            {dayNum}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        },
                    )}
                </View>
            </View>

            {/* التاريخ المختار */}
            {appointmentDate ? (
                <View className="mt-2 flex-row-reverse items-center gap-2 rounded-xl border border-main/20 bg-main/10 px-3 py-2">
                    <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10b981"
                    />
                    <Text className="font-sans-bold text-sm text-main">
                        التاريخ المختار: {appointmentDate}
                    </Text>
                </View>
            ) : null}

            {errorMessage ? (
                <Text
                    className="mt-1 font-sans-medium text-xs text-red-500"
                    style={{textAlign: "right"}}>
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

export default memo(AppointmentCalendar);
