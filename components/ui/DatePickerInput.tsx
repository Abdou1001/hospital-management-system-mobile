import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useThemeStore } from "@/store/theme.store";

interface DatePickerInputProps {
    value?: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    minYear?: number;
    maxYear?: number;
}

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

const DAYS_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
    value,
    onChange,
    label,
    placeholder = "اختر التاريخ",
    error,
    minYear = 1940,
    maxYear = new Date().getFullYear(),
}) => {
    const { isDark } = useThemeStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState<"year" | "month" | "day">("year");

    // التحليل المبدئي للتاريخ المختار
    const initialDate = useMemo(() => {
        if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date(2000, 0, 1);
    }, [value]);

    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

    const handleOpenModal = () => {
        if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split("-").map(Number);
            setSelectedYear(y);
            setSelectedMonth(m - 1);
            setSelectedDay(d);
        }
        setViewMode("year");
        setModalVisible(true);
    };

    // حاسبة أيام الشهر
    const daysInMonth = useMemo(() => {
        return new Date(selectedYear, selectedMonth + 1, 0).getDate();
    }, [selectedYear, selectedMonth]);

    const firstDayOfWeek = useMemo(() => {
        return new Date(selectedYear, selectedMonth, 1).getDay();
    }, [selectedYear, selectedMonth]);

    const handlePrevMonth = () => {
        if (selectedMonth === 0) {
            if (selectedYear > minYear) {
                setSelectedYear(selectedYear - 1);
                setSelectedMonth(11);
            }
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 11) {
            if (selectedYear < maxYear) {
                setSelectedYear(selectedYear + 1);
                setSelectedMonth(0);
            }
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const handleConfirm = () => {
        const validDay = Math.min(selectedDay, daysInMonth);
        const mStr = String(selectedMonth + 1).padStart(2, "0");
        const dStr = String(validDay).padStart(2, "0");
        const dateStr = `${selectedYear}-${mStr}-${dStr}`;
        onChange(dateStr);
        setModalVisible(false);
    };

    // قائمة السنوات لسرعة الاختيار
    const yearsList = useMemo(() => {
        const list: number[] = [];
        for (let y = maxYear; y >= minYear; y--) {
            list.push(y);
        }
        return list;
    }, [minYear, maxYear]);

    return (
        <View className="w-full">
            {label ? (
                <Text
                    className={`mb-2 font-sans-bold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                    style={{ textAlign: "right" }}>
                    {label}
                </Text>
            ) : null}

            {/* زر فتح المودال */}
            <Pressable
                onPress={handleOpenModal}
                className={`h-14 w-full flex-row-reverse items-center justify-between rounded-2xl border px-4 ${
                    error
                        ? "border-red-500 bg-red-50/20"
                        : isDark
                          ? "border-slate-700 bg-slate-900/60"
                          : "border-slate-200 bg-slate-50"
                }`}>
                <Text
                    className={`font-sans-medium text-base ${
                        value
                            ? isDark
                                ? "text-white"
                                : "text-slate-900"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                    }`}>
                    {value || placeholder}
                </Text>
                <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={isDark ? "#94a3b8" : "#64748b"}
                />
            </Pressable>

            {error ? (
                <Text
                    className="mt-1 font-sans-medium text-xs text-red-500"
                    style={{ textAlign: "right" }}>
                    {error}
                </Text>
            ) : null}

            {/* مودال التقويم */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 items-center justify-center bg-black/60 px-5">
                    <View
                        className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${
                            isDark
                                ? "border-slate-800 bg-slate-900"
                                : "border-slate-100 bg-white"
                        }`}>
                        {/* الهيدر العلوي للمودال */}
                        <View className="mb-3 flex-row-reverse items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                            <View className="flex-row-reverse items-center gap-2">
                                <Ionicons name="calendar" size={20} color="#10b981" />
                                <Text className="font-sans-bold text-lg text-main">
                                    {viewMode === "year"
                                        ? "اختر السنة"
                                        : viewMode === "month"
                                          ? "اختر الشهر"
                                          : "اختر اليوم"}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={isDark ? "#94a3b8" : "#64748b"}
                                />
                            </Pressable>
                        </View>

                        {/* شريط خطوات الاختيار (سنة -> شهر -> يوم) */}
                        <View className="mb-4 flex-row-reverse items-center justify-between gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-2xl">
                            {/* خطوة السنة */}
                            <Pressable
                                onPress={() => setViewMode("year")}
                                className={`flex-1 py-1.5 items-center justify-center rounded-xl ${
                                    viewMode === "year"
                                        ? "bg-main shadow-sm"
                                        : "bg-transparent"
                                }`}>
                                <Text
                                    className={`font-sans-medium text-[10px] ${
                                        viewMode === "year"
                                            ? "text-white/80"
                                            : isDark
                                              ? "text-slate-400"
                                              : "text-slate-500"
                                    }`}>
                                    السنة
                                </Text>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        viewMode === "year"
                                            ? "text-white"
                                            : isDark
                                              ? "text-slate-200"
                                              : "text-slate-700"
                                    }`}>
                                    {selectedYear}
                                </Text>
                            </Pressable>

                            {/* خطوة الشهر */}
                            <Pressable
                                onPress={() => setViewMode("month")}
                                className={`flex-1 py-1.5 items-center justify-center rounded-xl ${
                                    viewMode === "month"
                                        ? "bg-main shadow-sm"
                                        : "bg-transparent"
                                }`}>
                                <Text
                                    className={`font-sans-medium text-[10px] ${
                                        viewMode === "month"
                                            ? "text-white/80"
                                            : isDark
                                              ? "text-slate-400"
                                              : "text-slate-500"
                                    }`}>
                                    الشهر
                                </Text>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        viewMode === "month"
                                            ? "text-white"
                                            : isDark
                                              ? "text-slate-200"
                                              : "text-slate-700"
                                    }`}>
                                    {MONTHS_AR[selectedMonth]}
                                </Text>
                            </Pressable>

                            {/* خطوة اليوم */}
                            <Pressable
                                onPress={() => setViewMode("day")}
                                className={`flex-1 py-1.5 items-center justify-center rounded-xl ${
                                    viewMode === "day"
                                        ? "bg-main shadow-sm"
                                        : "bg-transparent"
                                }`}>
                                <Text
                                    className={`font-sans-medium text-[10px] ${
                                        viewMode === "day"
                                            ? "text-white/80"
                                            : isDark
                                              ? "text-slate-400"
                                              : "text-slate-500"
                                    }`}>
                                    اليوم
                                </Text>
                                <Text
                                    className={`font-sans-bold text-xs ${
                                        viewMode === "day"
                                            ? "text-white"
                                            : isDark
                                              ? "text-slate-200"
                                              : "text-slate-700"
                                    }`}>
                                    {Math.min(selectedDay, daysInMonth)}
                                </Text>
                            </Pressable>
                        </View>

                        {/* المحتوى بحسب الخطوة الحالية */}
                        {viewMode === "year" ? (
                            /* خطوة 1: اختيار السنة */
                            <View className="h-72 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-2">
                                <ScrollView showsVerticalScrollIndicator>
                                    <View className="flex-row-reverse flex-wrap justify-between gap-y-2 py-1">
                                        {yearsList.map((y) => {
                                            const isSelected = selectedYear === y;
                                            return (
                                                <Pressable
                                                    key={y}
                                                    onPress={() => {
                                                        setSelectedYear(y);
                                                        setViewMode("month");
                                                    }}
                                                    className={`w-[30%] py-2.5 items-center justify-center rounded-xl border ${
                                                        isSelected
                                                            ? "bg-main border-main shadow"
                                                            : isDark
                                                              ? "bg-slate-800 border-slate-700"
                                                              : "bg-white border-slate-200"
                                                    }`}>
                                                    <Text
                                                        className={`font-sans-bold text-sm ${
                                                            isSelected
                                                                ? "text-white"
                                                                : isDark
                                                                  ? "text-slate-200"
                                                                  : "text-slate-800"
                                                        }`}>
                                                        {y}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : viewMode === "month" ? (
                            /* خطوة 2: اختيار الشهر */
                            <View className="h-72 justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-2">
                                <View className="flex-row-reverse flex-wrap justify-between gap-y-2.5">
                                    {MONTHS_AR.map((name, idx) => {
                                        const isSelected = selectedMonth === idx;
                                        return (
                                            <Pressable
                                                key={idx}
                                                onPress={() => {
                                                    setSelectedMonth(idx);
                                                    setViewMode("day");
                                                }}
                                                className={`w-[31%] py-3 items-center justify-center rounded-2xl border ${
                                                    isSelected
                                                        ? "bg-main border-main shadow"
                                                        : isDark
                                                          ? "bg-slate-800 border-slate-700"
                                                          : "bg-white border-slate-200"
                                                }`}>
                                                <Text
                                                    className={`font-sans-bold text-sm ${
                                                        isSelected
                                                            ? "text-white"
                                                            : isDark
                                                              ? "text-slate-200"
                                                              : "text-slate-800"
                                                    }`}>
                                                    {name}
                                                </Text>
                                                <Text
                                                    className={`font-sans-medium text-xs mt-0.5 ${
                                                        isSelected
                                                            ? "text-white/80"
                                                            : isDark
                                                              ? "text-slate-400"
                                                              : "text-slate-500"
                                                    }`}>
                                                    {idx + 1}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : (
                            /* خطوة 3: اختيار اليوم */
                            <View className="min-h-[288px]">
                                {/* تنقل الشهر والسنة السريع داخل عرض اليوم */}
                                <View className="mb-3 flex-row-reverse items-center justify-between px-1">
                                    <View className="flex-row-reverse items-center gap-1.5">
                                        <Pressable
                                            onPress={() => setViewMode("month")}
                                            className="flex-row-reverse items-center gap-1 bg-main/10 px-2.5 py-1 rounded-lg border border-main/20">
                                            <Text className="font-sans-bold text-sm text-main">
                                                {MONTHS_AR[selectedMonth]}
                                            </Text>
                                            <Ionicons name="chevron-down" size={14} color="#10b981" />
                                        </Pressable>

                                        <Pressable
                                            onPress={() => setViewMode("year")}
                                            className="flex-row-reverse items-center gap-1 bg-main/10 px-2.5 py-1 rounded-lg border border-main/20">
                                            <Text className="font-sans-bold text-sm text-main">
                                                {selectedYear}
                                            </Text>
                                            <Ionicons name="chevron-down" size={14} color="#10b981" />
                                        </Pressable>
                                    </View>

                                    <View className="flex-row items-center gap-1.5">
                                        <Pressable
                                            onPress={handleNextMonth}
                                            className="size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                            <Ionicons
                                                name="chevron-forward"
                                                size={16}
                                                color={isDark ? "#ffffff" : "#1e293b"}
                                            />
                                        </Pressable>
                                        <Pressable
                                            onPress={handlePrevMonth}
                                            className="size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                            <Ionicons
                                                name="chevron-back"
                                                size={16}
                                                color={isDark ? "#ffffff" : "#1e293b"}
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                {/* أسماء أيام الأسبوع */}
                                <View className="flex-row-reverse mb-2">
                                    {DAYS_AR.map((day, idx) => (
                                        <View key={idx} className="w-[14.28%] items-center justify-center">
                                            <Text className="font-sans-bold text-xs text-slate-400">
                                                {day}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* شبكة أيام الشهر */}
                                <View className="flex-row-reverse flex-wrap">
                                    {/* فراغات بداية الشهر */}
                                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                                        <View key={`empty-${idx}`} className="w-[14.28%] h-9 my-0.5" />
                                    ))}

                                    {/* الأيام الفعلية */}
                                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                                        const dayNum = idx + 1;
                                        const isSelected = Math.min(selectedDay, daysInMonth) === dayNum;

                                        return (
                                            <View key={dayNum} className="w-[14.28%] my-0.5 items-center justify-center">
                                                <Pressable
                                                    onPress={() => setSelectedDay(dayNum)}
                                                    className={`size-9 items-center justify-center rounded-xl ${
                                                        isSelected
                                                            ? "bg-main shadow-md"
                                                            : "bg-transparent"
                                                    }`}>
                                                    <Text
                                                        className={`font-sans-bold text-sm ${
                                                            isSelected
                                                                ? "text-white"
                                                                : isDark
                                                                  ? "text-slate-200"
                                                                  : "text-slate-800"
                                                        }`}>
                                                        {dayNum}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* أزرار الإجراءات */}
                        <View className="mt-4 flex-row-reverse gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Pressable
                                onPress={handleConfirm}
                                className="flex-1 h-12 items-center justify-center rounded-xl bg-main shadow">
                                <Text className="font-sans-bold text-sm text-white">
                                    تأكيد الاختيار
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="h-12 px-5 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                <Text className="font-sans-bold text-sm text-slate-600 dark:text-slate-400">
                                    إلغاء
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePickerInput;

