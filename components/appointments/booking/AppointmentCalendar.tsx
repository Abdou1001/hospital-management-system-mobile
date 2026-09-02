import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

// ============================
// أسماء الأيام العربية المختصرة
// ============================
const DAYS_AR_SHORT = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const MONTHS_AR = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// ============================
// خريطة الأيام العربية إلى أرقام
// ============================
const DAY_NAME_TO_NUM: Record<string, number> = {
    "الأحد": 0,
    "الاثنين": 1,
    "الاتنين": 1,
    "الثلاثاء": 2,
    "الأربعاء": 3,
    "الخميس": 4,
    "الجمعة": 5,
    "السبت": 6,
};

interface AppointmentCalendarProps {
    selectedDayOfWeek: string | null; // اسم اليوم العربي (مثل "السبت")
    appointmentDate: string;
    setAppointmentDate: (date: string) => void;
    errors: Record<string, string>;
    isDark: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    selectedDayOfWeek,
    appointmentDate,
    setAppointmentDate,
    errors,
    isDark,
}) => {
    // ============================
    // حساب رقم اليوم المسموح
    // ============================
    const allowedDayNum = useMemo(() => {
        if (!selectedDayOfWeek) return null;
        return DAY_NAME_TO_NUM[selectedDayOfWeek] ?? null;
    }, [selectedDayOfWeek]);

    // ============================
    // التقويم المخصص - الشهر الحالي
    // ============================
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const calendarDays = useMemo(() => {
        const { year, month } = calendarMonth;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDay };
    }, [calendarMonth]);

    // ============================
    // حساب حدود الشهرين القادمين
    // ============================
    const maxDate = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const max = new Date(now);
        max.setMonth(max.getMonth() + 2);
        return max;
    }, []);

    const isDayAllowed = useCallback(
        (dayNum: number) => {
            if (allowedDayNum === null) return false;
            const { year, month } = calendarMonth;
            const date = new Date(year, month, dayNum);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // يجب أن يكون بعد اليوم ونفس يوم الدوام وضمن الشهرين القادمين
            return date > today && date <= maxDate && date.getDay() === allowedDayNum;
        },
        [allowedDayNum, calendarMonth, maxDate]
    );

    const handleSelectDate = (dayNum: number) => {
        const { year, month } = calendarMonth;
        const mStr = String(month + 1).padStart(2, "0");
        const dStr = String(dayNum).padStart(2, "0");
        setAppointmentDate(`${year}-${mStr}-${dStr}`);
    };

    return (
        <View className="mt-5">
            <Text
                className={`mb-2 font-sans-bold text-sm ${
                    isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{ textAlign: "right" }}>
                اختر تاريخ الموعد
            </Text>

            {/* ملاحظة اليوم المسموح */}
            <View className="mb-3 flex-row-reverse items-center gap-2 rounded-xl border border-main/20 bg-main/10 p-3">
                <Ionicons name="information-circle" size={18} color="#10b981" />
                <Text className="flex-1 font-sans-medium text-xs text-main" style={{ textAlign: "right" }}>
                    يمكنك فقط اختيار أيام{" "}
                    <Text className="font-sans-bold">{selectedDayOfWeek}</Text>{" "}
                    القادمة خلال الشهرين القادمين
                </Text>
            </View>

            {/* بطاقة التقويم */}
            <View
                className={`rounded-2xl border p-4 ${
                    errors.appointment_date
                        ? "border-red-500/50"
                        : isDark
                          ? "border-slate-700 bg-slate-900/60"
                          : "border-slate-200 bg-slate-50"
                }`}>
                {/* التنقل بين الأشهر */}
                <View className="mb-3 flex-row-reverse items-center justify-between">
                    <Text className={`font-sans-bold text-base ${isDark ? "text-white" : "text-slate-800"}`}>
                        {MONTHS_AR[calendarMonth.month]} {calendarMonth.year}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <Pressable
                            onPress={() => {
                                setCalendarMonth((prev) => {
                                    if (prev.month === 11)
                                        return { year: prev.year + 1, month: 0 };
                                    return { ...prev, month: prev.month + 1 };
                                });
                            }}
                            className={`size-8 items-center justify-center rounded-lg ${isDark ? "bg-slate-800" : "bg-white"}`}>
                            <Ionicons name="chevron-forward" size={16} color={isDark ? "#fff" : "#1e293b"} />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setCalendarMonth((prev) => {
                                    if (prev.month === 0)
                                        return { year: prev.year - 1, month: 11 };
                                    return { ...prev, month: prev.month - 1 };
                                });
                            }}
                            className={`size-8 items-center justify-center rounded-lg ${isDark ? "bg-slate-800" : "bg-white"}`}>
                            <Ionicons name="chevron-back" size={16} color={isDark ? "#fff" : "#1e293b"} />
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
                    {Array.from({ length: calendarDays.firstDay }).map((_, idx) => (
                        <View key={`empty-${idx}`} className="my-0.5 h-10 w-10" />
                    ))}
                    {Array.from({ length: calendarDays.daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const allowed = isDayAllowed(dayNum);
                        const { year, month } = calendarMonth;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                        const isSelected = appointmentDate === dateStr;

                        return (
                            <View key={dayNum} className="my-0.5 w-10 items-center">
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
                    })}
                </View>
            </View>

            {/* التاريخ المختار */}
            {appointmentDate ? (
                <View className="mt-2 flex-row-reverse items-center gap-2 rounded-xl border border-main/20 bg-main/10 px-3 py-2">
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text className="font-sans-bold text-sm text-main">
                        التاريخ المختار: {appointmentDate}
                    </Text>
                </View>
            ) : null}

            {errors.appointment_date ? (
                <Text className="mt-1 font-sans-medium text-xs text-red-500" style={{ textAlign: "right" }}>
                    {errors.appointment_date}
                </Text>
            ) : null}
        </View>
    );
};

export default AppointmentCalendar;
